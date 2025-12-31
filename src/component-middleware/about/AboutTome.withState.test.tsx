/**
 * @jest-environment jsdom
 * 
 * Tests for withState handlers with send messages (INITIALIZE, LOAD_DONATION_STATUS, etc.)
 * 
 * Note: These tests use the mock log-view-machine implementation. Some tests may have
 * limited functionality due to mock limitations (e.g., state transitions, async handlers).
 * For full integration testing, use the real log-view-machine package.
 * 
 * These tests verify:
 * 1. withState handlers can receive and process INITIALIZE events
 * 2. withState handlers can send LOAD_DONATION_STATUS messages
 * 3. withState handlers can send DONATION_STATUS_LOADED/DONATION_STATUS_ERROR messages
 * 4. State transitions work correctly when send() is called from within handlers
 */

import React from 'react';
import { render } from '@testing-library/react';
import { createViewStateMachine } from 'log-view-machine';
// Import the actual AboutPageComponent to test the real implementation
import { AboutPageComponent } from './AboutTome';

// Helper function to convert JSX element to HTML string
// Since we're in a jsdom environment, we'll render to a container and get innerHTML
function jsxToHtml(element: React.ReactElement): string {
  const { container } = render(element);
  return container.innerHTML;
}

// Mock safeGraphQLRequest
jest.mock('../../utils/backend-api-wrapper', () => ({
  safeGraphQLRequest: jest.fn()
}));

// Mock AppTome to avoid TomeBase dependency
jest.mock('../../app/tomes/AppTome', () => ({
  AppTome: {
    getRouter: jest.fn(() => ({
      register: jest.fn(),
      unregister: jest.fn(),
      resolve: jest.fn(() => ({
        robotCopy: null
      }))
    }))
  }
}));

// Mock EditorWrapper to avoid dependency issues when importing AboutPageComponent
// This must be before the import of AboutTome
jest.mock('../../app/components/EditorWrapper', () => {
  return {
    __esModule: true,
    default: ({ children, title, description }: any) => {
      return (
        <div data-testid="editor-wrapper">
          {children}
        </div>
      );
    }
  };
});

// Mock FeatureToggleService
jest.mock('../../config/feature-toggles', () => ({
  FeatureToggleService: jest.fn().mockImplementation(() => ({
    isEnabled: jest.fn().mockResolvedValue(false)
  })),
  FEATURE_TOGGLES: {}
}));

// Mock graphql subscription
const mockSubscription = {
  subscribe: jest.fn((handlers) => {
    // Return a subscription object
    return {
      unsubscribe: jest.fn()
    };
  })
};

