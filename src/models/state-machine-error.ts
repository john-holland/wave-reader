export interface StateMachineError {
    code: string;
    message: string;
    version: string;
    cause?: string;
    subMachineId?: string;
    featureFlags?: Map<string, boolean>;
} 