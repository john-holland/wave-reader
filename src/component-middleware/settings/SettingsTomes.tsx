import React, { FunctionComponent, useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { SettingsMessageHandler } from './robotcopy-pact-config';
import Wave, { defaultCssTemplate, defaultCssMouseTemplate } from '../../models/wave';
import Text from '../../models/text';
import { MachineRouter } from 'log-view-machine';
import EditorWrapper from '../../app/components/EditorWrapper';
import { AppTome } from '../../app/tomes/AppTome';
import { KeyChord, normalizeKey, compareKeyChords, sortKeyChord } from '../../components/util/user-input';
import { KeyChordDefaultFactory } from '../../models/defaults';
import { EpilepticBlacklistService } from '../../services/epileptic-blacklist';

// Styled components for the Tomes-based settings
const SettingsContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const SettingsHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 24px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
`;

const SettingsTitle = styled.h3`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
`;

const SaveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
`;

const SavedStatus = styled.span<{ isSaved: boolean }>`
  color: ${props => props.isSaved ? '#a8f5a8' : '#ffd700'};
  font-weight: 600;
  animation: ${props => props.isSaved ? 'none' : 'pulse 2s infinite'};
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
`;

const SettingsNavigation = styled.div`
  background: #f8f9fa;
  padding: 16px 24px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;

const NavButton = styled.button<{ isActive: boolean }>`
  padding: 8px 16px;
  border: 2px solid #dee2e6;
  background: ${props => props.isActive ? '#667eea' : 'white'};
  color: ${props => props.isActive ? 'white' : '#495057'};
  border-color: ${props => props.isActive ? '#667eea' : '#dee2e6'};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    color: ${props => props.isActive ? 'white' : '#667eea'};
  }
`;

const SettingsContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const SettingGroup = styled.div`
  margin-bottom: 32px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

const SettingGroupTitle = styled.h4`
  margin: 0 0 20px 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  padding-bottom: 12px;
  border-bottom: 2px solid #667eea;
`;

const SettingItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  transition: border-color 0.2s ease;
  
  &:hover {
    border-color: #667eea;
  }
`;

const SettingLabel = styled.label`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
`;

const SettingInput = styled.input`
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &.number {
    width: 120px;
  }
  
  &.text {
    width: 100%;
  }
`;

const SettingTextarea = styled.textarea`
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
  background: white;
  min-height: 120px;
  resize: vertical;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.4;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &.css {
    min-height: 150px;
  }
`;

const SettingSelect = styled.select`
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
  background: white;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SettingCheckbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: #667eea;
  margin-right: 8px;
`;

const SettingRadio = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
  margin-right: 8px;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.05);
  }
`;

const HelpText = styled.span`
  font-size: 12px;
  color: #6c757d;
  font-style: italic;
  margin-top: 6px;
  line-height: 1.4;
`;

const SettingsActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e9ecef;
`;

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #5a6268;
    transform: translateY(-1px);
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 8px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &.btn-primary {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  }
  
  &.btn-secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
    }
  }
  
  &.btn-danger {
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
    }
  }
`;

const KeyboardInput = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const ProgressView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 20px;
  text-align: center;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e3f2fd;
  border-top: 4px solid #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ProgressText = styled.p`
  margin: 8px 0;
  color: #495057;
  font-size: 16px;
`;

const ErrorView = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const ErrorText = styled.p`
  color: #dc3545;
  font-weight: 600;
  background: #f8d7da;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #f5c6cb;
  margin-top: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
