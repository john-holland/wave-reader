// Mock implementation of log-view-machine for development
// This allows the build to complete while we work on the actual integration

// ⚠️ PRODUCTION WARNING: This is a MOCK implementation!
// If you see this warning in production, the real log-view-machine integration is missing!
console.warn('🚨 MOCK WARNING: Using mock log-view-machine implementation! This should only be used during development. If you see this in production, the real integration is missing!');

export class StructuralSystem {
  constructor(config: any) {
    console.warn('🚨 MOCK StructuralSystem: This is a MOCK implementation! Real log-view-machine integration missing!');
    console.log('Mock StructuralSystem created with config:', config);
  }

  getMachine(name: string) {
    console.log('Mock getMachine called for:', name);
    return {
      send: async (message: any) => {
        console.log('Mock machine send called with:', message);
        return { success: true, data: message };
      }
    };
  }

  getStructuralSystem() {
    console.log('Mock getStructuralSystem called');
    return this;
  }

  getMessageStats() {
    console.log('Mock getMessageStats called');
    return {
      total: 0,
      success: 0,
      rate: 0.0
    };
  }

  async healthCheck() {
    console.log('Mock healthCheck called');
    return {
      status: 'healthy',
      timestamp: Date.now(),
      uptime: 0
    };
  }
}

export function createViewStateMachine(config: any) {
  console.warn('🚨 MOCK createViewStateMachine: This is a MOCK implementation! Real log-view-machine integration missing!');
  console.log('Mock createViewStateMachine called with:', config);
  
  const mockMachine = {
    send: async (message: any) => {
      console.log('Mock state machine send called with:', message);
      return { success: true, data: message };
    },
    subscribe: (callback: (state: any) => void) => {
      console.log('Mock state machine subscribe called');
      // Return a mock subscription object
      return {
        unsubscribe: () => {
          console.log('Mock subscription unsubscribe called');
        }
      };
    },
    getState: () => {
      console.log('Mock state machine getState called');
      return {
        value: 'idle',
        context: { isActive: false }
      };
    },
    start: async () => {
      console.log('Mock state machine start called');
      return Promise.resolve();
    },
    withState: function(this: any, stateName: string, handler: any) {
      console.log('Mock withState called for:', stateName);
      // Store the handler for this state
      if (!this.stateHandlers) {
        this.stateHandlers = {};
      }
      this.stateHandlers[stateName] = handler;
      return this; // Return 'this' for chaining
    },
    render: function(this: any) {
      console.log('Mock render called');
      // Get current state and call appropriate handler
      const state = this.getState();
      const currentState = state.value;
      
      if (this.stateHandlers && this.stateHandlers[currentState]) {
        const handler = this.stateHandlers[currentState];
        // Mock context for the handler
        const mockContext = {
          context: state.context,
          event: null,
          view: (component: any) => component,
          transition: (target: string) => console.log('Mock transition to:', target),
          send: (event: string) => console.log('Mock send event:', event),
          log: (message: string) => console.log('Mock log:', message),
          machine: this
        };
        return handler(mockContext);
      }
      
      return null;
    }
  };
  
  return mockMachine;
}

export function createStructuralConfig(config: any) {
  console.warn('🚨 MOCK createStructuralConfig: This is a MOCK implementation! Real log-view-machine integration missing!');
  console.log('Mock createStructuralConfig called with:', config);
  return config;
}

export interface AppStructureConfig {
  [key: string]: any;
}

export const StructuralTomeConnector = () => {
  console.log('Mock StructuralTomeConnector called');
  return null;
};

export const useStructuralTomeConnector = () => {
  console.log('Mock useStructuralTomeConnector called');
  return {
    isConnected: false,
    sendMessage: async () => ({ success: true })
  };
};

export const useRouter = () => {
  console.log('Mock useRouter called');
  return {
    currentRoute: '/',
    navigate: (route: string) => console.log('Mock navigate to:', route)
  };
};

export const StructuralRouter = () => {
  console.log('Mock StructuralRouter called');
  return null;
};

export const Route = ({ children }: { children: React.ReactNode }) => {
  console.log('Mock Route called');
  return children;
};

export const RouteFallback = ({ children }: { children: React.ReactNode }) => {
  console.log('Mock RouteFallback called');
  return children;
};

// Mock for createProxyRobotCopyStateMachine
export function createProxyRobotCopyStateMachine(config: any) {
  console.warn('🚨 MOCK createProxyRobotCopyStateMachine: This is a MOCK implementation!');
  console.log('Mock createProxyRobotCopyStateMachine called with:', config);
  return {
    send: async (message: any) => {
      console.log('Mock proxy robot copy send called with:', message);
      return { success: true, data: message };
    },
    subscribe: (callback: (state: any) => void) => {
      console.log('Mock proxy robot copy subscribe called');
      return {
        unsubscribe: () => {
          console.log('Mock proxy robot copy subscription unsubscribe called');
        }
      };
    },
    getState: () => {
      console.log('Mock proxy robot copy getState called');
      return {
        value: 'idle',
        context: { message: null }
      };
    },
    start: async () => {
      console.log('Mock proxy robot copy start called');
      return Promise.resolve();
    },
    withState: (stateName: string, handler: any) => {
      console.log('Mock proxy withState called for:', stateName);
      return this;
    }
  };
}

// Mock for createTomeConfig
export function createTomeConfig(config: any) {
  console.warn('🚨 MOCK createTomeConfig: This is a MOCK implementation!');
  console.log('Mock createTomeConfig called with:', config);
  return {
    id: config.id,
    name: config.name,
    description: config.description,
    version: config.version,
    machines: config.machines,
    dependencies: config.dependencies,
    author: config.author,
    createdAt: config.createdAt,
    lastModified: config.lastModified,
    tags: config.tags,
    priority: config.priority,
    stability: config.stability,
    routing: config.routing,
    start: () => {
      console.log('Mock TomeConfig start called');
    },
    stop: () => {
      console.log('Mock TomeConfig stop called');
    },
    getMachine: (name: string) => {
      console.log('Mock TomeConfig getMachine called for:', name);
      return config.machines[name];
    }
  };
}

// Mock for TomeManager
export class TomeManager {
  private static instance: TomeManager;
  private tomes: Map<string, any> = new Map();

  static getInstance(): TomeManager {
    if (!TomeManager.instance) {
      TomeManager.instance = new TomeManager();
    }
    return TomeManager.instance;
  }

  registerTome(tome: any) {
    console.warn('🚨 MOCK TomeManager.registerTome: This is a MOCK implementation!');
    console.log('Mock registerTome called with:', tome);
    this.tomes.set(tome.id, tome);
  }

  startTome(tomeId: string) {
    console.warn('🚨 MOCK TomeManager.startTome: This is a MOCK implementation!');
    console.log('Mock startTome called for:', tomeId);
    const tome = this.tomes.get(tomeId);
    if (tome && tome.start) {
      tome.start();
    }
  }

  stopTome(tomeId: string) {
    console.warn('🚨 MOCK TomeManager.stopTome: This is a MOCK implementation!');
    console.log('Mock stopTome called for:', tomeId);
    const tome = this.tomes.get(tomeId);
    if (tome && tome.stop) {
      tome.stop();
    }
  }

  getTome(tomeId: string) {
    console.log('Mock getTome called for:', tomeId);
    return this.tomes.get(tomeId);
  }
}
