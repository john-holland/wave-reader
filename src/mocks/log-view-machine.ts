// Mock implementation of log-view-machine for development
// This allows the build to complete while we work on the actual integration

export class StructuralSystem {
  constructor(config: any) {
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
}

export function createViewStateMachine(config: any) {
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
    }
  };
}

export function createStructuralConfig(config: any) {
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
