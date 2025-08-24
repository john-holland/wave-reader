import React from 'react';
import SettingsTomes from '../component-middleware/settings/SettingsTomes';
import Options from '../models/options';
import SettingsService, { SettingsDAOInterface } from '../services/settings';

type SettingsProps = {
    initialSettings: Options;
    onUpdateSettings: (settings: Options) => void;
    domain: string;
    path: string;
    onDomainPathChange: (domain: string, path: string) => void;
    settingsService: SettingsDAOInterface;
    children?: React.ReactNode;
};

// This is a bridge component that maintains the old interface
// while using the new component-middleware system
export const Settings: React.FC<SettingsProps> = (props) => {
  // For now, we'll use the old component until we can properly integrate
  // the new component-middleware system with the existing props
  return <SettingsTomes />;
};

export default Settings;
