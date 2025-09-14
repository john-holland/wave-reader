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
  return {
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
    }
  };
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
