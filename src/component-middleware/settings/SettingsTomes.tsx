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
import SettingsService from '../../services/settings';
import Options from '../../models/options';
import { WaveAnimationControl } from '../../models/defaults';

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

const ConfirmationDialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ConfirmationDialog = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const ConfirmationMessage = styled.p`
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 14px;
  line-height: 1.5;
`;

const ConfirmationButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ConfirmationButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  ` : `
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
    }
  `}
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
  
  // Domain/path settings management state
  const [domainSpecificLoading, setDomainSpecificLoading] = useState<boolean>(false);
  const [pathSpecificSaving, setPathSpecificSaving] = useState<boolean>(false);
  const [pathSpecificLoading, setPathSpecificLoading] = useState<boolean>(false);
  const [checkboxSettingsInitialized, setCheckboxSettingsInitialized] = useState<boolean>(false);
  const [copiedSettings, setCopiedSettings] = useState<any | null>(null);
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  
  // Confirmation dialog state
  const [confirmationDialog, setConfirmationDialog] = useState<{
    show: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }>({
    show: false,
    message: '',
    onConfirm: () => {},
    onCancel: () => {}
  });

  // Refs
  const settingsRef = useRef<Settings>(settings);
  const settingsServiceRef = useRef<SettingsService | null>(null);

  // Conversion functions between Settings and Options
  const convertSettingsToOptions = useCallback((settings: Settings): Options => {
    const options = new Options();
    
    // Update Options with settings values
    options.showNotifications = settings.showNotifications ?? options.showNotifications;
    options.waveAnimationControl = settings.waveAnimationControl === 'CSS' 
      ? WaveAnimationControl.CSS 
      : WaveAnimationControl.MOUSE;
    
    if (settings.toggleKeys?.keyChord) {
      options.toggleKeys.keyChord = settings.toggleKeys.keyChord;
    }
    
    if (!options.wave) {
      options.wave = new Wave();
    }
    
    // Update wave properties
    if (settings.textColor !== undefined) {
      if (!options.wave.text) {
        options.wave.text = new Text({ size: 'initial', color: 'initial' });
      }
      options.wave.text.color = settings.textColor;
    }
    
    if (settings.textSize !== undefined) {
      if (!options.wave.text) {
        options.wave.text = new Text({ size: 'initial', color: 'initial' });
      }
      options.wave.text.size = settings.textSize;
    }
    
    if (settings.cssTemplate !== undefined) {
      options.wave.cssTemplate = settings.cssTemplate;
    }
    
    if (settings.cssMouseTemplate !== undefined) {
      options.wave.cssMouseTemplate = settings.cssMouseTemplate;
    }
    
    if (settings.waveSpeed !== undefined && typeof settings.waveSpeed === 'number') {
      options.wave.waveSpeed = settings.waveSpeed;
    }
    
    if (settings.axisTranslateAmountXMax !== undefined && typeof settings.axisTranslateAmountXMax === 'number') {
      options.wave.axisTranslateAmountXMax = settings.axisTranslateAmountXMax;
    }
    
    if (settings.axisTranslateAmountXMin !== undefined && typeof settings.axisTranslateAmountXMin === 'number') {
      options.wave.axisTranslateAmountXMin = settings.axisTranslateAmountXMin;
    }
    
    if (settings.axisRotationAmountYMax !== undefined && typeof settings.axisRotationAmountYMax === 'number') {
      options.wave.axisRotationAmountYMax = settings.axisRotationAmountYMax;
    }
    
    if (settings.axisRotationAmountYMin !== undefined && typeof settings.axisRotationAmountYMin === 'number') {
      options.wave.axisRotationAmountYMin = settings.axisRotationAmountYMin;
    }
    
    // Update selectors
    if (settings.selector && options.selectors) {
      if (options.selectors.length > 0) {
        options.selectors[0] = settings.selector;
      } else {
        options.selectors = [settings.selector];
      }
    }
    
    return options;
  }, []);
  
  const convertOptionsToSettings = useCallback((options: Options): Settings => {
    return {
      showNotifications: options.showNotifications ?? true,
      waveAnimationControl: (options.waveAnimationControl === WaveAnimationControl.CSS ? 'CSS' : 'MOUSE') as 'CSS' | 'MOUSE',
      toggleKeys: { 
        keyChord: options.toggleKeys?.keyChord ?? KeyChordDefaultFactory() as KeyChord,
        hasSetKeyChord: options.toggleKeys?.keyChord ? true : false
      },
      textColor: options.wave?.text?.color ?? 'initial',
      textSize: options.wave?.text?.size ?? 'initial',
      selector: options.selectors?.[0] ?? 'body',
      cssTemplate: options.wave?.cssTemplate ?? '',
      cssMouseTemplate: options.wave?.cssMouseTemplate ?? '',
      waveSpeed: options.wave?.waveSpeed ?? 2.0,
      axisTranslateAmountXMax: options.wave?.axisTranslateAmountXMax ?? 0,
      axisTranslateAmountXMin: options.wave?.axisTranslateAmountXMin ?? -1,
      axisRotationAmountYMax: options.wave?.axisRotationAmountYMax ?? 1,
      axisRotationAmountYMin: options.wave?.axisRotationAmountYMin ?? -1,
      autoGenerateCss: true, // Default value
      cssGenerationMode: 'template' as 'template' | 'hardcoded', // Default value
    };
  }, []);

  // Load blacklist function
  const loadBlacklist = useCallback(async () => {
    try {
      await EpilepticBlacklistService.initialize();
      const blacklistedUrls = EpilepticBlacklistService.getBlacklistedUrls();
      setEpilepticBlacklist(blacklistedUrls.join('\n'));
    } catch (error) {
      console.warn('Failed to load epileptic blacklist:', error);
    }
  }, []);

  // Initialize SettingsService
  useEffect(() => {
    const initializeSettingsService = async () => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        const tabUrlProvider = (): Promise<string> => {
          return new Promise((resolve) => {
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
              if (tabs.length > 0 && tabs[0].url) {
                resolve(tabs[0].url);
              } else {
                resolve('https://example.com');
              }
            });
          });
        };
        
        const service = SettingsService.withTabUrlProvider(tabUrlProvider);
        settingsServiceRef.current = service;
        console.log('⚙️ SettingsTomes: SettingsService initialized');
      }
    };
    
    initializeSettingsService();
  }, []);

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
        console.log('⚙️ SettingsTomes: Extension context detected, initializing...', {
          hasChrome: typeof chrome !== 'undefined',
          hasStorage: typeof chrome !== 'undefined' && !!chrome.storage,
          hasLocal: typeof chrome !== 'undefined' && !!chrome.storage?.local,
          runtimeId: chrome.runtime?.id
        });
        
        // Initialize Chrome extension message handler
        const handler = new SettingsMessageHandler();
        setMessageHandler(handler);
        
        // Load saved settings from Chrome storage
        if (chrome.storage && chrome.storage.local) {
          try {
            console.log('⚙️ SettingsTomes: Attempting to read from chrome.storage.local...');
            const result = await chrome.storage.local.get(['waveReaderSettings', 'waveReaderDomainPaths', 'waveReaderCheckboxSettings']);
            console.log('⚙️ SettingsTomes: Storage read result', {
              hasResult: !!result,
              hasSettings: !!result.waveReaderSettings,
              hasDomainPaths: !!result.waveReaderDomainPaths,
              hasCheckboxSettings: !!result.waveReaderCheckboxSettings,
              settingsKeys: result.waveReaderSettings ? Object.keys(result.waveReaderSettings) : [],
              waveSpeed: result.waveReaderSettings?.waveSpeed,
              cssTemplateLength: result.waveReaderSettings?.cssTemplate?.length || 0
            });
            
            // Load checkbox settings first (these control how we load other settings)
            let loadedDomainSpecificLoading = false;
            let loadedPathSpecificSaving = false;
            let loadedPathSpecificLoading = false;
            
            if (result.waveReaderCheckboxSettings) {
              loadedDomainSpecificLoading = result.waveReaderCheckboxSettings.domainSpecificLoading ?? false;
              loadedPathSpecificSaving = result.waveReaderCheckboxSettings.pathSpecificSaving ?? false;
              loadedPathSpecificLoading = result.waveReaderCheckboxSettings.pathSpecificLoading ?? false;
              
              // Update state
              setDomainSpecificLoading(loadedDomainSpecificLoading);
              setPathSpecificSaving(loadedPathSpecificSaving);
              setPathSpecificLoading(loadedPathSpecificLoading);
              console.log('⚙️ SettingsTomes: Checkbox settings loaded:', {
                domainSpecificLoading: loadedDomainSpecificLoading,
                pathSpecificSaving: loadedPathSpecificSaving,
                pathSpecificLoading: loadedPathSpecificLoading
              });
            }
            
            // Mark checkbox settings as initialized to allow auto-save
            setCheckboxSettingsInitialized(true);
            
            // Load settings based on checkbox state (use loaded values directly)
            if (loadedDomainSpecificLoading && settingsServiceRef.current) {
              // Load from domain/path system
              try {
                let options: Options;
                
                if (loadedPathSpecificLoading) {
                  // Load from specific path
                  const domain = localCurrentDomain || '';
                  const path = normalizePath(localCurrentPath || '');
                  options = await settingsServiceRef.current.getPathOptionsForDomain(domain, path, true, true) || Options.getDefaultOptions();
                } else {
                  // Load from current domain/path using getCurrentSettings
                  options = await settingsServiceRef.current.getCurrentSettings();
                }
                
                // Convert Options to Settings
                const settingsFromOptions = convertOptionsToSettings(options);
                setSettings(prev => {
                  const sanitized = sanitizeSettings({ ...prev, ...settingsFromOptions });
                  return sanitized;
                });
                setSaved(true);
                console.log('⚙️ SettingsTomes: Settings loaded from domain/path system');
              } catch (error) {
                console.error('⚙️ SettingsTomes: Failed to load from domain/path system, falling back to flat storage', error);
                // Fall through to flat storage loading
              }
            }
            
            // Load from flat storage if not using domain/path system or if domain/path loading failed
            if (!loadedDomainSpecificLoading || !settingsServiceRef.current) {
              if (result.waveReaderSettings) {
                console.log('⚙️ SettingsTomes: Loading settings from storage:', {
                  waveSpeed: result.waveReaderSettings.waveSpeed,
                  axisRotationAmountYMax: result.waveReaderSettings.axisRotationAmountYMax,
                  cssTemplateLength: result.waveReaderSettings.cssTemplate?.length || 0,
                  fullSettings: result.waveReaderSettings
                });
                setSettings(prev => {
                  const sanitized = sanitizeSettings({ ...prev, ...result.waveReaderSettings });
                  console.log('⚙️ SettingsTomes: Sanitized settings', {
                    toggleKeys: sanitized.toggleKeys,
                    waveSpeed: sanitized.waveSpeed,
                    axisRotationAmountYMax: sanitized.axisRotationAmountYMax,
                    cssTemplateLength: sanitized.cssTemplate?.length || 0
                  });
                  return sanitized;
                });
                setSaved(true);
                console.log('⚙️ SettingsTomes: Settings loaded and state updated');
              } else {
                // This is normal on first load - don't warn, just log
                console.log('⚙️ SettingsTomes: No settings found in storage, using defaults');
              }
            }
            
            if (result.waveReaderDomainPaths) {
              setLocalDomainPaths(result.waveReaderDomainPaths);
              console.log('⚙️ SettingsTomes: Domain paths loaded:', result.waveReaderDomainPaths);
            }
          } catch (error) {
            console.error('⚙️ SettingsTomes: Failed to load settings from Chrome storage', {
              error: error,
              errorMessage: error instanceof Error ? error.message : String(error),
              errorStack: error instanceof Error ? error.stack : undefined
            });
          }
        } else {
          console.warn('⚙️ SettingsTomes: chrome.storage.local not available', {
            hasChrome: typeof chrome !== 'undefined',
            hasStorage: typeof chrome !== 'undefined' && !!chrome.storage,
            hasLocal: typeof chrome !== 'undefined' && !!chrome.storage?.local
          });
        }
        
        // Load epileptic blacklist
        console.log('⚙️ SettingsTomes: Loading epileptic blacklist...');
        await loadBlacklist();
        console.log('⚙️ SettingsTomes: Epileptic blacklist loaded');
      } else {
        console.warn('⚙️ SettingsTomes: Not running in extension context', {
          hasChrome: typeof chrome !== 'undefined',
          hasRuntime: typeof chrome !== 'undefined' && !!chrome.runtime,
          runtimeId: typeof chrome !== 'undefined' && chrome.runtime?.id
        });
      }
      
      console.log('⚙️ SettingsTomes: Initialization complete', {
        isExtension,
        hasMessageHandler: !!messageHandler,
        currentSettings: settings
      });
    };

    initializeComponent();
  }, [loadBlacklist, localCurrentDomain, localCurrentPath]);

  // Listen for storage changes to refresh blacklist
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
        if (areaName === 'local' && changes['epileptic_blacklist']) {
          // Blacklist was updated, reload it
          loadBlacklist();
        }
      };
      
      chrome.storage.onChanged.addListener(listener);
      
      return () => {
        chrome.storage.onChanged.removeListener(listener);
      };
    }
  }, [loadBlacklist]);

  // Update settings ref when settings change
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Auto-save checkbox values when they change (separate from Settings, not domain/path-specific)
  useEffect(() => {
    if (!isExtension || !chrome.storage?.local || !checkboxSettingsInitialized) {
      return;
    }

    // Only save if we've initialized (avoid saving default values on first render)
    const saveCheckboxSettings = async () => {
      try {
        await chrome.storage.local.set({
          waveReaderCheckboxSettings: {
            domainSpecificLoading,
            pathSpecificSaving,
            pathSpecificLoading
          }
        });
        console.log('⚙️ SettingsTomes: Auto-saved checkbox settings', {
          domainSpecificLoading,
          pathSpecificSaving,
          pathSpecificLoading
        });
      } catch (error) {
        console.error('⚙️ SettingsTomes: Failed to auto-save checkbox settings', error);
      }
    };

    // Debounce saves to avoid too many writes
    const timeoutId = setTimeout(saveCheckboxSettings, 500);
    return () => clearTimeout(timeoutId);
  }, [isExtension, checkboxSettingsInitialized, domainSpecificLoading, pathSpecificSaving, pathSpecificLoading]);

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

  // Normalize path: empty string or "/" both become "/"
  const normalizePath = useCallback((path: string): string => {
    return path === '' || path === '/' ? '/' : path;
  }, []);

  // Reload settings from domain/path system or flat storage
  const reloadSettingsForCurrentContext = useCallback(async () => {
    if (!isExtension || !chrome.storage?.local) {
      return;
    }

    if (domainSpecificLoading && settingsServiceRef.current) {
      // Load from domain/path system
      try {
        let options: Options;
        
        if (pathSpecificLoading) {
          // Load from specific path
          const domain = localCurrentDomain || '';
          const path = normalizePath(localCurrentPath || '');
          if (domain && domain.trim() !== '') {
            options = await settingsServiceRef.current.getPathOptionsForDomain(domain, path, true, true) || Options.getDefaultOptions();
          } else {
            // Fallback to current domain/path
            options = await settingsServiceRef.current.getCurrentSettings();
          }
        } else {
          // Load from current domain/path using getCurrentSettings
          options = await settingsServiceRef.current.getCurrentSettings();
        }
        
        // Convert Options to Settings
        const settingsFromOptions = convertOptionsToSettings(options);
        setSettings(prev => {
          const sanitized = sanitizeSettings({ ...prev, ...settingsFromOptions });
          return sanitized;
        });
        settingsRef.current = sanitizeSettings(settingsFromOptions);
        setSaved(true);
        console.log('⚙️ SettingsTomes: Settings reloaded from domain/path system');
      } catch (error) {
        console.error('⚙️ SettingsTomes: Failed to reload from domain/path system', error);
      }
    } else {
      // Load from flat storage
      try {
        const result = await chrome.storage.local.get(['waveReaderSettings']);
        if (result.waveReaderSettings) {
          setSettings(prev => {
            const sanitized = sanitizeSettings({ ...prev, ...result.waveReaderSettings });
            return sanitized;
          });
          settingsRef.current = sanitizeSettings(result.waveReaderSettings);
          setSaved(true);
          console.log('⚙️ SettingsTomes: Settings reloaded from flat storage');
        }
      } catch (error) {
        console.error('⚙️ SettingsTomes: Failed to reload from flat storage', error);
      }
    }
  }, [isExtension, domainSpecificLoading, pathSpecificLoading, localCurrentDomain, localCurrentPath, convertOptionsToSettings, normalizePath]);

  const handleDomainSettingChange = useCallback(async (key: 'domain' | 'path', value: string) => {
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
    
    // If domain-specific loading is enabled, reload settings for the new domain/path
    // Only reload if there are no unsaved changes (saved === true)
    if (domainSpecificLoading && settingsServiceRef.current && saved) {
      await reloadSettingsForCurrentContext();
    } else {
      setSaved(false);
    }
  }, [localDomainPaths, localCurrentDomain, onDomainPathChange, domainSpecificLoading, saved, reloadSettingsForCurrentContext]);

  // Event handlers
  const handleViewChange = useCallback(async (view: typeof currentView) => {
    console.log('⚙️ SettingsTomes: Switching to view:', view);
    setCurrentView(view);
    
    // When switching to domain view, fetch current domain/path if not already set
    if (view === 'domain' && settingsServiceRef.current) {
      if (!localCurrentDomain || localCurrentDomain.trim() === '') {
        try {
          const domainPaths = await settingsServiceRef.current.getCurrentDomainAndPaths();
          if (domainPaths && domainPaths.domain) {
            console.log('⚙️ SettingsTomes: Auto-setting current domain/path:', domainPaths);
            setLocalCurrentDomain(domainPaths.domain);
            if (domainPaths.paths && domainPaths.paths.length > 0) {
              setLocalCurrentPath(domainPaths.paths[0]);
            }
            
            // Also add to domain paths list if not already present
            setLocalDomainPaths(prev => {
              const existing = prev.find(dp => dp.domain === domainPaths.domain);
              if (!existing) {
                return [...prev, { domain: domainPaths.domain, paths: domainPaths.paths || [] }];
              }
              return prev;
            });
          }
        } catch (error) {
          console.warn('⚙️ SettingsTomes: Failed to get current domain/path:', error);
        }
      }
    }
    
    // Reload settings when switching to any view (to ensure we show current settings)
    // Only reload if we're not currently editing (saved === true means no unsaved changes)
    if (saved) {
      await reloadSettingsForCurrentContext();
    }
  }, [localCurrentDomain, saved, reloadSettingsForCurrentContext]);

  // Handler for Save Path Settings
  const handleSavePathSettings = useCallback(async () => {
    if (!settingsServiceRef.current || !pathSpecificSaving) {
      console.warn('⚙️ SettingsTomes: Cannot save path settings - service not initialized or path-specific saving disabled');
      return;
    }

    let domain = localCurrentDomain || '';
    
    // If domain is empty, try to get current domain from the page
    if (!domain || domain.trim() === '') {
      try {
        const domainPaths = await settingsServiceRef.current.getCurrentDomainAndPaths();
        if (domainPaths && domainPaths.domain) {
          domain = domainPaths.domain;
          setLocalCurrentDomain(domain);
          console.log('⚙️ SettingsTomes: Auto-set domain from current page:', domain);
        }
      } catch (error) {
        console.warn('⚙️ SettingsTomes: Failed to get current domain:', error);
      }
    }
    
    if (!domain || domain.trim() === '') {
      console.warn('⚙️ SettingsTomes: Cannot save path settings - no domain selected');
      setError('Please enter a domain before saving path settings');
      return;
    }

    let path = localCurrentPath || '';
    
    // If path is empty, try to get current path from the page
    if (!path || path.trim() === '') {
      try {
        const domainPaths = await settingsServiceRef.current.getCurrentDomainAndPaths();
        if (domainPaths && domainPaths.paths && domainPaths.paths.length > 0) {
          path = domainPaths.paths[0];
          setLocalCurrentPath(path);
          console.log('⚙️ SettingsTomes: Auto-set path from current page:', path);
        }
      } catch (error) {
        console.warn('⚙️ SettingsTomes: Failed to get current path:', error);
      }
    }
    
    path = normalizePath(path);
    const currentSettings = settingsRef.current;
    
    try {
      // Check if path settings already exist
      const existingOptions = await settingsServiceRef.current.getPathOptionsForDomain(domain, path, false, false);
      
      if (existingOptions) {
        // Show confirmation dialog
        setConfirmationDialog({
          show: true,
          message: `Settings already exist for ${domain}${path}. Do you want to overwrite them?`,
          onConfirm: async () => {
            setConfirmationDialog({ show: false, message: '', onConfirm: () => {}, onCancel: () => {} });
            
            const service = settingsServiceRef.current;
            if (!service) {
              console.error('⚙️ SettingsTomes: SettingsService not initialized');
              return;
            }
            
            const options = convertSettingsToOptions(currentSettings);
            await service.addSettingsForDomain(domain, path, options);
            setSaved(true);
            console.log('⚙️ SettingsTomes: Path settings saved successfully');
          },
          onCancel: () => {
            setConfirmationDialog({ show: false, message: '', onConfirm: () => {}, onCancel: () => {} });
          }
        });
      } else {
        // No existing settings, save directly
        const service = settingsServiceRef.current;
        if (!service) {
          console.error('⚙️ SettingsTomes: SettingsService not initialized');
          return;
        }
        
        const options = convertSettingsToOptions(currentSettings);
        await service.addSettingsForDomain(domain, path, options);
        setSaved(true);
        console.log('⚙️ SettingsTomes: Path settings saved successfully');
      }
    } catch (error) {
      console.error('⚙️ SettingsTomes: Failed to save path settings', error);
      setError('Failed to save path settings');
    }
  }, [pathSpecificSaving, localCurrentDomain, localCurrentPath, convertSettingsToOptions, normalizePath]);

  // Handler for Save Domain Settings
  const handleSaveDomainSettings = useCallback(async () => {
    if (!settingsServiceRef.current) {
      console.warn('⚙️ SettingsTomes: Cannot save domain settings - service not initialized');
      return;
    }

    let domain = localCurrentDomain || '';
    
    // If domain is empty, try to get current domain from the page
    if (!domain || domain.trim() === '') {
      try {
        const domainPaths = await settingsServiceRef.current.getCurrentDomainAndPaths();
        if (domainPaths && domainPaths.domain) {
          domain = domainPaths.domain;
          setLocalCurrentDomain(domain);
          console.log('⚙️ SettingsTomes: Auto-set domain from current page:', domain);
        }
      } catch (error) {
        console.warn('⚙️ SettingsTomes: Failed to get current domain:', error);
      }
    }
    
    if (!domain || domain.trim() === '') {
      console.warn('⚙️ SettingsTomes: Cannot save domain settings - no domain selected');
      setError('Please enter a domain before saving domain settings');
      return;
    }

    const currentSettings = settingsRef.current;
    
    try {
      // Get domain settings to check if it exists
      const domainSettings = await settingsServiceRef.current.getSettingsForDomain(domain, false);
      
      if (domainSettings && domainSettings.pathSettings.size > 0) {
        // Show confirmation dialog
        setConfirmationDialog({
          show: true,
          message: `Settings already exist for ${domain} with ${domainSettings.pathSettings.size} path(s). Do you want to overwrite all path settings?`,
          onConfirm: async () => {
            setConfirmationDialog({ show: false, message: '', onConfirm: () => {}, onCancel: () => {} });
            
            const service = settingsServiceRef.current;
            if (!service) {
              console.error('⚙️ SettingsTomes: SettingsService not initialized');
              return;
            }
            
            const options = convertSettingsToOptions(currentSettings);
            // Save to all existing paths
            for (const path of domainSettings.pathSettings.keys()) {
              await service.addSettingsForDomain(domain, path, options);
            }
            setSaved(true);
            console.log('⚙️ SettingsTomes: Domain settings saved successfully');
          },
          onCancel: () => {
            setConfirmationDialog({ show: false, message: '', onConfirm: () => {}, onCancel: () => {} });
          }
        });
      } else {
        // No existing settings, create default path
        const service = settingsServiceRef.current;
        if (!service) {
          console.error('⚙️ SettingsTomes: SettingsService not initialized');
          return;
        }
        
        const options = convertSettingsToOptions(currentSettings);
        const defaultPath = normalizePath(localCurrentPath || '');
        await service.addSettingsForDomain(domain, defaultPath, options);
        setSaved(true);
        console.log('⚙️ SettingsTomes: Domain settings saved successfully');
      }
    } catch (error) {
      console.error('⚙️ SettingsTomes: Failed to save domain settings', error);
      setError('Failed to save domain settings');
    }
  }, [localCurrentDomain, localCurrentPath, convertSettingsToOptions, normalizePath]);

  // Handler for Copy Settings
  const handleCopySettings = useCallback(async () => {
    const domain = localCurrentDomain;
    const path = normalizePath(localCurrentPath);
    const currentSettings = settingsRef.current;
    
    const copyData = {
      domain,
      path,
      settings: currentSettings
    };
    
    try {
      // Try to use clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(JSON.stringify(copyData, null, 2));
        console.log('⚙️ SettingsTomes: Settings copied to clipboard');
        
        // Store in component state as well
        setCopiedSettings(copyData.settings);
        setCopiedDomain(domain);
        setCopiedPath(path);
      } else {
        // Fallback: use prompt
        const jsonString = JSON.stringify(copyData, null, 2);
        prompt('Copy these settings (Ctrl+C to copy):', jsonString);
        setCopiedSettings(copyData.settings);
        setCopiedDomain(domain);
        setCopiedPath(path);
      }
    } catch (error) {
      console.error('⚙️ SettingsTomes: Failed to copy settings', error);
      // Fallback: use prompt
      const jsonString = JSON.stringify(copyData, null, 2);
      prompt('Copy these settings (Ctrl+C to copy):', jsonString);
      setCopiedSettings(copyData.settings);
      setCopiedDomain(domain);
      setCopiedPath(path);
    }
  }, [localCurrentDomain, localCurrentPath, normalizePath]);

  // Handler for Paste Settings
  const handlePasteSettings = useCallback(async () => {
    try {
      let jsonString: string;
      
      // Try to use clipboard API
      if (navigator.clipboard && navigator.clipboard.readText) {
        try {
          jsonString = await navigator.clipboard.readText();
        } catch (clipboardError: any) {
          // Handle clipboard permission denied error
          const errorMessage = clipboardError?.message || clipboardError?.toString() || 'Unknown clipboard error';
          console.error('⚙️ SettingsTomes: Clipboard read permission denied', {
            error: clipboardError,
            errorMessage: errorMessage,
            errorName: clipboardError?.name,
            errorStack: clipboardError?.stack
          });
          
          // Show user-friendly error message and fallback to prompt
          setError(`Clipboard access denied: ${errorMessage}. Please paste settings manually.`);
          jsonString = prompt('Clipboard access is not available. Please paste settings JSON here:') || '';
          
          if (!jsonString || jsonString.trim() === '') {
            return;
          }
        }
      } else {
        // Fallback: use prompt if clipboard API not available
        jsonString = prompt('Paste settings JSON:') || '';
      }
      
      if (!jsonString || jsonString.trim() === '') {
        console.warn('⚙️ SettingsTomes: No data to paste');
        return;
      }
      
      // Parse JSON
      let pasteData: any;
      try {
        pasteData = JSON.parse(jsonString);
      } catch (parseError: any) {
        console.error('⚙️ SettingsTomes: Failed to parse JSON', parseError);
        setError(`Invalid JSON format: ${parseError?.message || 'Could not parse JSON'}`);
        return;
      }
      
      // Validate structure
      if (!pasteData.domain || !pasteData.path || !pasteData.settings) {
        console.error('⚙️ SettingsTomes: Invalid paste data structure');
        setError('Invalid settings format. Expected: { domain, path, settings }');
        return;
      }
      
      // Check if overwriting existing settings
      const willOverwrite = settingsRef.current && Object.keys(settingsRef.current).length > 0;
      
      if (willOverwrite) {
        // Show confirmation dialog
        setConfirmationDialog({
          show: true,
          message: `This will overwrite the current settings for ${localCurrentDomain}${normalizePath(localCurrentPath)}. Do you want to continue?`,
          onConfirm: () => {
            setConfirmationDialog({ show: false, message: '', onConfirm: () => {}, onCancel: () => {} });
            
            // Update settings
            const sanitized = sanitizeSettings(pasteData.settings);
            setSettings(sanitized);
            settingsRef.current = sanitized;
            
            // Optionally update selected domain/path to match copied ones
            if (pasteData.domain !== localCurrentDomain) {
              setLocalCurrentDomain(pasteData.domain);
            }
            if (pasteData.path !== localCurrentPath) {
              setLocalCurrentPath(pasteData.path);
            }
            
            setSaved(false);
            console.log('⚙️ SettingsTomes: Settings pasted successfully');
          },
          onCancel: () => {
            setConfirmationDialog({ show: false, message: '', onConfirm: () => {}, onCancel: () => {} });
          }
        });
      } else {
        // No existing settings, paste directly
        const sanitized = sanitizeSettings(pasteData.settings);
        setSettings(sanitized);
        settingsRef.current = sanitized;
        
        if (pasteData.domain !== localCurrentDomain) {
          setLocalCurrentDomain(pasteData.domain);
        }
        if (pasteData.path !== localCurrentPath) {
          setLocalCurrentPath(pasteData.path);
        }
        
        setSaved(false);
        console.log('⚙️ SettingsTomes: Settings pasted successfully');
      }
    } catch (error) {
      console.error('⚙️ SettingsTomes: Failed to paste settings', error);
      setError('Failed to paste settings. Invalid JSON format.');
    }
  }, [localCurrentDomain, localCurrentPath, normalizePath]);

  const handleSaveSettings = useCallback(async () => {
    console.log('⚙️ SettingsTomes: Saving settings');
    console.log('🚨🚨🚨 SETTINGS SAVE: handleSaveSettings called with settings:', {
      cssTemplate: settingsRef.current.cssTemplate?.substring(0, 100) + '...',
      cssTemplateLength: settingsRef.current.cssTemplate?.length || 0,
      cssMouseTemplate: settingsRef.current.cssMouseTemplate?.substring(0, 100) + '...',
      cssMouseTemplateLength: settingsRef.current.cssMouseTemplate?.length || 0,
      fullSettings: settingsRef.current
    });
    
    setCurrentView('saving');
    
    try {
      // Save epileptic blacklist
      const blacklistUrls = epilepticBlacklist
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);
      await EpilepticBlacklistService.setBlacklist(blacklistUrls);
      console.log('⚙️ SettingsTomes: Saved epileptic blacklist', blacklistUrls.length, 'URLs');
      
      // Save to storage based on checkbox state
      if (pathSpecificSaving && settingsServiceRef.current) {
        // Save to domain/path system
        const domain = localCurrentDomain;
        const path = normalizePath(localCurrentPath);
        const options = convertSettingsToOptions(settingsRef.current);
        const service = settingsServiceRef.current;
        if (service) {
          await service.addSettingsForDomain(domain, path, options);
          console.log('⚙️ SettingsTomes: Saved to domain/path system');
        }
      } else if (isExtension) {
        // Save to flat storage
        console.log('🚨🚨🚨 SETTINGS SAVE: About to send SETTINGS_SAVED message to background', {
          type: 'SETTINGS_SAVED',
          hasSettings: !!settingsRef.current,
          hasCssTemplate: !!settingsRef.current.cssTemplate,
          cssTemplateLength: settingsRef.current.cssTemplate?.length || 0,
          target: 'background'
        });
        
        const result = await sendExtensionMessage({
          type: 'SETTINGS_SAVED',
          settings: settingsRef.current,
          source: 'settings',
          target: 'background',
          traceId: Date.now().toString()
        });
        
        console.log('🚨🚨🚨 SETTINGS SAVE: sendExtensionMessage result:', result);
        
        // Save to Chrome storage
        if (chrome.storage && chrome.storage.local) {
          console.log('🚨🚨🚨 SETTINGS SAVE: Saving to chrome.storage.local', {
            hasCssTemplate: !!settingsRef.current.cssTemplate,
            cssTemplateLength: settingsRef.current.cssTemplate?.length || 0
          });
          
          await chrome.storage.local.set({ 
            waveReaderSettings: settingsRef.current,
            waveReaderDomainPaths: localDomainPaths,
            waveReaderCheckboxSettings: {
              domainSpecificLoading,
              pathSpecificSaving,
              pathSpecificLoading
            }
          });
          
          console.log('🚨🚨🚨 SETTINGS SAVE: Successfully saved to chrome.storage.local', {
            checkboxSettings: {
              domainSpecificLoading,
              pathSpecificSaving,
              pathSpecificLoading
            }
          });
        }
        
        // Send settings to content script for CSS consumption
        console.log('🚨🚨🚨 SETTINGS SAVE: Sending settings to content script for CSS consumption', {
          cssTemplate: settingsRef.current.cssTemplate?.substring(0, 200),
          cssTemplateLength: settingsRef.current.cssTemplate?.length || 0,
          cssMouseTemplate: settingsRef.current.cssMouseTemplate?.substring(0, 200),
          waveSpeed: settingsRef.current.waveSpeed,
          axisRotationAmountYMax: settingsRef.current.axisRotationAmountYMax,
          axisRotationAmountYMin: settingsRef.current.axisRotationAmountYMin,
          axisTranslateAmountXMax: settingsRef.current.axisTranslateAmountXMax,
          axisTranslateAmountXMin: settingsRef.current.axisTranslateAmountXMin,
          fullSettings: settingsRef.current
        });
        
        try {
          // Send to content script via message handler - send directly to content
          // Use settingsRef.current directly (plain object)
          console.log('🚨🚨🚨 SETTINGS SAVE: Sending settings to content script', {
            settings: settingsRef.current,
            waveSpeed: settingsRef.current.waveSpeed,
            cssTemplateLength: settingsRef.current.cssTemplate?.length || 0
          });
          
          if (isExtension && messageHandler) {
            const contentResult = await messageHandler.sendMessage('content', {
              type: 'SETTINGS_UPDATED',
              options: settingsRef.current,
              source: 'settings',
              traceId: Date.now().toString()
            });
            
            console.log('🚨🚨🚨 SETTINGS SAVE: Sent SETTINGS_UPDATED to content script, result:', contentResult);
          } else {
            console.warn('🚨🚨🚨 SETTINGS SAVE: Cannot send to content script - not in extension context or message handler not ready');
          }
        } catch (contentError) {
          console.error('🚨🚨🚨 SETTINGS SAVE: Failed to send settings to content script:', contentError);
        }
      }
      
      // Notify parent component
      if (onUpdateSettings) {
        onUpdateSettings(settingsRef.current);
      }
      
      setSaved(true);
      
      // Reload settings immediately after saving to ensure we have the latest data from storage.
      // This avoids a race condition where setSaved(true) and setCurrentView() might be batched
      // together, causing handleViewChange to see stale saved state and skip the reload.
      // By calling reloadSettingsForCurrentContext directly here, we ensure settings are refreshed
      // right after saving, regardless of React's batching behavior.
      if (domainSpecificLoading || pathSpecificSaving) {
        await reloadSettingsForCurrentContext();
      }
      
      setCurrentView('general');
      
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setCurrentView('error');
    }
  }, [isExtension, localDomainPaths, onUpdateSettings, epilepticBlacklist, domainSpecificLoading, pathSpecificSaving, reloadSettingsForCurrentContext]);

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

  // Render confirmation dialog if shown
  const renderConfirmationDialog = () => {
    if (!confirmationDialog.show) return null;
    
    return (
      <ConfirmationDialogOverlay onClick={(e) => {
        if (e.target === e.currentTarget) {
          confirmationDialog.onCancel();
        }
      }}>
        <ConfirmationDialog>
          <ConfirmationMessage>{confirmationDialog.message}</ConfirmationMessage>
          <ConfirmationButtons>
            <ConfirmationButton variant="secondary" onClick={confirmationDialog.onCancel}>
              Cancel
            </ConfirmationButton>
            <ConfirmationButton variant="primary" onClick={confirmationDialog.onConfirm}>
              Confirm
            </ConfirmationButton>
          </ConfirmationButtons>
        </ConfirmationDialog>
      </ConfirmationDialogOverlay>
    );
  };

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
                      await EpilepticBlacklistService.initialize();
                      
                      // Get the current tab URL
                      let currentUrl = window.location.href;
                      if (typeof chrome !== 'undefined' && chrome.tabs) {
                        try {
                          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                          if (tabs[0]?.url) {
                            currentUrl = tabs[0].url;
                          }
                        } catch (e) {
                          console.warn('Could not get tab URL:', e);
                        }
                      }
                      
                      // Add URL to blacklist
                      if (currentUrl) {
                        await EpilepticBlacklistService.addUrl(currentUrl);
                        // Reload blacklist to update the textarea
                        await loadBlacklist();
                        console.log('🌊 Added URL to epileptic blacklist:', currentUrl);
                      }
                      
                      // Create mailto link
                      const subject = encodeURIComponent('Epileptic Animation Report - Wave Reader');
                      const body = encodeURIComponent(
                        `I am reporting an animation that may trigger epileptic symptoms.\n\n` +
                        `URL: ${currentUrl}\n` +
                        `Timestamp: ${new Date().toISOString()}\n\n` +
                        `Additional details:\n`
                      );
                      const mailtoLink = `mailto:john.gebhard.holland+epileptic@gmail.com?subject=${subject}&body=${body}`;
                      
                      // Open mailto link
                      window.location.href = mailtoLink;
                    } catch (error) {
                      console.error('Failed to report epileptic animation:', error);
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
                <SettingLabel>
                  <SettingCheckbox
                    type="checkbox"
                    checked={domainSpecificLoading}
                    onChange={(e) => setDomainSpecificLoading(e.target.checked)}
                  />
                  Domain Specific Loading
                </SettingLabel>
                <HelpText>When enabled, settings are loaded from the domain/path system</HelpText>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>
                  <SettingCheckbox
                    type="checkbox"
                    checked={pathSpecificSaving}
                    onChange={(e) => setPathSpecificSaving(e.target.checked)}
                  />
                  Path Specific Saving
                </SettingLabel>
                <HelpText>When enabled, settings are saved to path-specific storage</HelpText>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>
                  <SettingCheckbox
                    type="checkbox"
                    checked={pathSpecificLoading}
                    onChange={(e) => setPathSpecificLoading(e.target.checked)}
                  />
                  Path Specific Loading
                </SettingLabel>
                <HelpText>When enabled, settings are loaded from path-specific storage</HelpText>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Current Domain:</SettingLabel>
                <div style={{ position: 'relative', width: '100%' }}>
                  <SettingInput
                    type="text"
                    className="text"
                    list="domain-options"
                    value={localCurrentDomain || ''}
                    onChange={(e) => handleDomainSettingChange('domain', e.target.value)}
                    placeholder="Enter domain (e.g., example.com)"
                  />
                  <datalist id="domain-options">
                    {localDomainPaths.map(dp => (
                      <option key={dp.domain} value={dp.domain} />
                    ))}
                  </datalist>
                </div>
                <Button 
                  className="btn btn-secondary" 
                  onClick={handleSaveDomainSettings}
                  style={{ marginTop: '8px' }}
                >
                  💾 Save Domain Settings
                </Button>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Current Path:</SettingLabel>
                <div style={{ position: 'relative', width: '100%' }}>
                  <SettingInput
                    type="text"
                    className="text"
                    list="path-options"
                    value={localCurrentPath || ''}
                    onChange={(e) => handleDomainSettingChange('path', e.target.value)}
                    placeholder="Enter path (e.g., / or /path/to/page)"
                  />
                  <datalist id="path-options">
                    {(() => {
                      const paths = localDomainPaths.find(dp => dp.domain === localCurrentDomain)?.paths || [];
                      const normalizedPaths = paths.map(p => normalizePath(p));
                      const uniquePaths = Array.from(new Set(['/', ...normalizedPaths]));
                      return uniquePaths.map(path => (
                        <option key={path} value={path} />
                      ));
                    })()}
                  </datalist>
                </div>
                <Button 
                  className="btn btn-secondary" 
                  onClick={handleSavePathSettings}
                  style={{ marginTop: '8px' }}
                >
                  💾 Save Path Settings
                </Button>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Copy/Paste Settings</SettingLabel>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Button 
                    className="btn btn-secondary" 
                    onClick={handleCopySettings}
                  >
                    📋 Copy Settings
                  </Button>
                  <Button 
                    className="btn btn-secondary" 
                    onClick={handlePasteSettings}
                  >
                    📄 Paste Settings
                  </Button>
                </div>
                <HelpText>
                  Copy stores the selected domain and path settings (e.g. domain: "google.com", path: "/search"), and paste overwrites the newly selected path or domain with the copied settings. Click "save settings" to save the overwritten (e.g. to move settings from "google.com/search" to "google.com/maps")!
                </HelpText>
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
    {renderConfirmationDialog()}
    </EditorWrapper>
  );
};

export default SettingsTomes;
