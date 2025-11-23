/**
 * Sync System
 * 
 * Handles data synchronization between popup, background, and content scripts
 * Provides unified data access and state management across the extension
 */

import { MACHINE_NAMES } from '../app/machines/machine-names';

// Sync system helper functions
export const SyncSystem = {
    // Initialize sync - gather data from all sources
    async initializeSync(log: any, machine: any) {
        log('🌊 Sync System: Initializing sync from all sources...');
        
        const syncData = {
            cachedData: null as any,
            contentData: null as any,
            backgroundData: null as any
        };
        
        // Get cached data from Chrome storage
        syncData.cachedData = await this.getCachedData(log);
        
        // Get real-time data from content script via background
        syncData.contentData = await this.getContentScriptData(log, machine);
        
        // Get background script state
        syncData.backgroundData = await this.getBackgroundScriptData(log, machine);
        
        log('🌊 Sync System: All sync data gathered', syncData);
        return syncData;
    },
    
    async getCachedData(log: any) {
        const defaultData = {
            selector: '',
            saved: true,
            going: false,
            selectors: [],
            currentView: 'main',
            isExtension: false,
            settings: null,
            showNotifications: true
        };
        
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            try {
                const storageResult = await chrome.storage.sync.get([
                    'waveReaderSettings', 
                    'waveReaderSelectors',
                    'currentSelector',
                    'going',
                    'waveReaderCurrentView',
                    'waveReaderShowNotifications',
                    'lastSyncTimestamp'
                ]);
                
                const cachedData = {
                    ...defaultData,
                    selector: storageResult.currentSelector || '',
                    going: storageResult.going?.going || false,
                    selectors: storageResult.waveReaderSelectors || [],
                    currentView: storageResult.waveReaderCurrentView || 'main',
                    isExtension: true,
                    settings: storageResult.waveReaderSettings || null,
                    showNotifications: storageResult.waveReaderShowNotifications !== false,
                    lastSyncTimestamp: storageResult.lastSyncTimestamp || 0
                };
                
                log('🌊 Sync System: Loaded cached data from Chrome sync storage', cachedData);
                return cachedData;
            } catch (storageError) {
                log('🌊 Sync System: Failed to load from Chrome sync storage, using defaults', storageError);
            }
        }
        
        return defaultData;
    },
    
    async getContentScriptData(log: any, machine: any) {
        try {
            // Check if parentMachine is available
            if (!machine?.parentMachine) {
                log('🌊 Sync System: No parentMachine available for content script data');
                return null;
            }
            
            const statusResponse = await machine.parentMachine.getSubMachine(MACHINE_NAMES.BACKGROUND_PROXY)?.send({
                from: 'popup',
                name: 'get-status',
                timestamp: Date.now()
            });
            
            if (statusResponse && statusResponse.success) {
                const contentState = (statusResponse as any).data || statusResponse;
                const contentData = {
                    going: contentState.going || false,
                    selector: contentState.selector,
                    activeTab: contentState.activeTab,
                    lastActivity: contentState.lastActivity || Date.now()
                };
                
                log('🌊 Sync System: Retrieved content script data', contentData);
                return contentData;
            }
        } catch (error: any) {
            log('🌊 Sync System: Could not get content script data', error);
        }
        
        return null;
    },
    
    async getBackgroundScriptData(log: any, machine: any) {
        try {
            // Check if parentMachine is available
            if (!machine?.parentMachine) {
                log('🌊 Sync System: No parentMachine available for background script data');
                return null;
            }
            
            const healthResponse = await machine.parentMachine.getSubMachine(MACHINE_NAMES.BACKGROUND_PROXY)?.send({
                from: 'popup',
                name: 'health-check',
                timestamp: Date.now()
            });
            
            if (healthResponse && healthResponse.success) {
                const backgroundState = (healthResponse as any).data || healthResponse;
                const backgroundData = {
                    sessionId: backgroundState.sessionId,
                    activeConnections: backgroundState.activeConnections || 0,
                    healthStatus: backgroundState.status || 'unknown',
                    lastHeartbeat: backgroundState.lastHeartbeat || Date.now()
                };
                
                log('🌊 Sync System: Retrieved background script data', backgroundData);
                return backgroundData;
            }
        } catch (error: any) {
            log('🌊 Sync System: Could not get background script data', error);
        }
        
        return null;
    },
    
    async saveViewModelToStorage(viewModel: any, log: any) {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            try {
                await chrome.storage.sync.set({
                    currentSelector: viewModel.selector,
                    going: { going: viewModel.going },
                    waveReaderSelectors: viewModel.selectors,
                    waveReaderCurrentView: viewModel.currentView,
                    waveReaderShowNotifications: viewModel.showNotifications,
                    waveReaderSettings: viewModel.settings,
                    lastSyncTimestamp: Date.now()
                });
                log('🌊 Sync System: Saved viewModel to Chrome sync storage');
                return true;
            } catch (saveError) {
                log('🌊 Sync System: Failed to save viewModel to storage', saveError);
                return false;
            }
        }
        return false;
    },
    
    // Heartbeat sync - lightweight sync for active tabs
    async heartbeatSync(context: any, log: any, machine: any) {
        log('🌊 Sync System: Performing heartbeat sync...');
        
        try {
            // Send ping to background to get current state
            const pingResponse = await machine.parentMachine.getSubMachine(MACHINE_NAMES.BACKGROUND_PROXY)?.send({
                from: 'popup',
                name: 'ping',
                timestamp: Date.now(),
                currentState: {
                    going: context.viewModel.going,
                    selector: context.viewModel.selector
                }
            });
            
            if (pingResponse && pingResponse.success) {
                const updates = (pingResponse as any).data || {};
                
                // Apply lightweight updates
                let hasChanges = false;
                if (updates.going !== undefined && updates.going !== context.viewModel.going) {
                    context.viewModel.going = updates.going;
                    hasChanges = true;
                }
                
                if (updates.selector && updates.selector !== context.viewModel.selector) {
                    context.viewModel.selector = updates.selector;
                    hasChanges = true;
                }
                
                if (hasChanges) {
                    context.viewModel.saved = false;
                    context.viewModel.lastHeartbeat = Date.now();
                    log('🌊 Sync System: Heartbeat sync applied changes', updates);
                }
                
                return hasChanges;
            }
        } catch (error: any) {
            log('🌊 Sync System: Heartbeat sync failed', error);
        }
        
        return false;
    }
};

