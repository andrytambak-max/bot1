/**
 * Main export file for Account Switcher
 */

export { AccountSwitcher as default } from './AccountSwitcher';
export { ProviderClient } from './ProviderClient';

export type {
  AIProviderConfig,
  AccountSwitcherConfig,
  SwitchLog,
} from './config';

export type {
  Message,
  GenerateOptions,
} from './ProviderClient';

export { PROVIDER_TEMPLATES, ENV_VAR_MAPPING } from './config';
