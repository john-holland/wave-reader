/**
 * Feature Toggles Configuration
 * 
 * Manages feature flags using Unleash
 * Default values are for release builds (conservative/safe defaults)
 */

export const FEATURE_TOGGLES = {
    // Backend API Integration
    ENABLE_BACKEND_API_REQUESTS: 'enable-backend-api-requests',
    
    // Premium Features
    ENABLE_PREMIUM_EDITOR: 'enable-premium-editor',
    ENABLE_MOD_MARKETPLACE: 'enable-mod-marketplace',
    
    // Token Economy
    ENABLE_TOKEN_SYSTEM: 'enable-token-system',
    ENABLE_DONATIONS: 'enable-donations',
    
    // Developer Features
    DEVELOPER_MODE: 'developer-mode',
} as const;

export const DEFAULT_TOGGLE_VALUES = {
    [FEATURE_TOGGLES.ENABLE_BACKEND_API_REQUESTS]: false, // Off by default for release
    [FEATURE_TOGGLES.ENABLE_PREMIUM_EDITOR]: false,
    [FEATURE_TOGGLES.ENABLE_MOD_MARKETPLACE]: false,
    [FEATURE_TOGGLES.ENABLE_TOKEN_SYSTEM]: false,
    [FEATURE_TOGGLES.ENABLE_DONATIONS]: false,
    [FEATURE_TOGGLES.DEVELOPER_MODE]: process.env.NODE_ENV === 'development',
};

/**
 * Feature Toggle Service
 * Wraps RobotCopy.isEnabled with typed toggle names
 */
export class FeatureToggleService {
    private robotCopy: any;
    
    constructor(robotCopy: any) {
        this.robotCopy = robotCopy;
    }
    
    async isEnabled(toggle: keyof typeof FEATURE_TOGGLES): Promise<boolean> {
        try {
            const toggleName = FEATURE_TOGGLES[toggle];
            const enabled = await this.robotCopy.isEnabled(toggleName);
            return enabled;
        } catch (error) {
            console.warn(`Feature toggle check failed for ${toggle}, using default`);
            return DEFAULT_TOGGLE_VALUES[FEATURE_TOGGLES[toggle]] ?? false;
        }
    }
    
    async canMakeBackendRequests(): Promise<boolean> {
        return this.isEnabled('ENABLE_BACKEND_API_REQUESTS');
    }
    
    async isPremiumEditorEnabled(): Promise<boolean> {
        return this.isEnabled('ENABLE_PREMIUM_EDITOR');
    }
    
    async isModMarketplaceEnabled(): Promise<boolean> {
        return this.isEnabled('ENABLE_MOD_MARKETPLACE');
    }
    
    async isDeveloperMode(): Promise<boolean> {
        return this.isEnabled('DEVELOPER_MODE');
    }
}

