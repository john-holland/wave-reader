import {State} from "./state";

// Base ventures - system-level states
export const BaseVentures: string[] = ["base", "error"];

// Start ventures - when starting the wave reader
export const StartVentures: string[] = ["start", "waving"];

// Stop ventures - when stopping or updating the wave reader
export const StopVentures: string[] = ["stop", "update", "toggle start", "start mouse"];

// Waving ventures - when the wave reader is active
export const WavingVentures: string[] = [
    "stop", 
    "toggle stop", 
    "update", 
    "stop mouse", 
    "start", 
    "start-selection-choose"
];

// All ventures - comprehensive list of all possible state transitions
export const AllVentures: string[] = [
    // Base operations
    "start", 
    "stop", 
    "update", 
    
    // Toggle operations
    "toggle start", 
    "toggle stop", 
    
    // Mouse operations
    "start mouse", 
    "stop mouse", 
    
    // Selection operations
    "selection mode activate", 
    "selection made", 
    "selection mode deactivate",
    "start-selection-choose",
    "end-selection-choose",
    
    // ML and enhanced operations
    "ml-recommendation",
    "settings-reset",
    "behavior-pattern",
    "wave-reader-start",
    "wave-reader-stop",
    "wave-reader-update",
    
    // Analytics and monitoring
    "analytics",
    "health-check",
    
    // Extension management
    "extension-install",
    "extension-update",
    
    // Legacy operations (for backward compatibility)
    "toggle-wave-reader",
    "bootstrap",
    "bootstrap-result",
    "heartbeat-result",
    "ping",
    "pong",
    "update-going-state",
    "update-wave",
    "selector-updated",
    "start-add-selector",
    "add-selector",
    "cancel-add-selector",
    "remove-selector",
    "selection-mode",
    "start-mouse-move",
    "stop-mouse-move",
    "update-selector"
];

// Create the base state with all possible ventures
export const Base: State = new State("base", [...StopVentures, "selection mode activate"], true);

// Export individual venture arrays for specific use cases
export const MLVentures: string[] = [
    "ml-recommendation",
    "settings-reset", 
    "behavior-pattern"
];

export const WaveReaderVentures: string[] = [
    "wave-reader-start",
    "wave-reader-stop",
    "wave-reader-update"
];

export const AnalyticsVentures: string[] = [
    "analytics",
    "health-check"
];

export const ExtensionVentures: string[] = [
    "extension-install",
    "extension-update"
];

// Validation function to ensure all venture names are valid
export const validateVentureName = (ventureName: string): boolean => {
    return AllVentures.includes(ventureName);
};

// Get ventures by category
export const getVenturesByCategory = (category: string): string[] => {
    const categoryMap: Record<string, string[]> = {
        'base': BaseVentures,
        'start': StartVentures,
        'stop': StopVentures,
        'waving': WavingVentures,
        'ml': MLVentures,
        'wave-reader': WaveReaderVentures,
        'analytics': AnalyticsVentures,
        'extension': ExtensionVentures,
        'all': AllVentures
    };
    
    return categoryMap[category] || [];
};

// Check if a venture belongs to a specific category
export const isVentureInCategory = (ventureName: string, category: string): boolean => {
    const categoryVentures = getVenturesByCategory(category);
    return categoryVentures.includes(ventureName);
};
