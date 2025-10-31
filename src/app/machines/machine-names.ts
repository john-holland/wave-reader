/**
 * Machine Name Constants
 * 
 * Centralized constants for machine names used in routed send patterns
 * Prevents hardcoding machine names throughout the codebase
 */

export const MACHINE_NAMES = {
    CHROME_API: 'ChromeApiMachine',
    APP: 'AppMachine'
} as const;

/**
 * Type-safe machine name type
 */
export type MachineName = typeof MACHINE_NAMES[keyof typeof MACHINE_NAMES];


