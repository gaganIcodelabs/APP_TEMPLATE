// Basic configuration for React Native app
// This mimics the web template structure but simplified for mobile
import { ENV } from '../constants';

const defaultConfig = {
  // App basic settings
  marketplaceName: ENV.MARKETPLACE_NAME || 'App Template',

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

  // App CDN assets configuration
  appCdnAssets: {
    translations: 'content/translations.json',
    footer: 'content/footer.json',
    branding: 'design/branding.json',
    listingTypes: 'listings/listing-types.json',
    listingFields: 'listings/listing-fields.json',
    userTypes: 'users/user-types.json',
    userFields: 'users/user-fields.json',
  },

  // Placeholder for mandatory configurations check
  get hasMandatoryConfigurations() {
    // For now, always return true - expand when needed
    return true;
  },
};

export default defaultConfig;