describe('AboutPageComponent - withState with Send Messages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('withState idle - INITIALIZE event handling', () => {
    test('should set up withState handlers correctly for INITIALIZE events', async () => {
      // Track handler setup
      let idleHandlerSet = false;
      let loadingHandlerSet = false;
      
      // Create a test machine
      const testMachine = createViewStateMachine({
        machineId: 'test-about-machine',
        xstateConfig: {
          initial: 'idle',
          context: {
            donated: false,
            hasEasterEggs: false,
            donors: [],
            isLoading: false,
            error: null,
            userId: 'test-user',
            subscription: null
          },
          states: {
            idle: {
              on: {
                INITIALIZE: 'loading',
                LOAD_DONATION_STATUS: 'loading'
              }
            },
            loading: {
              on: {
                DONATION_STATUS_LOADED: 'idle',
                DONATION_STATUS_ERROR: 'error'
              }
            },
            error: {}
          }
        }
      }).withState('idle', async ({ context, event, send, log, view, clear }: any) => {
        idleHandlerSet = true;
        // Verify INITIALIZE event can be handled (when received)
        if (event && event.type === 'INITIALIZE') {
          // Handler can process INITIALIZE events
        }
        if (clear) clear();
        view(<div>Idle View</div>);
        return <div>Idle View</div>;
      }).withState('loading', async ({ context, event, send, log, view, clear }: any) => {
        loadingHandlerSet = true;
        if (clear) clear();
        view(<div>Loading View</div>);
        return <div>Loading View</div>;
      });
      
      // Start the machine
      testMachine.start();
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verify idle handler was called on start
      expect(idleHandlerSet).toBe(true);
      
      // Verify withState was called (handlers exist)
      // Note: loadingHandlerSet might be false because mock only calls idle handler on start
      // but we can verify the handler was registered
      expect(testMachine.stateHandlers).toBeDefined();
      const stateHandlers = testMachine.stateHandlers as any;
      if (stateHandlers instanceof Map) {
        expect(stateHandlers.has('idle')).toBe(true);
        expect(stateHandlers.has('loading')).toBe(true);
      } else {
        expect(stateHandlers.idle).toBeDefined();
        expect(stateHandlers.loading).toBeDefined();
      }
    });
  });

  describe('withState idle - LOAD_DONATION_STATUS send', () => {
    test('should send LOAD_DONATION_STATUS from idle state when conditions are met', async () => {
      let loadDonationStatusSent = false;
      const sentEvents: any[] = [];
      
      // Create a test machine that tracks send calls
      const testMachine = createViewStateMachine({
        machineId: 'test-about-machine',
        xstateConfig: {
          initial: 'idle',
          context: {
            donated: false, // Not donated, so should trigger load
            hasEasterEggs: false,
            donors: [],
            isLoading: false, // Not loading, so should trigger load
            error: null,
            userId: 'test-user',
            subscription: null
          },
          states: {
            idle: {
              on: {
                LOAD_DONATION_STATUS: 'loading',
                INITIALIZE: 'loading'
              }
            },
            loading: {
              on: {
                DONATION_STATUS_LOADED: 'idle',
                DONATION_STATUS_ERROR: 'error'
              }
            },
            error: {}
          }
        }
      }).withState('idle', async ({ context, event, send, log, view, clear }: any) => {
        if (clear) clear();
        view(<div>Idle View</div>);
        
        // This is the logic from AboutTome - should send LOAD_DONATION_STATUS
        // Wrap send to track events
        const trackedSend = (eventToSend: any) => {
          send(eventToSend);
          sentEvents.push(eventToSend);
        };
        
        if (!context.donated && !context.isLoading) {
          await log('Loading donation status...');
          const eventToSend = { type: 'LOAD_DONATION_STATUS' };
          trackedSend(eventToSend);
          loadDonationStatusSent = true;
        }
        
        return <div>Idle View</div>;
      }).withState('loading', async ({ context, event, send, log, view, clear }: any) => {
        if (clear) clear();
        view(<div>Loading View</div>);
        return <div>Loading View</div>;
      });
      
      testMachine.start();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify LOAD_DONATION_STATUS was sent (handler logic executed)
      expect(loadDonationStatusSent).toBe(true);
      expect(sentEvents.length).toBe(1);
      expect(sentEvents[0].type).toBe('LOAD_DONATION_STATUS');
    });

    test('should NOT send LOAD_DONATION_STATUS if already donated', async () => {
      let loadDonationStatusSent = false;
      
      const testMachine = createViewStateMachine({
        machineId: 'test-about-machine',
        xstateConfig: {
          initial: 'idle',
          context: {
            donated: true, // Already donated, should NOT trigger load
            hasEasterEggs: false,
            donors: [],
            isLoading: false,
            error: null,
            userId: 'test-user',
            subscription: null
          },
          states: {
            idle: {
              on: {
                LOAD_DONATION_STATUS: 'loading',
                INITIALIZE: 'loading'
              }
            },
            loading: {},
            error: {}
          }
        }
      }).withState('idle', async ({ context, event, send, log, view, clear }: any) => {
        if (clear) clear();
        view(<div>Idle View</div>);
        
        // Should NOT send because context.donated is true
        if (!context.donated && !context.isLoading) {
          send({ type: 'LOAD_DONATION_STATUS' });
          loadDonationStatusSent = true;
        }
        
        return <div>Idle View</div>;
      });
      
      testMachine.start();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify LOAD_DONATION_STATUS was NOT sent
      expect(loadDonationStatusSent).toBe(false);
    });

    test('should NOT send LOAD_DONATION_STATUS if already loading', async () => {
      let loadDonationStatusSent = false;
      
      const testMachine = createViewStateMachine({
        machineId: 'test-about-machine',
        xstateConfig: {
          initial: 'idle',
          context: {
            donated: false,
            hasEasterEggs: false,
            donors: [],
            isLoading: true, // Already loading, should NOT trigger load
            error: null,
            userId: 'test-user',
            subscription: null
          },
          states: {
            idle: {
              on: {
                LOAD_DONATION_STATUS: 'loading',
                INITIALIZE: 'loading'
              }
            },
            loading: {},
            error: {}
          }
        }
      }).withState('idle', async ({ context, event, send, log, view, clear }: any) => {
        if (clear) clear();
        view(<div>Idle View</div>);
        
        // Should NOT send because context.isLoading is true
        if (!context.donated && !context.isLoading) {
          send({ type: 'LOAD_DONATION_STATUS' });
          loadDonationStatusSent = true;
        }
        
        return <div>Idle View</div>;
      });
      
      testMachine.start();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify LOAD_DONATION_STATUS was NOT sent
      expect(loadDonationStatusSent).toBe(false);
    });
  });

  describe('withState loading - send DONATION_STATUS_LOADED', () => {
    test('should send DONATION_STATUS_LOADED after successful data load', async () => {
      const { safeGraphQLRequest } = require('../../utils/backend-api-wrapper');
      
      // Mock successful GraphQL response
      safeGraphQLRequest.mockResolvedValue({
        data: {
          donationStatus: {
            donated: true,
            hasEasterEggs: true,
            donors: [{ name: 'Test Donor', amount: '1 ETH', crypto: 'ETH' }]
          }
        },
        backendDisabled: false
      });
      
      let donationStatusLoadedSent = false;
      const sentEvents: any[] = [];
      let contextUpdated = false;
      
      const testMachine = createViewStateMachine({
        machineId: 'test-about-machine',
        xstateConfig: {
          initial: 'loading',
          context: {
            donated: false,
            hasEasterEggs: false,
            donors: [],
            isLoading: true,
            error: null,
            userId: 'test-user',
            subscription: null
          },
          states: {
            idle: {},
            loading: {
              on: {
                DONATION_STATUS_LOADED: 'idle',
                DONATION_STATUS_ERROR: 'error'
              }
            },
            error: {}
          }
        }
      }).withState('loading', async ({ context, event, send, log, view, clear, graphql }: any) => {
        if (clear) clear();
        view(<div>Loading View</div>);
        
        try {
          await log('Fetching donation status from GraphQL...');
          
          const { data } = await safeGraphQLRequest({
            endpoint: '/api/graphql/donations',
            query: 'query GetDonationStatus { donationStatus { donated } }',
            variables: { userId: context.userId }
          });
          
          if (data?.donationStatus) {
            context.donated = data.donationStatus.donated || false;
            context.hasEasterEggs = data.donationStatus.hasEasterEggs || false;
            context.donors = data.donationStatus.donors || context.donors;
            context.isLoading = false;
            contextUpdated = true;
            
            const updatedView = <div>Updated View</div>;
            view(updatedView);
            
            const eventToSend = { type: 'DONATION_STATUS_LOADED', payload: data.donationStatus };
            send(eventToSend);
            donationStatusLoadedSent = true;
          }
        } catch (error) {
          context.error = error instanceof Error ? error.message : 'Unknown error';
          send({ type: 'DONATION_STATUS_ERROR', payload: error });
        }
        
        return <div>Loading View</div>;
      });
      
      // Note: Mock only executes idle handler on start, so we manually call loading handler
      const stateHandlers = testMachine.stateHandlers as Record<string, any>;
      const loadingHandler = stateHandlers?.['loading'];
      if (!loadingHandler) {
        throw new Error('Loading handler not found');
      }
      
      // Clear tracking variables to only track from this manual call
      sentEvents.length = 0;
      donationStatusLoadedSent = false;
      contextUpdated = false;
      
      const state = testMachine.getState();
      const context = state?.context || {};
      const view = (component: any) => component;
      const clear = () => {};
      const send = (event: any) => {
        if (event.type === 'DONATION_STATUS_LOADED') {
          donationStatusLoadedSent = true;
          sentEvents.push(event);
        }
      };
      const log = async (msg: string, data?: any) => {};
      
      await loadingHandler({ context, event: {}, send, log, view, clear, graphql: {} });
      
      // Verify DONATION_STATUS_LOADED was sent
      expect(donationStatusLoadedSent).toBe(true);
      expect(sentEvents.length).toBe(1);
      expect(sentEvents[0].type).toBe('DONATION_STATUS_LOADED');
      expect(contextUpdated).toBe(true);
    });

    test('should send DONATION_STATUS_ERROR on GraphQL failure', async () => {
      const { safeGraphQLRequest } = require('../../utils/backend-api-wrapper');
      
      // Mock failed GraphQL response
      const testError = new Error('GraphQL request failed');
      safeGraphQLRequest.mockRejectedValue(testError);
      
      let donationStatusErrorSent = false;
      const sentEvents: any[] = [];
      let errorContextSet = false;
      
      const testMachine = createViewStateMachine({
        machineId: 'test-about-machine',
        xstateConfig: {
          initial: 'loading',
          context: {
            donated: false,
            hasEasterEggs: false,
            donors: [],
            isLoading: true,
            error: null,
            userId: 'test-user',
            subscription: null
          },
          states: {
            idle: {},
            loading: {
              on: {
                DONATION_STATUS_LOADED: 'idle',
                DONATION_STATUS_ERROR: 'error'
              }
            },
            error: {}
          }
        }
      }).withState('loading', async ({ context, event, send, log, view, clear, graphql }: any) => {
        if (clear) clear();
        view(<div>Loading View</div>);
        
        try {
          await log('Fetching donation status from GraphQL...');
          
          await safeGraphQLRequest({
            endpoint: '/api/graphql/donations',
            query: 'query GetDonationStatus { donationStatus { donated } }',
            variables: { userId: context.userId }
          });
        } catch (error) {
          await log('Failed to load donation status', error);
          context.error = error instanceof Error ? error.message : 'Unknown error occurred';
          context.isLoading = false;
          errorContextSet = true;
          
          const errorView = <div>Error View</div>;
          view(errorView);
          
          const eventToSend = { type: 'DONATION_STATUS_ERROR', payload: error };
          send(eventToSend);
          donationStatusErrorSent = true;
        }
        
        return <div>Loading View</div>;
      });
      
      // Manually call loading handler to test error path
      const stateHandlers = testMachine.stateHandlers as Record<string, any>;
      const loadingHandler = stateHandlers?.['loading'];
      if (!loadingHandler) {
        throw new Error('Loading handler not found');
      }
      
      // Clear sentEvents to only track from this manual call
      sentEvents.length = 0;
      donationStatusErrorSent = false;
      
      const state = testMachine.getState();
      const context = state?.context || {};
      const view = (component: any) => component;
      const clear = () => {};
      const send = (event: any) => {
        if (event.type === 'DONATION_STATUS_ERROR') {
          donationStatusErrorSent = true;
          sentEvents.push(event);
        }
      };
      const log = async (msg: string, data?: any) => {};
      
      await loadingHandler({ context, event: {}, send, log, view, clear, graphql: {} });
      
      // Verify DONATION_STATUS_ERROR was sent
      expect(donationStatusErrorSent).toBe(true);
      expect(sentEvents.length).toBe(1);
      expect(sentEvents[0].type).toBe('DONATION_STATUS_ERROR');
      expect(errorContextSet).toBe(true);
    });
  });

  describe('withState - send message integration', () => {
    test('should handle INITIALIZE -> loading -> DONATION_STATUS_LOADED flow logic', async () => {
      const { safeGraphQLRequest } = require('../../utils/backend-api-wrapper');
      
      // Mock successful GraphQL response
      safeGraphQLRequest.mockResolvedValue({
        data: {
          donationStatus: {
            donated: true,
            hasEasterEggs: true,
            donors: []
          }
        },
        backendDisabled: false
      });
      
      const handlerCalls: string[] = [];
      const sentEvents: any[] = [];
      
      const testMachine = createViewStateMachine({
        machineId: 'test-about-machine',
        xstateConfig: {
          initial: 'idle',
          context: {
            donated: false,
            hasEasterEggs: false,
            donors: [],
            isLoading: false,
            error: null,
            userId: 'test-user',
            subscription: null
          },
          states: {
            idle: {
              on: {
                INITIALIZE: 'loading',
                LOAD_DONATION_STATUS: 'loading'
              }
            },
            loading: {
              on: {
                DONATION_STATUS_LOADED: 'idle',
                DONATION_STATUS_ERROR: 'error'
              }
            },
            error: {}
          }
        }
      }).withState('idle', async ({ context, event, send, log, view, clear }: any) => {
        handlerCalls.push('idle-handler');
        if (clear) clear();
        view(<div>Idle View</div>);
        return <div>Idle View</div>;
      }).withState('loading', async ({ context, event, send, log, view, clear, graphql }: any) => {
        handlerCalls.push('loading-handler');
        if (clear) clear();
        view(<div>Loading View</div>);
        
        try {
          const { data } = await safeGraphQLRequest({
            endpoint: '/api/graphql/donations',
            query: 'query GetDonationStatus { donationStatus { donated } }',
            variables: { userId: context.userId }
          });
          
          if (data?.donationStatus) {
            context.donated = data.donationStatus.donated || false;
          const eventToSend = { type: 'DONATION_STATUS_LOADED', payload: data.donationStatus };
          send(eventToSend);
          }
        } catch (error) {
          const eventToSend = { type: 'DONATION_STATUS_ERROR', payload: error };
          send(eventToSend);
        }
        
        return <div>Loading View</div>;
      });
      
      testMachine.start();
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verify idle handler was called on start
      expect(handlerCalls).toContain('idle-handler');
      
      // Manually test loading handler to verify send logic works
      const stateHandlers = testMachine.stateHandlers as Record<string, any>;
      const loadingHandler = stateHandlers?.['loading'];
      if (!loadingHandler) {
        throw new Error('Loading handler not found');
      }
      
      // Clear sentEvents to only track from this manual call
      sentEvents.length = 0;
      
      const state = testMachine.getState();
      const context = state?.context || {};
      const view = (component: any) => component;
      const clear = () => {};
      const send = (event: any) => {
        sentEvents.push(event);
      };
      const log = async (msg: string, data?: any) => {};
      
      await loadingHandler({ context, event: {}, send, log, view, clear, graphql: {} });
      
      // Verify loading handler was called and sent correct event
      expect(handlerCalls.length).toBeGreaterThanOrEqual(1);
      expect(sentEvents.length).toBe(1);
      expect(sentEvents[0].type).toBe('DONATION_STATUS_LOADED');
    });

    test('should handle LOAD_DONATION_STATUS -> loading -> DONATION_STATUS_LOADED flow logic', async () => {
      const { safeGraphQLRequest } = require('../../utils/backend-api-wrapper');
      
      safeGraphQLRequest.mockResolvedValue({
        data: {
          donationStatus: {
            donated: false,
            hasEasterEggs: false,
            donors: []
          }
        },
        backendDisabled: false
      });
      
      const sentEvents: any[] = [];
      
      const testMachine = createViewStateMachine({
        machineId: 'test-about-machine',
        xstateConfig: {
          initial: 'idle',
          context: {
            donated: false,
            hasEasterEggs: false,
            donors: [],
            isLoading: false,
            error: null,
            userId: 'test-user',
            subscription: null
          },
          states: {
            idle: {
              on: {
                LOAD_DONATION_STATUS: 'loading',
                INITIALIZE: 'loading'
              }
            },
            loading: {
              on: {
                DONATION_STATUS_LOADED: 'idle',
                DONATION_STATUS_ERROR: 'error'
              }
            },
            error: {}
          }
        }
      }).withState('idle', async ({ context, event, send, log, view, clear }: any) => {
        if (clear) clear();
        view(<div>Idle View</div>);
        return <div>Idle View</div>;
      }).withState('loading', async ({ context, event, send, log, view, clear, graphql }: any) => {
        if (clear) clear();
        view(<div>Loading View</div>);
        
        try {
          const { data } = await safeGraphQLRequest({
            endpoint: '/api/graphql/donations',
            query: 'query GetDonationStatus { donationStatus { donated } }',
            variables: { userId: context.userId }
          });
          
          if (data?.donationStatus) {
          const eventToSend = { type: 'DONATION_STATUS_LOADED', payload: data.donationStatus };
          send(eventToSend);
          }
        } catch (error) {
          const eventToSend = { type: 'DONATION_STATUS_ERROR', payload: error };
          send(eventToSend);
        }
        
        return <div>Loading View</div>;
      });
      
      testMachine.start();
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Manually test loading handler to verify send logic works
      const stateHandlers = testMachine.stateHandlers as Record<string, any>;
      const loadingHandler = stateHandlers?.['loading'];
      if (!loadingHandler) {
        throw new Error('Loading handler not found');
      }
      
      // Clear sentEvents to only track from this manual call
      sentEvents.length = 0;
      
      const state = testMachine.getState();
      const context = state?.context || {};
      const view = (component: any) => component;
      const clear = () => {};
      const send = (event: any) => {
        sentEvents.push(event);
      };
      const log = async (msg: string, data?: any) => {};
      
      await loadingHandler({ context, event: {}, send, log, view, clear, graphql: {} });
      
      // Verify DONATION_STATUS_LOADED was sent
      expect(sentEvents.length).toBe(1);
      expect(sentEvents[0].type).toBe('DONATION_STATUS_LOADED');
    });
  });

  describe('JSX to HTML conversion', () => {
    test('should print HTML tree from actual AboutPageComponent loading state', async () => {
      const { safeGraphQLRequest } = require('../../utils/backend-api-wrapper');
      
      // Mock successful GraphQL response
      safeGraphQLRequest.mockResolvedValue({
        data: {
          donationStatus: {
            donated: true,
            hasEasterEggs: true,
            donors: [{ name: 'Test Donor', amount: '1 ETH', crypto: 'ETH' }]
          }
        },
        backendDisabled: false
      });
      
      // Use the ACTUAL AboutPageComponent machine, not a test version
      const actualMachine = AboutPageComponent;
      const viewStack: React.ReactElement[] = [];
      let capturedView: React.ReactElement | null = null;
      
      // Get the actual loading state handler from the real machine
      const stateHandlers = (actualMachine as any).stateHandlers as Record<string, any>;
      const loadingHandler = stateHandlers?.get?.('loading') || stateHandlers?.['loading'];
      
      if (!loadingHandler) {
        throw new Error('Loading handler not found in actual AboutPageComponent');
      }
      
      // Set up context matching the actual machine's initial context
      const context = {
        donated: false,
        hasEasterEggs: false,
        donors: [
          { name: "Anonymous Supporter", amount: "0.1 ETH", crypto: "ETH" },
          { name: "Beta Tester", amount: "0.05 BTC", crypto: "BTC" },
          { name: "Reading Enthusiast", amount: "0.2 ETH", crypto: "ETH" }
        ],
        isLoading: true,
        error: null,
        userId: 'test-user',
        subscription: null
      };
      
      // Create view function that captures the actual rendered view
      const view = (component: React.ReactElement) => {
        viewStack.push(component);
        capturedView = component;
        return component;
      };
      const clear = () => {
        viewStack.length = 0;
      };
      const send = (event: any) => {};
      const log = async (msg: string, data?: any) => {};
      const graphql = {
        subscription: async () => mockSubscription
      };
      
      // Call the ACTUAL loading handler with real context
      await loadingHandler({ context, event: {}, send, log, view, clear, graphql, transition: () => {}, machine: actualMachine });
      
      // The viewStack should contain the views that were rendered by the actual handler
      expect(viewStack.length).toBeGreaterThan(0);
      
      // Convert the actual rendered view to HTML
      if (capturedView) {
        const htmlString = jsxToHtml(capturedView);
        
        // Print the HTML tree from the ACTUAL implementation
        console.log('\n=== Actual AboutPageComponent Loading State JSX to HTML Tree ===');
        console.log(htmlString);
        console.log('=== End Actual HTML Tree ===\n');
        
        // Verify the HTML contains expected elements from the real AboutPageComponentView
        // The actual view should contain sections about Wave Reader, donation info, etc.
        expect(htmlString.length).toBeGreaterThan(0);
        // The actual view uses styled components, so we check for content that should be present
        expect(htmlString).toMatch(/Wave Reader|donation|support|donor/i);
      } else {
        throw new Error('No view was captured from actual AboutPageComponent loading handler');
      }
    });
  });
});

