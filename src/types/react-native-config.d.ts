declare module 'react-native-config' {
  export interface NativeConfig {
    API_URL?: string;
    SHARETRIBE_SDK_CLIENT_ID?: string;
    SHARETRIBE_SDK_CLIENT_SECRET?: string;
    SHARETRIBE_SDK_TRANSIT_VERBOSE?: string;
    SHARETRIBE_USING_SSL?: string;
    SDK_ASSET_CDN_BASE_URL?: string;
    MARKETPLACE_NAME?: string;
    MARKETPLACE_ROOT_URL?: string;
    STRIPE_PUBLISHABLE_KEY?: string;
    MAPBOX_ACCESS_TOKEN?: string;
    APP_ENV?: string;
    SDK_BASE_URL?: string;
    REACT_NATIVE_SDK_BASE_URL?: string;
    SENTRY_DSN?: string;
    MONGO_URL?: string;
    DEV_API_SERVER_PORT?: string;
    FACEBOOK_APP_ID?: string;
    GOOGLE_MAPS_API_KEY?: string;
    REACT_APP_GOOGLE_ANALYTICS_ID?: string;
    REACT_APP_PLAUSIBLE_DOMAINS?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
