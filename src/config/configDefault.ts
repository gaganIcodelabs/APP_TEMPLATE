// Basic configuration for React Native app
// This mimics the web template structure but simplified for mobile

const defaultConfig = {
  // App basic settings
  marketplaceName: process.env.EXPO_PUBLIC_MARKETPLACE_NAME || 'App Template',

  // Localization
  localization: {
    locale: 'en',
  },

  // Layout (placeholder for navigation structure)
  layout: {
    // Will be expanded when implementing navigation
  },

  // Access control (placeholder)
  accessControl: {
    // Will be expanded when implementing auth
  },

  // Placeholder for mandatory configurations check
  get hasMandatoryConfigurations() {
    // For now, always return true - expand when needed
    return true;
  },
};

export default defaultConfig;
