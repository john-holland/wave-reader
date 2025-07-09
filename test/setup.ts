// Test setup for DOM testing
import '@testing-library/jest-dom';

// Mock Chrome APIs for testing
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    }
  },
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn()
    }
  }
} as any;

// Mock window properties that might be used
Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 800
});

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1200
});

// Mock getBoundingClientRect for elements
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 100,
  height: 50,
  top: 0,
  left: 0,
  bottom: 50,
  right: 100,
  x: 0,
  y: 0,
  toJSON: () => ({ width: 100, height: 50, top: 0, left: 0, bottom: 50, right: 100, x: 0, y: 0 })
} as DOMRect));

// Mock offsetWidth and offsetHeight
Object.defineProperty(Element.prototype, 'offsetWidth', {
  configurable: true,
  get: jest.fn(() => 100)
});

Object.defineProperty(Element.prototype, 'offsetHeight', {
  configurable: true,
  get: jest.fn(() => 50)
});

Object.defineProperty(Element.prototype, 'offsetTop', {
  configurable: true,
  get: jest.fn(() => 0)
});

Object.defineProperty(Element.prototype, 'offsetLeft', {
  configurable: true,
  get: jest.fn(() => 0)
});
 