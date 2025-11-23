import { FeatureToggleService, getDefaultBackendRequestState } from '../config/feature-toggles';
import { createMockBackendResult, MockResponseContext, resolveMockKeyForEndpoint } from './mock-backend-responses';

let toggleService: FeatureToggleService | null = null;
let backendOverride: boolean | null = null;

export interface BackendRequestOptions {
    endpoint: string;
    options?: RequestInit;
    mockKey?: string;
    payload?: Record<string, unknown>;
    context?: Record<string, unknown>;
}

export interface BackendRequestResult<T = any> {
    data: T;
    backendDisabled: boolean;
    response: Response;
    mockKey?: string;
}

export const registerBackendToggleService = (service: FeatureToggleService) => {
    toggleService = service;
};

export const setBackendRequestOverride = (enabled: boolean | null) => {
    backendOverride = enabled;
};

const isBackendEnabled = async (): Promise<boolean> => {
    if (backendOverride !== null) {
        return backendOverride;
    }

    if (toggleService) {
        try {
            return await toggleService.canMakeBackendRequests();
        } catch (error) {
            console.warn('Failed to evaluate backend request toggle, using default.', error);
        }
    }

    return getDefaultBackendRequestState();
};

const createMockResponse = (key: string, context: MockResponseContext = {}): Response => {
    const { data } = createMockBackendResult(key, context);
    const headers = new Headers({
        'Content-Type': 'application/json',
        'X-Backend-Disabled': 'true'
    });
    return new Response(JSON.stringify(data), {
        status: 200,
        headers
    });
};

export const safeFetch = async (
    input: RequestInfo | URL,
    init: RequestInit = {},
    mockKey = 'default',
    context: MockResponseContext = {}
): Promise<Response> => {
    const enabled = await isBackendEnabled();

    if (enabled) {
        return fetch(input, init);
    }

    return createMockResponse(mockKey, {
        ...context,
        request: input,
        init
    });
};

export const performBackendRequest = async <T = any>({
    endpoint,
    options = {},
    mockKey = 'default',
    payload,
    context = {}
}: BackendRequestOptions): Promise<BackendRequestResult<T>> => {
    const effectiveMockKey = resolveMockKeyForEndpoint(endpoint, mockKey);

    const response = await safeFetch(
        endpoint,
        options,
        effectiveMockKey,
        {
            ...context,
            payload
        }
    );

    const backendDisabled = response.headers?.get?.('X-Backend-Disabled') === 'true';
    const data = (await response.json()) as T;

    return {
        data,
        backendDisabled,
        response,
        mockKey: effectiveMockKey
    };
};

export interface GraphQLRequestOptions {
    endpoint: string;
    query: string;
    variables?: Record<string, unknown>;
    requestInit?: RequestInit;
    mockKey?: string;
    context?: Record<string, unknown>;
}

export interface GraphQLRequestResult<T = any> {
    data: T;
    errors?: any;
    backendDisabled: boolean;
}

export const safeGraphQLRequest = async <T = any>({
    endpoint,
    query,
    variables = {},
    requestInit = {},
    mockKey = 'graphql',
    context = {}
}: GraphQLRequestOptions): Promise<GraphQLRequestResult<T>> => {
    const body = JSON.stringify({ query, variables });
    const headers = {
        'Content-Type': 'application/json',
        ...(requestInit.headers || {})
    } as Record<string, string>;

    const response = await safeFetch(
        endpoint,
        {
            method: 'POST',
            ...requestInit,
            headers,
            body
        },
        mockKey,
        {
            ...context,
            payload: { query, variables }
        }
    );

    const backendDisabled = response.headers.get('X-Backend-Disabled') === 'true';
    const json = await response.json();

    const data = json?.data ?? json;
    const errors = json?.errors;

    return {
        data,
        errors,
        backendDisabled
    };
};

export const getBackendRequestState = async (): Promise<boolean> => isBackendEnabled();
