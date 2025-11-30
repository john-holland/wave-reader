import React from 'react';
import SettingsTomes from '../component-middleware/settings/SettingsTomes';
import Options from '../models/options';
import SettingsService, { SettingsDAOInterface } from '../services/settings';
import { WaveAnimationControl } from '../models/defaults';
import Text from '../models/text';

type SettingsProps = {
    initialSettings: Options;
    onUpdateSettings: (settings: Options) => void;
    domain: string;
    path: string;
    onDomainPathChange: (domain: string, path: string) => void;
    settingsService: SettingsDAOInterface;
    children?: React.ReactNode;
};

/**
 * Bridge component that maps old Settings interface to new SettingsTomes component
 * 
 * Converts Options class to Settings interface format expected by SettingsTomes
 */
export const Settings: React.FC<SettingsProps> = (props) => {
  // Convert Options to Settings format
  const convertOptionsToSettings = (options: Options) => {
    return {
      showNotifications: options.showNotifications ?? true,
      waveAnimationControl: (options.waveAnimationControl === WaveAnimationControl.CSS ? 'CSS' : 'MOUSE') as 'CSS' | 'MOUSE',
      toggleKeys: { 
        keyChord: options.toggleKeys?.keyChord ?? [] 
      },
      textColor: options.wave?.text?.color ?? 'initial',
      textSize: options.wave?.text?.size ?? 'initial',
      selector: options.selectors?.[0] ?? 'body',
      cssTemplate: options.wave?.cssTemplate ?? '',
      cssMouseTemplate: options.wave?.cssMouseTemplate ?? '',
      waveSpeed: options.wave?.waveSpeed ?? 2.0,
      axisTranslateAmountXMax: options.wave?.axisTranslateAmountXMax ?? 2,
      axisTranslateAmountXMin: options.wave?.axisTranslateAmountXMin ?? -2,
      axisRotationAmountYMax: options.wave?.axisRotationAmountYMax ?? 2,
      axisRotationAmountYMin: options.wave?.axisRotationAmountYMin ?? -2,
      // Note: autoGenerateCss and cssGenerationMode are SettingsTomes-specific, not Wave properties
      autoGenerateCss: true, // Default value
      cssGenerationMode: 'template' as 'template' | 'hardcoded', // Default value
    };
  };

  // Convert Settings back to Options format for onUpdateSettings
  const convertSettingsToOptions = (settings: any): Options => {
    const options = new Options(props.initialSettings);
    
    // Update Options with new settings values
    options.showNotifications = settings.showNotifications ?? options.showNotifications;
    options.waveAnimationControl = settings.waveAnimationControl ?? options.waveAnimationControl;
    
    if (settings.toggleKeys?.keyChord) {
      options.toggleKeys.keyChord = settings.toggleKeys.keyChord;
    }
    
    if (options.wave) {
      // Update text properties
      if (!options.wave.text) {
        options.wave.text = new Text({ size: 'initial', color: 'initial' });
      }
      options.wave.text.color = settings.textColor ?? options.wave.text.color;
      options.wave.text.size = settings.textSize ?? options.wave.text.size;
      options.wave.cssTemplate = settings.cssTemplate ?? options.wave.cssTemplate;
      options.wave.cssMouseTemplate = settings.cssMouseTemplate ?? options.wave.cssMouseTemplate;
      options.wave.waveSpeed = settings.waveSpeed ?? options.wave.waveSpeed;
      options.wave.axisTranslateAmountXMax = settings.axisTranslateAmountXMax ?? options.wave.axisTranslateAmountXMax;
      options.wave.axisTranslateAmountXMin = settings.axisTranslateAmountXMin ?? options.wave.axisTranslateAmountXMin;
      options.wave.axisRotationAmountYMax = settings.axisRotationAmountYMax ?? options.wave.axisRotationAmountYMax;
      options.wave.axisRotationAmountYMin = settings.axisRotationAmountYMin ?? options.wave.axisRotationAmountYMin;
      // Note: autoGenerateCss and cssGenerationMode are SettingsTomes-specific, not stored on Wave
    }
    
    // Update selectors if selector changed
    if (settings.selector && options.selectors) {
      if (options.selectors.length > 0) {
        options.selectors[0] = settings.selector;
      } else {
        options.selectors = [settings.selector];
      }
    }
    
    return options;
  };

  // Handle settings updates - convert Settings back to Options
  const handleUpdateSettings = (settings: any) => {
    const options = convertSettingsToOptions(settings);
    props.onUpdateSettings(options);
  };

  // Get domain/path settings if available
  const domainPathSettings = props.initialSettings?.getDomainPathSettings?.(
    props.domain, 
    props.path
  );

  // Combine initial settings with domain/path specific settings
  const combinedInitialSettings = {
    ...convertOptionsToSettings(props.initialSettings),
    ...(domainPathSettings ? convertOptionsToSettings(new Options(domainPathSettings)) : {}),
  };

  return (
    <SettingsTomes
      initialSettings={combinedInitialSettings}
      currentDomain={props.domain}
      currentPath={props.path}
      onUpdateSettings={handleUpdateSettings}
      onDomainPathChange={props.onDomainPathChange}
    />
  );
};

export default Settings;
