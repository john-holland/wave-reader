/**
 * Epileptic Blacklist Service
 * 
 * Manages a blacklist of URLs where Wave Reader should not activate
 * due to reported epileptic-triggering animations.
 */

export class EpilepticBlacklistService {
  private static readonly STORAGE_KEY = 'epileptic_blacklist';
  private static blacklist: Set<string> = new Set();

  /**
   * Initialize the blacklist from storage
   */
  static async initialize(): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const result = await chrome.storage.local.get([this.STORAGE_KEY]);
        const stored = result[this.STORAGE_KEY] || [];
        this.blacklist = new Set(stored);
      } else if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          this.blacklist = new Set(parsed);
        }
      }
    } catch (error) {
      console.error('Error initializing epileptic blacklist:', error);
    }
  }

  /**
   * Add a URL to the blacklist
   */
  static async addUrl(url: string): Promise<void> {
    try {
      // Normalize the URL (remove trailing slashes, etc.)
      const normalizedUrl = this.normalizeUrl(url);
      this.blacklist.add(normalizedUrl);
      
      // Save to storage
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.set({
          [this.STORAGE_KEY]: Array.from(this.blacklist)
        });
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(this.blacklist)));
      }
      
      console.log('🌊 Epileptic blacklist: Added URL', normalizedUrl);
    } catch (error) {
      console.error('Error adding URL to epileptic blacklist:', error);
    }
  }

  /**
   * Check if a URL is blacklisted
   */
  static isBlacklisted(url: string): boolean {
    const normalizedUrl = this.normalizeUrl(url);
    return this.blacklist.has(normalizedUrl);
  }

  /**
   * Get all blacklisted URLs
   */
  static getBlacklistedUrls(): string[] {
    return Array.from(this.blacklist);
  }

  /**
   * Set the blacklist from an array of URLs
   */
  static async setBlacklist(urls: string[]): Promise<void> {
    try {
      // Normalize all URLs
      const normalizedUrls = urls
        .map(url => url.trim())
        .filter(url => url.length > 0)
        .map(url => this.normalizeUrl(url));
      
      this.blacklist = new Set(normalizedUrls);
      
      // Save to storage
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.set({
          [this.STORAGE_KEY]: Array.from(this.blacklist)
        });
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(this.blacklist)));
      }
      
      console.log('🌊 Epileptic blacklist: Set', normalizedUrls.length, 'URLs');
    } catch (error) {
      console.error('Error setting epileptic blacklist:', error);
    }
  }

  /**
   * Clear the entire blacklist
   */
  static async clearBlacklist(): Promise<void> {
    try {
      this.blacklist.clear();
      
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.remove(this.STORAGE_KEY);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.STORAGE_KEY);
      }
      
      console.log('🌊 Epileptic blacklist: Cleared');
    } catch (error) {
      console.error('Error clearing epileptic blacklist:', error);
    }
  }

  /**
   * Normalize a URL for consistent storage
   */
  private static normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove trailing slash, normalize protocol
      return `${urlObj.host}`;
    } catch (e) {
      // If URL parsing fails, return as-is
      return url;
    }
  }

  /**
   * Get the current page URL
   */
  static async getCurrentUrl(): Promise<string | null> {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]?.url) {
          return tabs[0].url;
        }
      }
      // Fallback to window.location if in a regular page context
      if (typeof window !== 'undefined' && window.location) {
        return window.location.href;
      }
      return null;
    } catch (error) {
      console.error('Error getting current URL:', error);
      return null;
    }
  }
}

