export interface MockResponseContext {
    request?: RequestInfo | URL;
    init?: RequestInit;
    payload?: any;
}

export interface MockBackendResult<T = any> {
    data: T;
    backendDisabled: boolean;
    metadata?: Record<string, any>;
}

const now = () => new Date().toISOString();

const mockGenerators: Record<string, (context: MockResponseContext) => any> = {
    'wave/start': (context) => ({
        success: true,
        message: 'Wave reader started (mock)',
        selector: context.payload?.selector ?? 'p',
        options: context.payload?.options ?? {},
        timestamp: now(),
        mocked: true
    }),
    'wave/stop': () => ({
        success: true,
        message: 'Wave reader stopped (mock)',
        timestamp: now(),
        mocked: true
    }),
    'wave/status': () => ({
        success: true,
        status: 'stopped',
        going: false,
        timestamp: now(),
        mocked: true
    }),
    'wave/health': () => ({
        success: true,
        status: 'healthy',
        timestamp: now(),
        mocked: true
    }),
    'ml/recommendations': (context) => ({
        success: true,
        recommendations: [
            {
                confidence: 0.92,
                selector: context.payload?.selector ?? 'p',
                settings: context.payload?.settings ?? {},
                reasoning: ['Mocked ML recommendation']
            }
        ],
        timestamp: now(),
        mocked: true
    }),
    'ml/stats': () => ({
        success: true,
        patterns: 0,
        averageConfidence: 0,
        domainCoverage: [],
        timestamp: now(),
        mocked: true
    }),
    graphql: () => ({
        data: {},
        errors: [],
        mocked: true
    }),
    default: () => ({
        success: true,
        mocked: true,
        timestamp: now()
    })
};

const normalizeKey = (key: string): string => key.replace(/^\/+|\/+$|\s+/g, '').toLowerCase();

export function resolveMockKeyForEndpoint(endpoint: string, explicit?: string): string {
    if (explicit) {
        return explicit;
    }

    try {
        const url = new URL(endpoint, 'http://localhost');
        const path = url.pathname.replace(/^\//, '');

        if (path.startsWith('api/wave-reader/start')) {
            return 'wave/start';
        }
        if (path.startsWith('api/wave-reader/stop')) {
            return 'wave/stop';
        }
        if (path.startsWith('api/wave-reader/status')) {
            return 'wave/status';
        }
        if (path.startsWith('api/wave-reader/health')) {
            return 'wave/health';
        }
        if (path.startsWith('api/ml/recommendations')) {
            return 'ml/recommendations';
        }
        if (path.startsWith('api/ml/stats')) {
            return 'ml/stats';
        }

        return 'default';
    } catch (error) {
        console.warn('Failed to resolve mock key for endpoint, defaulting to mock "default"', error);
        return 'default';
    }
}

export function getMockBackendData(key: string, context: MockResponseContext = {}): any {
    const generator = mockGenerators[normalizeKey(key)] || mockGenerators.default;
    return generator(context);
}

export function createMockBackendResult(key: string, context: MockResponseContext = {}): MockBackendResult {
    const resolvedKey = normalizeKey(key);
    const data = getMockBackendData(resolvedKey, context);
    return {
        data,
        backendDisabled: true,
        metadata: {
            key: resolvedKey,
            generatedAt: now()
        }
    };
}
