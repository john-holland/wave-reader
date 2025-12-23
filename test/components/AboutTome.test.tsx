/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AboutTome from '../../src/component-middleware/about/AboutTome';

// Mock AppTome.getRouter()
jest.mock('../../src/app/tomes/AppTome', () => ({
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

// Mock FeatureToggleService
jest.mock('../../src/config/feature-toggles', () => ({
  FeatureToggleService: jest.fn().mockImplementation(() => ({
    isEnabled: jest.fn().mockResolvedValue(false)
  })),
  FEATURE_TOGGLES: {}
}));

// Mock safeGraphQLRequest to avoid actual GraphQL calls
jest.mock('../../src/utils/backend-api-wrapper', () => ({
  safeGraphQLRequest: jest.fn().mockResolvedValue({
    data: null,
    backendDisabled: true
  })
}));

describe('AboutTome - Idle State Rendering', () => {
  // Chrome APIs should be mocked in test/setup.ts, but ensure they exist
  beforeAll(() => {
    // Ensure chrome.storage.local exists (setup.ts only mocks sync)
    if (typeof chrome === 'undefined' || !chrome.storage) {
      (global as any).chrome = {
        ...((global as any).chrome || {}),
        storage: {
          local: {
            get: jest.fn().mockResolvedValue({}),
            set: jest.fn().mockResolvedValue(undefined)
          },
          sync: {
            get: jest.fn().mockResolvedValue({}),
            set: jest.fn().mockResolvedValue(undefined)
          }
        },
        runtime: {
          id: 'test-extension-id',
          sendMessage: jest.fn()
        }
      };
    } else if (chrome.storage && !chrome.storage.local) {
      // Add local storage if it doesn't exist
      chrome.storage.local = {
        get: jest.fn().mockResolvedValue({}),
        set: jest.fn().mockResolvedValue(undefined)
      } as any;
    }
    // Ensure runtime.id exists
    if (chrome && chrome.runtime && !chrome.runtime.id) {
      (chrome.runtime as any).id = 'test-extension-id';
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('idle state renders content when machine is in idle state', async () => {
    // Render the component
    render(<AboutTome />);
    
    // Wait for the machine to initialize and enter idle state
    await waitFor(() => {
      // Check that key content from AboutPageComponentView is rendered
      expect(screen.getByText(/Wave Reader is a browser extension/)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Verify section headers are present
    expect(screen.getByText(/About Wave Reader/)).toBeInTheDocument();
    expect(screen.getByText(/Research Foundation/)).toBeInTheDocument();
    expect(screen.getByText(/Support Wave Reader/)).toBeInTheDocument();
  });

  test('idle state calls view() with rendered content', async () => {
    // This test verifies the view() function is called
    // by checking that the content appears in the DOM
    render(<AboutTome />);
    
    await waitFor(() => {
      // If view() was called, this content should be in the DOM
      const aboutContent = screen.getByText(/Wave Reader is a browser extension/);
      expect(aboutContent).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Verify the viewStack has content by checking render() works
    // The fact that we can query for content means render() returned something
    expect(screen.getByText(/Version 1.0.0/)).toBeInTheDocument();
  });

  test('idle state renders even when donation status is not loaded', async () => {
    // Test that content renders immediately, not waiting for async operations
    render(<AboutTome />);
    
    // Should see content immediately, even if donation loading is in progress
    await waitFor(() => {
      expect(screen.getByText(/About Wave Reader/)).toBeInTheDocument();
    }, { timeout: 1000 }); // Short timeout to ensure it's immediate
  });

  test('render() method returns content after idle state', async () => {
    render(<AboutTome />);
    
    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText(/Wave Reader is a browser extension/)).toBeInTheDocument();
    });
    
    // Verify all expected sections are present (proves render() works)
    expect(screen.getByText(/About Wave Reader/)).toBeInTheDocument();
    expect(screen.getByText(/Research Foundation/)).toBeInTheDocument();
    expect(screen.getByText(/Support Wave Reader/)).toBeInTheDocument();
    expect(screen.getByText(/Version 1.0.0/)).toBeInTheDocument();
  });

  test('idle state populates viewStack', async () => {
    render(<AboutTome />);
    
    await waitFor(() => {
      // If content is rendered, viewStack must have been populated
      expect(screen.getByText(/Wave Reader is a browser extension/)).toBeInTheDocument();
    });
    
    // Additional verification that render() can access the viewStack
    expect(screen.getByText(/About Wave Reader/)).toBeInTheDocument();
  });
});