`;

// Settings interface
interface Settings {
  showNotifications: boolean;
  waveAnimationControl: 'CSS' | 'MOUSE';
  toggleKeys: { keyChord: string[]; hasSetKeyChord?: boolean };
  textColor: string;
  textSize: string;
  selector: string;
  cssTemplate: string;
  cssMouseTemplate: string;
  waveSpeed: number | string; // Allow string for empty state
  axisTranslateAmountXMax: number | string;
  axisTranslateAmountXMin: number | string;
  axisRotationAmountYMax: number | string;
  axisRotationAmountYMin: number | string;
  autoGenerateCss: boolean;
  cssGenerationMode: 'template' | 'hardcoded';
}

const DEFAULT_SETTINGS: Settings = {
  showNotifications: true,
  waveAnimationControl: 'CSS',
  toggleKeys: { keyChord: KeyChordDefaultFactory() as KeyChord, hasSetKeyChord: false },
  textColor: 'initial',
  textSize: 'initial',
  selector: 'body',
  cssTemplate: '',
  cssMouseTemplate: '',
  waveSpeed: 2,
  axisTranslateAmountXMax: 0,  // Changed from 4 to 0
  axisTranslateAmountXMin: -1,  // Changed from -4 to -1
  axisRotationAmountYMax: 1,
  axisRotationAmountYMin: -1,
  autoGenerateCss: true,
  cssGenerationMode: 'template'
};

type WaveNumericKey =
  | 'waveSpeed'
  | 'axisTranslateAmountXMax'
  | 'axisTranslateAmountXMin'
  | 'axisRotationAmountYMax'
  | 'axisRotationAmountYMin';

const MAX_TOGGLE_KEYS = 4;
const MODIFIER_KEYS = ['Ctrl', 'Shift', 'Alt', 'Meta'];
const LETTER_KEYS = Array.from({ length: 26 }, (_, index) =>
  String.fromCharCode(65 + index)
);
const NUMBER_KEYS = Array.from({ length: 10 }, (_, index) => `${index}`);
const FUNCTION_KEYS = Array.from({ length: 12 }, (_, index) => `F${index + 1}`);
const KEY_OPTIONS = [
  ...MODIFIER_KEYS,
  ...LETTER_KEYS,
  ...NUMBER_KEYS,
  ...FUNCTION_KEYS
];
const KEY_OPTIONS_SET = new Set(KEY_OPTIONS);

const waveParameterKeys: WaveNumericKey[] = [
  'waveSpeed',
  'axisTranslateAmountXMax',
  'axisTranslateAmountXMin',
  'axisRotationAmountYMax',
  'axisRotationAmountYMin'
];

const coerceNumber = (value: unknown, fallback: number | string): number | string => {
  // Allow empty strings to pass through
  if (typeof value === 'string' && value.trim() === '') {
    return '';
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  // Ensure fallback is a number (not a string)
  return typeof fallback === 'number' ? fallback : parseFloat(fallback) || 0;
};

const sanitizeToggleKeys = (value: Settings['toggleKeys'] | undefined): Settings['toggleKeys'] => {
  // Determine hasSetKeyChord:
  // - If flag exists, use it
  // - If flag doesn't exist (migration from old settings), infer it by comparing to defaults
  let hasSetKeyChord: boolean;
  if (value?.hasSetKeyChord !== undefined) {
    hasSetKeyChord = value.hasSetKeyChord;
  } else {
    // Migration: if keyChord exists and doesn't match defaults, assume user set it
    const defaultKeyChord = sortKeyChord(KeyChordDefaultFactory() as KeyChord);
    if (value?.keyChord && Array.isArray(value.keyChord) && value.keyChord.length > 0) {
      const normalizedSaved = sortKeyChord(value.keyChord.map(k => normalizeKey(k)).filter((k): k is string => k !== null) as KeyChord);
      hasSetKeyChord = !compareKeyChords(normalizedSaved, defaultKeyChord);
    } else {
      hasSetKeyChord = false;
    }
  }
  
  if (!value || !Array.isArray(value.keyChord) || value.keyChord.length === 0) {
    // If user hasn't set a keyChord, use defaults
    if (!hasSetKeyChord) {
      return { keyChord: KeyChordDefaultFactory() as KeyChord, hasSetKeyChord: false };
    }
    // If user has set it but it's empty, return empty array
    return { keyChord: [], hasSetKeyChord: true };
  }

  const sanitizedChord = value.keyChord
    .map(key => (typeof key === 'string' ? normalizeKey(key) : null))
    .filter((key): key is string => {
      if (!key) {
        return false;
      }
      return KEY_OPTIONS_SET.has(key);
    })
    .slice(0, MAX_TOGGLE_KEYS);

  // If sanitization resulted in empty array
  if (sanitizedChord.length === 0) {
    // If user hasn't set a keyChord, use defaults
    if (!hasSetKeyChord) {
      return { keyChord: KeyChordDefaultFactory() as KeyChord, hasSetKeyChord: false };
    }
    // If user has set it but it's empty, return empty array
    return { keyChord: [], hasSetKeyChord: true };
  }

  return {
    keyChord: sanitizedChord,
    hasSetKeyChord: hasSetKeyChord
  };
};

const sanitizeSettings = (overrides: Partial<Settings> = {}): Settings => {
  const merged = { ...DEFAULT_SETTINGS, ...overrides };
  return {
    ...merged,
    toggleKeys: sanitizeToggleKeys(merged.toggleKeys),
    // Only coerce to number if value is not an empty string (allow empty strings to pass through)
    waveSpeed: (typeof merged.waveSpeed === 'string' && merged.waveSpeed.trim() === '') 
      ? '' 
      : (coerceNumber(merged.waveSpeed, DEFAULT_SETTINGS.waveSpeed) as number | string),
    axisTranslateAmountXMax: (typeof merged.axisTranslateAmountXMax === 'string' && merged.axisTranslateAmountXMax.trim() === '') 
      ? '' 
      : (coerceNumber(merged.axisTranslateAmountXMax, DEFAULT_SETTINGS.axisTranslateAmountXMax) as number | string),
    axisTranslateAmountXMin: (typeof merged.axisTranslateAmountXMin === 'string' && merged.axisTranslateAmountXMin.trim() === '') 
      ? '' 
      : (coerceNumber(merged.axisTranslateAmountXMin, DEFAULT_SETTINGS.axisTranslateAmountXMin) as number | string),
    axisRotationAmountYMax: (typeof merged.axisRotationAmountYMax === 'string' && merged.axisRotationAmountYMax.trim() === '') 
      ? '' 
      : (coerceNumber(merged.axisRotationAmountYMax, DEFAULT_SETTINGS.axisRotationAmountYMax) as number | string),
    axisRotationAmountYMin: (typeof merged.axisRotationAmountYMin === 'string' && merged.axisRotationAmountYMin.trim() === '') 
      ? '' 
      : (coerceNumber(merged.axisRotationAmountYMin, DEFAULT_SETTINGS.axisRotationAmountYMin) as number | string)
  };
};

const generateCssFromSettings = (settings: Settings) => {
  // Helper function to safely convert to number, using default if empty/invalid
  const safeParseNumber = (value: number | string | null | undefined, defaultValue: number): number => {
    if (value === '' || value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
      return defaultValue;
    }
    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    return Number.isNaN(parsed) ? defaultValue : parsed;
  };

  // Convert string values to numbers for CSS generation, using defaults for empty/invalid values
  const waveSpeed = safeParseNumber(settings.waveSpeed, DEFAULT_SETTINGS.waveSpeed as number);
  const axisTranslateAmountXMax = safeParseNumber(settings.axisTranslateAmountXMax, DEFAULT_SETTINGS.axisTranslateAmountXMax as number);
  const axisTranslateAmountXMin = safeParseNumber(settings.axisTranslateAmountXMin, DEFAULT_SETTINGS.axisTranslateAmountXMin as number);
  const axisRotationAmountYMax = safeParseNumber(settings.axisRotationAmountYMax, DEFAULT_SETTINGS.axisRotationAmountYMax as number);
  const axisRotationAmountYMin = safeParseNumber(settings.axisRotationAmountYMin, DEFAULT_SETTINGS.axisRotationAmountYMin as number);

  // Log if we're using defaults for any parameter (for debugging)
  const usingDefaults = [
    { name: 'waveSpeed', value: settings.waveSpeed, default: waveSpeed },
    { name: 'axisTranslateAmountXMax', value: settings.axisTranslateAmountXMax, default: axisTranslateAmountXMax },
    { name: 'axisTranslateAmountXMin', value: settings.axisTranslateAmountXMin, default: axisTranslateAmountXMin },
    { name: 'axisRotationAmountYMax', value: settings.axisRotationAmountYMax, default: axisRotationAmountYMax },
    { name: 'axisRotationAmountYMin', value: settings.axisRotationAmountYMin, default: axisRotationAmountYMin }
  ].filter(p => (p.value === '' || p.value === null || p.value === undefined || (typeof p.value === 'string' && p.value.trim() === '')));

  if (usingDefaults.length > 0) {
    console.warn('⚙️ SettingsTomes: Using default values for empty/invalid parameters:', 
      usingDefaults.map(p => `${p.name}="${p.value}" (using default: ${p.default})`).join(', '));
  }

  const wave = new Wave({
    selector: settings.selector,
    waveSpeed: waveSpeed,
    axisTranslateAmountXMax: axisTranslateAmountXMax,
    axisTranslateAmountXMin: axisTranslateAmountXMin,
    axisRotationAmountYMax: axisRotationAmountYMax,
    axisRotationAmountYMin: axisRotationAmountYMin,
    cssGenerationMode: settings.cssGenerationMode || 'template',
    text: new Text({
      size: settings.textSize,
      color: settings.textColor
    })
  });

  const cssGenerationMode = settings.cssGenerationMode || 'template';
  return {
    cssTemplate: defaultCssTemplate(wave, cssGenerationMode),
    cssMouseTemplate: defaultCssMouseTemplate(wave, cssGenerationMode)
  };
};


// Domain paths interface
interface DomainPaths {
  domain: string;
  paths: string[];
}

// Props interface
interface SettingsTomesProps {
  initialSettings?: Partial<Settings>;
  domainPaths?: DomainPaths[];
  currentDomain?: string;
  currentPath?: string;
  onUpdateSettings?: (settings: Settings) => void;
  onDomainPathChange?: (domain: string, path: string) => void;
  className?: string;
}

// Main component using withState pattern
const SettingsTomes: FunctionComponent<SettingsTomesProps> = ({
  initialSettings = {},
  domainPaths = [],
  currentDomain = '',
  currentPath = '',
  onUpdateSettings,
  onDomainPathChange,
  className
}) => {
  // State management using withState pattern
  const [currentView, setCurrentView] = useState<'general' | 'wave' | 'css' | 'domain' | 'keyboard' | 'advanced' | 'saving' | 'loading' | 'error'>('general');
  const [settings, setSettings] = useState<Settings>(() => sanitizeSettings(initialSettings));
  const [localDomainPaths, setLocalDomainPaths] = useState<DomainPaths[]>(domainPaths);
  const [localCurrentDomain, setLocalCurrentDomain] = useState(currentDomain);
  const [localCurrentPath, setLocalCurrentPath] = useState(currentPath);
  const [saved, setSaved] = useState(true);
  const [messageHandler, setMessageHandler] = useState<SettingsMessageHandler | null>(null);
  const [isExtension, setIsExtension] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [router, setRouter] = useState<MachineRouter | null>(null);
  const [epilepticBlacklist, setEpilepticBlacklist] = useState<string>('');

  // Refs
  const settingsRef = useRef<Settings>(settings);

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      // Get router from AppTome
      const appTomeRouter = AppTome.getRouter();
      setRouter(appTomeRouter);
      
      // Check if we're running in a Chrome extension context
      const extensionContext = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
      setIsExtension(Boolean(extensionContext));

      if (extensionContext) {
        // Initialize Chrome extension message handler
        const handler = new SettingsMessageHandler();
        setMessageHandler(handler);
        
        // Load saved settings from Chrome storage
        if (chrome.storage && chrome.storage.local) {
          try {
            const result = await chrome.storage.local.get(['waveReaderSettings', 'waveReaderDomainPaths']);
            
            if (result.waveReaderSettings) {
              console.log('⚙️ SettingsTomes: Loading settings from storage:', result.waveReaderSettings);
              setSettings(prev => {
                const sanitized = sanitizeSettings({ ...prev, ...result.waveReaderSettings });
                console.log('⚙️ SettingsTomes: Sanitized settings, toggleKeys:', sanitized.toggleKeys);
                return sanitized;
              });
              setSaved(true);
            }
            
            if (result.waveReaderDomainPaths) {
              setLocalDomainPaths(result.waveReaderDomainPaths);
            }
          } catch (error) {
            console.warn('Failed to load settings from Chrome storage:', error);
          }
        }
        
        // Load epileptic blacklist
        await EpilepticBlacklistService.initialize();
        const blacklistedUrls = EpilepticBlacklistService.getBlacklistedUrls();
        setEpilepticBlacklist(blacklistedUrls.join('\n'));
      }
      
      console.log('⚙️ SettingsTomes: Initialized for Chrome extension context');
    };

    initializeComponent();
  }, []);

  // Update settings ref when settings change
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Auto-generate CSS templates when settings change and auto-generate is enabled
  useEffect(() => {
    if (!settings.autoGenerateCss) {
      return;
    }

    console.log('⚙️ SettingsTomes: Auto-generating CSS templates');

    const generated = generateCssFromSettings(settings);

    if (!generated) {
      return;
    }

    setSettings(prev => {
      if (prev.cssTemplate !== generated.cssTemplate || prev.cssMouseTemplate !== generated.cssMouseTemplate) {
        return {
          ...prev,
          cssTemplate: generated.cssTemplate,
          cssMouseTemplate: generated.cssMouseTemplate
        };
      }
      return prev;
    });
  }, [settings.autoGenerateCss, settings.waveSpeed, settings.axisTranslateAmountXMax, settings.axisTranslateAmountXMin, settings.axisRotationAmountYMax, settings.axisRotationAmountYMin, settings.selector, settings.textSize, settings.textColor]);

  // Handle Chrome extension messaging
  const sendExtensionMessage = async (message: any) => {
    if (!isExtension || !messageHandler) {
      console.warn('⚙️ SettingsTomes: Not in extension context or message handler not ready');
      return null;
    }

    try {
      return await messageHandler.sendMessage('background', message);
    } catch (error) {
      console.error('⚙️ SettingsTomes: Failed to send extension message:', error);
      return null;
    }
  };

  // Event handlers
  const handleViewChange = useCallback((view: typeof currentView) => {
    console.log('⚙️ SettingsTomes: Switching to view:', view);
    setCurrentView(view);
  }, []);

  const handleSettingChange = useCallback((key: keyof Settings, value: any) => {
    console.log('⚙️ SettingsTomes: Updating setting:', key, value);
    
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const handleWaveSettingChange = useCallback((key: WaveNumericKey, rawValue: string | number) => {
    console.log('⚙️ SettingsTomes: Updating wave setting:', key, rawValue);

    setSettings(prev => {
      // Allow empty string to clear the field temporarily
      if (rawValue === '' || rawValue === null || rawValue === undefined) {
        const next: Settings = {
          ...prev,
          [key]: '' // Store empty string temporarily
        };
        return next;
      }

      const numericValue =
        typeof rawValue === 'number' ? rawValue : parseFloat(rawValue);

      // If not a valid number, keep the previous value
      if (Number.isNaN(numericValue)) {
        return prev;
      }

      const next: Settings = {
        ...prev,
        [key]: numericValue
      };

      if (next.autoGenerateCss && waveParameterKeys.includes(key)) {
        console.log('⚙️ SettingsTomes: Auto-generating CSS from wave parameters');
        const generated = generateCssFromSettings(next);

        if (generated) {
          if (next.cssTemplate !== generated.cssTemplate || next.cssMouseTemplate !== generated.cssMouseTemplate) {
            next.cssTemplate = generated.cssTemplate;
            next.cssMouseTemplate = generated.cssMouseTemplate;
          }
        }
      }

      return next;
    });

    setSaved(false);
  }, []);

  const handleCssSettingChange = useCallback((key: keyof Settings, value: any) => {
    console.log('⚙️ SettingsTomes: Updating CSS setting:', key, value);
    
    handleSettingChange(key, value);
    
    // If auto-generate is disabled, parse CSS to update parameters
    if (!settings.autoGenerateCss && ['cssTemplate', 'cssMouseTemplate'].includes(key)) {
      console.log('⚙️ SettingsTomes: Parsing CSS to update parameters');
      // This would parse CSS and update wave parameters
    }
  }, [handleSettingChange, settings.autoGenerateCss]);

  const handleDomainSettingChange = useCallback((key: 'domain' | 'path', value: string) => {
    console.log('⚙️ SettingsTomes: Updating domain setting:', key, value);
    
    if (key === 'domain') {
      setLocalCurrentDomain(value);
      // Reset path when domain changes
      const newPaths = localDomainPaths.find(dp => dp.domain === value)?.paths || [];
      if (newPaths.length > 0) {
        setLocalCurrentPath(newPaths[0]);
        if (onDomainPathChange) {
          onDomainPathChange(value, newPaths[0]);
        }
      }
    } else {
      setLocalCurrentPath(value);
      if (onDomainPathChange) {
        onDomainPathChange(localCurrentDomain, value);
      }
    }
    
    setSaved(false);
  }, [localDomainPaths, localCurrentDomain, onDomainPathChange]);

  const handleToggleKeyChange = useCallback((index: number, selectedValue: string) => {
    console.log('⚙️ SettingsTomes: Updating toggle key:', index, selectedValue);

    const value = selectedValue === 'None' ? '' : selectedValue;

    setSettings(prev => {
      const padded = Array.from({ length: MAX_TOGGLE_KEYS }, (_, i) => prev.toggleKeys.keyChord[i] ?? '');

      if (value && padded.some((key, i) => key === value && i !== index)) {
        const duplicateIndex = padded.findIndex((key, i) => key === value && i !== index);
        if (duplicateIndex >= 0) {
          padded[duplicateIndex] = '';
        }
      }

      padded[index] = value;

      const updatedChord = padded.filter((key): key is string => key !== '');

      return {
        ...prev,
        toggleKeys: {
          keyChord: updatedChord,
          hasSetKeyChord: true // Mark that user has explicitly set the keyChord
        }
      };
    });

    setSaved(false);
  }, []);

  const handleSaveSettings = useCallback(async () => {
    console.log('⚙️ SettingsTomes: Saving settings');
    
    setCurrentView('saving');
    
    try {
      // Save epileptic blacklist
      const blacklistUrls = epilepticBlacklist
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);
      await EpilepticBlacklistService.setBlacklist(blacklistUrls);
      console.log('⚙️ SettingsTomes: Saved epileptic blacklist', blacklistUrls.length, 'URLs');
      // Save to storage
      if (isExtension) {
        await sendExtensionMessage({
          type: 'SETTINGS_SAVED',
          settings: settingsRef.current,
          source: 'settings',
          target: 'background',
          traceId: Date.now().toString()
        });
        
        // Save to Chrome storage
        if (chrome.storage && chrome.storage.local) {
          await chrome.storage.local.set({ 
            waveReaderSettings: settingsRef.current,
            waveReaderDomainPaths: localDomainPaths
          });
        }
      }
      
      // Notify parent component
      if (onUpdateSettings) {
        onUpdateSettings(settingsRef.current);
      }
      
      setSaved(true);
      setCurrentView('general');
      
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setCurrentView('error');
    }
  }, [isExtension, localDomainPaths, onUpdateSettings, epilepticBlacklist]);

  const handleResetSettings = useCallback(async () => {
    console.log('⚙️ SettingsTomes: Resetting settings');
    
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      try {
        // Reset to default values
        setSettings(() => sanitizeSettings(DEFAULT_SETTINGS));
        setSaved(false);
        
        // Save to storage
        if (isExtension) {
          await sendExtensionMessage({
            type: 'SETTINGS_RESET',
            source: 'settings',
            target: 'background',
            traceId: Date.now().toString()
          });
        }
        
      } catch (error) {
        console.error('Failed to reset settings:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setCurrentView('error');
      }
    }
  }, [isExtension]);

  const handleRetry = useCallback(() => {
    console.log('⚙️ SettingsTomes: Retrying operation');
    setError(null);
    setCurrentView('general');
  }, []);

  // Render different views based on currentView
  if (currentView === 'saving') {
    return (
      <EditorWrapper
        title="Wave Reader Settings"
        description="Configure Wave Reader preferences and options"
        componentId="settings-component"
        router={router || undefined}
        onError={(error) => console.error('Settings Editor Error:', error)}
      >
        <SettingsContainer className={className}>
        <SettingsHeader>
          <SettingsTitle>💾 Saving Settings</SettingsTitle>
        </SettingsHeader>
        
        <SettingsContent>
          <ProgressView>
            <Spinner />
            <ProgressText>Saving your settings...</ProgressText>
            <ProgressText>Please wait while we update your configuration.</ProgressText>
            
            <SettingsActions>
              <Button className="btn btn-secondary" onClick={() => setCurrentView('general')}>
                ❌ Cancel
              </Button>
            </SettingsActions>
          </ProgressView>
        </SettingsContent>
      </SettingsContainer>
      </EditorWrapper>
    );
  }

  if (currentView === 'loading') {
    return (
      <EditorWrapper
        title="Wave Reader Settings"
        description="Configure Wave Reader preferences and options"
        componentId="settings-component"
        router={router || undefined}
        onError={(error) => console.error('Settings Editor Error:', error)}
      >
        <SettingsContainer className={className}>
        <SettingsHeader>
          <SettingsTitle>📥 Loading Settings</SettingsTitle>
        </SettingsHeader>
        
        <SettingsContent>
          <ProgressView>
            <Spinner />
            <ProgressText>Loading your settings...</ProgressText>
            <ProgressText>Please wait while we retrieve your configuration.</ProgressText>
          </ProgressView>
        </SettingsContent>
      </SettingsContainer>
      </EditorWrapper>
    );
  }

  if (currentView === 'error') {
    return (
      <EditorWrapper
        title="Wave Reader Settings"
        description="Configure Wave Reader preferences and options"
        componentId="settings-component"
        router={router || undefined}
        onError={(error) => console.error('Settings Editor Error:', error)}
      >
        <SettingsContainer className={className}>
        <SettingsHeader>
          <SettingsTitle>❌ Error</SettingsTitle>
        </SettingsHeader>
        
        <SettingsContent>
          <ErrorView>
            <ErrorMessage>
              <p>An error occurred while processing your request:</p>
              <ErrorText>{error || 'Unknown error'}</ErrorText>
            </ErrorMessage>
            
            <SettingsActions>
              <Button className="btn btn-primary" onClick={handleRetry}>
                🔄 Retry
              </Button>
              <Button className="btn btn-secondary" onClick={() => setCurrentView('general')}>
                🏠 Go to General
              </Button>
            </SettingsActions>
          </ErrorView>
        </SettingsContent>
      </SettingsContainer>
      </EditorWrapper>
    );
  }

  // Render main settings view
  return (
    <EditorWrapper
      title="Wave Reader Settings"
      description="Configure Wave Reader preferences and options"
      componentId="settings-component"
      router={router || undefined}
      onError={(error) => console.error('Settings Editor Error:', error)}
    >
      <SettingsContainer className={className}>
      <SettingsHeader>
        <SettingsTitle>⚙️ Settings</SettingsTitle>
        <SaveIndicator>
          <SavedStatus isSaved={saved}>
            {saved ? '✅ Saved' : '🌊 Unsaved Changes'}
          </SavedStatus>
        </SaveIndicator>
      </SettingsHeader>
      
      <SettingsNavigation>
        <NavButton 
          isActive={currentView === 'general'}
          onClick={() => handleViewChange('general')}
        >
          General
        </NavButton>
        <NavButton 
          isActive={currentView === 'wave'}
          onClick={() => handleViewChange('wave')}
        >
          Wave Animation
        </NavButton>
        <NavButton 
          isActive={currentView === 'css'}
          onClick={() => handleViewChange('css')}
        >
          CSS Templates
        </NavButton>
        <NavButton 
          isActive={currentView === 'domain'}
          onClick={() => handleViewChange('domain')}
        >
          Domain & Path
        </NavButton>
        <NavButton 
          isActive={currentView === 'keyboard'}
          onClick={() => handleViewChange('keyboard')}
        >
          Keyboard
        </NavButton>
        <NavButton 
          isActive={currentView === 'advanced'}
          onClick={() => handleViewChange('advanced')}
        >
          Advanced
        </NavButton>
      </SettingsNavigation>
      
      <SettingsContent>
        {currentView === 'general' && (
          <>
            <SettingGroup>
              <SettingGroupTitle>Basic Settings</SettingGroupTitle>
              
              <SettingItem>
                <SettingLabel>
                  <SettingCheckbox
                    type="checkbox"
                    checked={settings.showNotifications}
                    onChange={(e) => handleSettingChange('showNotifications', e.target.checked)}
                  />
                  Show Notifications
                </SettingLabel>
              </SettingItem>
              
            </SettingGroup>
            
            <SettingGroup>
              <SettingGroupTitle>Accessibility & Safety</SettingGroupTitle>
              
              <SettingItem>
                <Button 
                  className="btn btn-danger"
                  onClick={async () => {
                    console.log('🚨 Epileptic animation reported');
                    
                    try {
                      // This would integrate with the GraphQL mutation from AboutTome
                      // For now, we'll show a confirmation dialog
                      const confirmed = window.confirm(
                        'Report this animation as potentially triggering epileptic symptoms?\n\n' +
                        'This will send a report to our accessibility team for investigation.'
                      );
                      
                      if (confirmed) {
                        // TODO: Integrate with GraphQL mutation
                        // await graphql.mutation(DONATION_REPORT_MUTATION, {
                        //   report: {
                        //     userId: 'anonymous',
                        //     timestamp: new Date().toISOString(),
                        //     description: 'Epileptic animation reported from settings',
                        //     severity: 'medium',
                        //     url: window.location.href
                        //   }
                        // });
                        
                        alert('Thank you for reporting this. We take accessibility seriously and will investigate this animation.');
                      }
                    } catch (error) {
                      console.error('Failed to report epileptic animation:', error);
                      alert('Failed to submit report. Please try again or contact support.');
                    }
                  }}
                  title="Report epileptic triggering animation"
                  style={{ 
                    fontSize: '14px',
                    padding: '12px 20px',
                    marginBottom: '12px'
                  }}
                >
                  🚨 Report Epileptic Animation
                </Button>
                <HelpText>
                  If any animation triggers epileptic symptoms or seizures, please report it immediately. 
                  We prioritize accessibility and will investigate all reports.
                </HelpText>
              </SettingItem>
              
            </SettingGroup>
            
            <SettingGroup>
              <SettingGroupTitle>Epileptic Blacklist</SettingGroupTitle>
              
              <SettingItem>
                <SettingLabel>
                  Blacklisted URLs (one per line)
                </SettingLabel>
                <SettingTextarea
                  value={epilepticBlacklist}
                  onChange={(e) => {
                    setEpilepticBlacklist(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="https://example.com&#10;https://another-site.com"
                  style={{ minHeight: '150px', fontFamily: 'monospace', fontSize: '12px' }}
                />
                <HelpText>
                  URLs listed here will prevent Wave Reader from activating via keyboard shortcuts.
                  One URL per line. Changes are saved when you click "Save Settings".
                </HelpText>
              </SettingItem>
              
            </SettingGroup>
            
            <SettingsActions>
              <Button className="btn btn-primary" onClick={handleSaveSettings}>
                💾 Save Settings
              </Button>
              <Button className="btn btn-secondary" onClick={handleResetSettings}>
                🔄 Reset to Defaults
              </Button>
            </SettingsActions>
          </>
        )}
        
        {currentView === 'wave' && (
          <>
            <SettingGroup>
              <SettingGroupTitle>Wave Animation Parameters</SettingGroupTitle>
              
              <SettingItem>
                <SettingLabel>Wave Speed (seconds):</SettingLabel>
                <SettingInput
                  type="number"
                  className="number"
                  value={typeof settings.waveSpeed === 'string' ? settings.waveSpeed : settings.waveSpeed}
                  min={0.1}
                  max={20}
                  step={0.1}
                  onChange={(e) => handleWaveSettingChange('waveSpeed', e.target.value)}
                />
                <HelpText>Duration of the wave animation cycle</HelpText>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Axis Translation X Max:</SettingLabel>
                <SettingInput
                  type="number"
                  className="number"
                  value={typeof settings.axisTranslateAmountXMax === 'string' ? settings.axisTranslateAmountXMax : settings.axisTranslateAmountXMax}
                  onChange={(e) => handleWaveSettingChange('axisTranslateAmountXMax', e.target.value)}
                />
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Axis Translation X Min:</SettingLabel>
                <SettingInput
                  type="number"
                  className="number"
                  value={typeof settings.axisTranslateAmountXMin === 'string' ? settings.axisTranslateAmountXMin : settings.axisTranslateAmountXMin}
                  onChange={(e) => handleWaveSettingChange('axisTranslateAmountXMin', e.target.value)}
                />
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Axis Rotation Y Max:</SettingLabel>
                <SettingInput
                  type="number"
                  className="number"
                  value={typeof settings.axisRotationAmountYMax === 'string' ? settings.axisRotationAmountYMax : settings.axisRotationAmountYMax}
                  onChange={(e) => handleWaveSettingChange('axisRotationAmountYMax', e.target.value)}
                />
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Axis Rotation Y Min:</SettingLabel>
                <SettingInput
                  type="number"
                  className="number"
                  value={typeof settings.axisRotationAmountYMin === 'string' ? settings.axisRotationAmountYMin : settings.axisRotationAmountYMin}
                  onChange={(e) => handleWaveSettingChange('axisRotationAmountYMin', e.target.value)}
                />
              </SettingItem>
              
            </SettingGroup>
            
            <SettingsActions>
              <Button className="btn btn-primary" onClick={handleSaveSettings}>💾 Save Settings</Button>
              <BackButton onClick={() => handleViewChange('general')}>← Back</BackButton>
            </SettingsActions>
          </>
        )}
        
        {currentView === 'css' && (
          <>
            <SettingGroup>
              <SettingGroupTitle>CSS Generation</SettingGroupTitle>
              
              <SettingItem>
                <SettingLabel>
                  <SettingCheckbox
                    type="checkbox"
                    checked={settings.autoGenerateCss}
                    onChange={(e) => handleSettingChange('autoGenerateCss', e.target.checked)}
                  />
                  Auto-generate CSS from parameters
                </SettingLabel>
                <HelpText>When enabled, CSS templates are automatically generated from animation parameters</HelpText>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>CSS Generation Mode:</SettingLabel>
                <SettingSelect
                  value={settings.cssGenerationMode}
                  onChange={(e) => handleSettingChange('cssGenerationMode', e.target.value)}
                >
                  <option value="template">Template-based (Dynamic)</option>
                  <option value="hardcoded">Hardcoded (Static)</option>
                </SettingSelect>
                <HelpText>
                  Template-based: CSS is generated from parameters dynamically<br/>
                  Hardcoded: Use predefined CSS templates
                </HelpText>
              </SettingItem>
            </SettingGroup>
            
            <SettingGroup>
              <SettingGroupTitle>CSS Templates</SettingGroupTitle>
              
              <SettingItem>
                <SettingLabel>CSS Template:</SettingLabel>
                <SettingTextarea
                  className="css"
                  value={settings.cssTemplate}
                  readOnly={settings.autoGenerateCss}
                  onChange={(e) => handleCssSettingChange('cssTemplate', e.target.value)}
                />
                <HelpText>
                  {settings.autoGenerateCss ? 
                    'Auto-generated from parameters above' : 
                    'Edit manually to update parameters below'
                  }
                </HelpText>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>CSS Mouse Template:</SettingLabel>
                <SettingTextarea
                  className="css"
                  value={settings.cssMouseTemplate}
                  readOnly={settings.autoGenerateCss}
                  onChange={(e) => handleCssSettingChange('cssMouseTemplate', e.target.value)}
                />
                <HelpText>
                  {settings.autoGenerateCss ? 
                    'Auto-generated from parameters above' : 
                    'Edit manually to update parameters below'
                  }
                </HelpText>
              </SettingItem>
            </SettingGroup>
            
            <SettingsActions>
              <Button className="btn btn-primary" onClick={handleSaveSettings}>💾 Save Settings</Button>
              <BackButton onClick={() => handleViewChange('general')}>← Back</BackButton>
            </SettingsActions>
          </>
        )}
        
        {currentView === 'domain' && (
          <>
            <SettingGroup>
              <SettingGroupTitle>Domain Configuration</SettingGroupTitle>
              
              <SettingItem>
                <SettingLabel>Current Domain:</SettingLabel>
                <SettingSelect
                  value={localCurrentDomain}
                  onChange={(e) => handleDomainSettingChange('domain', e.target.value)}
                >
                  {localDomainPaths.map(dp => (
                    <option key={dp.domain} value={dp.domain}>
                      {dp.domain}
                    </option>
                  ))}
                </SettingSelect>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Current Path:</SettingLabel>
                <SettingSelect
                  value={localCurrentPath}
                  onChange={(e) => handleDomainSettingChange('path', e.target.value)}
                >
                  {(localDomainPaths.find(dp => dp.domain === localCurrentDomain)?.paths || []).map(path => (
                    <option key={path} value={path}>
                      {path}
                    </option>
                  ))}
                </SettingSelect>
              </SettingItem>
            </SettingGroup>
            
            <SettingsActions>
              <Button className="btn btn-primary" onClick={handleSaveSettings}>💾 Save Settings</Button>
              <BackButton onClick={() => handleViewChange('general')}>← Back</BackButton>
            </SettingsActions>
          </>
        )}
        
        {currentView === 'keyboard' && (
          <>
            <SettingGroup>
              <SettingGroupTitle>Wave Toggle Shortcut</SettingGroupTitle>
              
              <SettingItem>
                <SettingLabel>Toggle Keys:</SettingLabel>
                <KeyboardInput>
                  {Array.from({ length: MAX_TOGGLE_KEYS }, (_, index) => {
                    // Determine which keyChord to display:
                    // - If user hasn't set a keyChord (hasSetKeyChord is false), show defaults
                    // - If user has set a keyChord (hasSetKeyChord is true), show what they set (or None for empty slots)
                    const hasSetKeyChord = settings.toggleKeys?.hasSetKeyChord ?? false;
                    const keyChord = hasSetKeyChord
                      ? (settings.toggleKeys?.keyChord || [])
                      : (KeyChordDefaultFactory() as KeyChord);
                    
                    // Get the key at this index, or undefined if index is out of bounds
                    const selectedKey = keyChord[index];
                    // First check if the stored key is already valid
                    const isKeyValid = selectedKey && KEY_OPTIONS_SET.has(selectedKey);
                    // If not valid, try normalizing it
                    const normalizedValue = selectedKey ? normalizeKey(selectedKey) : null;
                    const normalizedIsValid = normalizedValue && KEY_OPTIONS_SET.has(normalizedValue);
                    // Use the stored key if valid, otherwise use normalized if valid, otherwise 'None'
                    const currentValue = isKeyValid
                      ? selectedKey
                      : normalizedIsValid
                        ? normalizedValue
                        : 'None';
                    
                    return (
                      <SettingSelect
                        key={`toggle-key-${index}`}
                        value={currentValue}
                        onChange={(e) => handleToggleKeyChange(index, e.target.value)}
                      >
                        <option value="None" selected={currentValue === 'None' ? true : undefined}>None</option>
                        {KEY_OPTIONS.map((option: string) => (
                          <option 
                            key={`${option}-${index}`} 
                            value={option}
                            selected={currentValue === option ? true : undefined}
                          >
                            {option}
                          </option>
                        ))}
                      </SettingSelect>
                    );
                  })}
                </KeyboardInput>
                <HelpText>
                  Choose up to four keys from left to right. Modifiers (Ctrl, Shift, Alt, Meta) must be combined with at least one non-modifier key.
                </HelpText>
              </SettingItem>
            </SettingGroup>
            
            <SettingsActions>
              <Button className="btn btn-primary" onClick={handleSaveSettings}>💾 Save Settings</Button>
              <BackButton onClick={() => handleViewChange('general')}>← Back</BackButton>
            </SettingsActions>
          </>
        )}
        
        {currentView === 'advanced' && (
          <>
            <SettingGroup>
              <SettingGroupTitle>Text Settings</SettingGroupTitle>
              
              <SettingItem>
                <SettingLabel>Text Color:</SettingLabel>
                <SettingInput
                  type="text"
                  className="text"
                  value={settings.textColor}
                  onChange={(e) => handleSettingChange('textColor', e.target.value)}
                />
                <HelpText>CSS color value (e.g., 'red', '#ff0000', 'rgb(255,0,0)')</HelpText>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Text Size:</SettingLabel>
                <SettingInput
                  type="text"
                  className="text"
                  value={settings.textSize}
                  onChange={(e) => handleSettingChange('textSize', e.target.value)}
                />
                <HelpText>CSS size value (e.g., '16px', '1.2em', 'large')</HelpText>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>CSS Selector:</SettingLabel>
                <SettingInput
                  type="text"
                  className="text"
                  value={settings.selector}
                  onChange={(e) => handleSettingChange('selector', e.target.value)}
                />
                <HelpText>CSS selector for target elements (e.g., 'body', 'p', '.content', '#main')</HelpText>
              </SettingItem>
            </SettingGroup>
            
            <SettingsActions>
              <Button className="btn btn-primary" onClick={handleSaveSettings}>💾 Save Settings</Button>
              <BackButton onClick={() => handleViewChange('general')}>← Back</BackButton>
            </SettingsActions>
          </>
        )}
      </SettingsContent>
    </SettingsContainer>
    </EditorWrapper>
  );
};

export default SettingsTomes;
