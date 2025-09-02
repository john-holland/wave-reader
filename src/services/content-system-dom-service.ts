/**
 * Content System DOM Service
 * 
 * Manages DOM operations for the content system including:
 * - Shadow DOM creation and management
 * - Style element management
 * - DOM cleanup and disposal
 */

export interface DOMElementState {
  shadowRoot: ShadowRoot | null;
  shadowStyleElement: HTMLStyleElement | null;
  mainDocumentStyleElement: HTMLStyleElement | null;
  selectorUiRoot: HTMLDivElement | null;
  containerId: string;
}

export interface StyleTemplate {
  shadowStyles: string;
  mainStyles: string;
  selectorUIStyles: string;
}

export class ContentSystemDOMService {
  private state: DOMElementState;
  private isInitialized: boolean = false;

  constructor() {
    this.state = {
      shadowRoot: null,
      shadowStyleElement: null,
      mainDocumentStyleElement: null,
      selectorUiRoot: null,
      containerId: `wave-reader-log-view-container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  /**
   * Initialize the DOM service and create necessary elements
   */
  public initialize(): DOMElementState {
    if (this.isInitialized) {
      console.warn("🌊 ContentSystemDOMService: Already initialized");
      return this.state;
    }

    try {
      // Create shadow DOM container
      const container = this.createShadowContainer();
      
      // Create style elements
      this.createStyleElements();
      
      // Create selector UI root
      this.createSelectorUIRoot();
      
      this.isInitialized = true;
      console.log("🌊 ContentSystemDOMService: Initialized successfully");
      
      return this.state;
    } catch (error) {
      console.error("🌊 ContentSystemDOMService: Initialization failed:", error);
      throw error;
    }
  }

  /**
   * Create the shadow DOM container
   */
  private createShadowContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.id = this.state.containerId;
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      pointer-events: none;
      z-index: 2147483647;
    `;
    
    document.body.appendChild(container);
    this.state.shadowRoot = container.attachShadow({ mode: 'open' });

    if (!this.state.shadowRoot) {
      throw new Error("Failed to create shadow root");
    }

    return container;
  }

  /**
   * Create style elements for shadow and main document
   */
  private createStyleElements(): void {
    // Shadow DOM styles
    this.state.shadowStyleElement = document.createElement('style');
    this.state.shadowStyleElement.textContent = this.getDefaultShadowStyles();
    this.state.shadowRoot!.appendChild(this.state.shadowStyleElement);

    // Main document styles
    this.state.mainDocumentStyleElement = document.createElement('style');
    this.state.mainDocumentStyleElement.id = `wave-reader-log-view-styles-${this.state.containerId}`;
    this.state.mainDocumentStyleElement.textContent = this.getDefaultMainStyles();
    document.head.appendChild(this.state.mainDocumentStyleElement);
  }

  /**
   * Create selector UI root element
   */
  private createSelectorUIRoot(): void {
    this.state.selectorUiRoot = document.createElement('div');
    this.state.selectorUiRoot.id = `wave-reader-selector-ui-${this.state.containerId}`;
    this.state.selectorUiRoot.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-size: 12px;
      z-index: 2147483646;
      display: none;
    `;
    
    document.body.appendChild(this.state.selectorUiRoot);
  }

  /**
   * Get default shadow DOM styles
   */
  private getDefaultShadowStyles(): string {
    return `
      .wave-reader__text {
        font-size: initial;
        font-family: inherit;
        line-height: inherit;
        color: inherit;
        background: inherit;
        border: inherit;
        padding: inherit;
        margin: inherit;
        text-decoration: inherit;
        font-weight: inherit;
        font-style: inherit;
        text-transform: inherit;
        letter-spacing: inherit;
        word-spacing: inherit;
        white-space: inherit;
        vertical-align: inherit;
        text-align: inherit;
        text-indent: inherit;
        text-shadow: inherit;
        box-shadow: inherit;
        transform: inherit;
        transition: inherit;
        animation: inherit;
        filter: inherit;
        backdrop-filter: inherit;
        perspective: inherit;
        perspective-origin: inherit;
        transform-style: inherit;
        backface-visibility: inherit;
        transform-origin: inherit;
        transition-property: inherit;
        transition-duration: inherit;
        transition-timing-function: inherit;
        transition-delay: inherit;
        animation-name: inherit;
        animation-duration: inherit;
        animation-timing-function: inherit;
        animation-delay: inherit;
        animation-iteration-count: inherit;
        animation-direction: inherit;
        animation-fill-mode: inherit;
        animation-play-state: inherit;
      }
    `;
  }

  /**
   * Get default main document styles
   */
  private getDefaultMainStyles(): string {
    return `
      /* Wave reader main document styles */
      .wave-reader__text {
        /* Animation will be injected here */
      }
    `;
  }

  /**
   * Apply wave animation styles to main document
   */
  public applyWaveAnimation(cssTemplate: string): void {
    console.log("🌊 ContentSystemDOMService: applyWaveAnimation called with CSS template", {
      hasCssTemplate: !!cssTemplate,
      cssLength: cssTemplate ? cssTemplate.length : 0,
      cssPreview: cssTemplate ? cssTemplate.substring(0, 200) + '...' : 'NO_CSS',
      hasMainDocumentStyleElement: !!this.state.mainDocumentStyleElement,
      stateKeys: Object.keys(this.state)
    });
    
    if (!this.state.mainDocumentStyleElement) {
      console.warn("🌊 ContentSystemDOMService: Main document style element not available");
      return;
    }

    try {
      console.log("🌊 ContentSystemDOMService: Setting style element textContent...");
      this.state.mainDocumentStyleElement.textContent = cssTemplate;
      console.log("🌊 ContentSystemDOMService: Wave animation styles applied successfully");
      console.log("🌊 ContentSystemDOMService: Style element now contains:", {
        textContentLength: this.state.mainDocumentStyleElement.textContent?.length || 0,
        textContentPreview: this.state.mainDocumentStyleElement.textContent?.substring(0, 200) + '...' || 'EMPTY'
      });
    } catch (error) {
      console.error("🌊 ContentSystemDOMService: Failed to apply wave animation:", error);
      throw error;
    }
  }

  /**
   * Remove wave animation styles
   */
  public removeWaveAnimation(): void {
    if (this.state.mainDocumentStyleElement) {
      this.state.mainDocumentStyleElement.textContent = this.getDefaultMainStyles();
      console.log("🌊 ContentSystemDOMService: Wave animation styles removed");
    }
  }

  /**
   * Apply styles to shadow DOM
   */
  public applyShadowStyles(styles: string): void {
    if (!this.state.shadowStyleElement) {
      console.warn("🌊 ContentSystemDOMService: Shadow style element not available");
      return;
    }

    try {
      this.state.shadowStyleElement.textContent = this.getDefaultShadowStyles() + styles;
      console.log("🌊 ContentSystemDOMService: Shadow styles applied");
    } catch (error) {
      console.error("🌊 ContentSystemDOMService: Failed to apply shadow styles:", error);
      throw error;
    }
  }

  /**
   * Show selector UI with message
   */
  public showSelectorUI(message: string): void {
    if (!this.state.selectorUiRoot) {
      console.warn("🌊 ContentSystemDOMService: Selector UI root not available");
      return;
    }

    try {
      this.state.selectorUiRoot.innerHTML = `<div>${message}</div>`;
      this.state.selectorUiRoot.style.display = 'block';
      console.log("🌊 ContentSystemDOMService: Selector UI shown");
    } catch (error) {
      console.error("🌊 ContentSystemDOMService: Failed to show selector UI:", error);
      throw error;
    }
  }

  /**
   * Hide selector UI
   */
  public hideSelectorUI(): void {
    if (this.state.selectorUiRoot) {
      this.state.selectorUiRoot.style.display = 'none';
      console.log("🌊 ContentSystemDOMService: Selector UI hidden");
    }
  }

  /**
   * Get current DOM state
   */
  public getState(): DOMElementState {
    return { ...this.state };
  }

  /**
   * Check if service is initialized
   */
  public getInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Clean up DOM elements
   */
  public cleanup(): void {
    try {
      // Remove selector UI
      if (this.state.selectorUiRoot) {
        this.state.selectorUiRoot.remove();
        this.state.selectorUiRoot = null;
      }

      // Remove main document styles
      if (this.state.mainDocumentStyleElement) {
        this.state.mainDocumentStyleElement.remove();
        this.state.mainDocumentStyleElement = null;
      }

      // Remove shadow container (this removes shadow root and styles)
      if (this.state.shadowRoot?.host) {
        this.state.shadowRoot.host.remove();
        this.state.shadowRoot = null;
      }

      this.isInitialized = false;
      console.log("🌊 ContentSystemDOMService: Cleanup completed");
    } catch (error) {
      console.error("🌊 ContentSystemDOMService: Cleanup failed:", error);
      throw error;
    }
  }

  /**
   * Reset service to initial state
   */
  public reset(): void {
    this.cleanup();
    this.state = {
      shadowRoot: null,
      shadowStyleElement: null,
      mainDocumentStyleElement: null,
      selectorUiRoot: null,
      containerId: `wave-reader-log-view-container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }
}

export default ContentSystemDOMService;
