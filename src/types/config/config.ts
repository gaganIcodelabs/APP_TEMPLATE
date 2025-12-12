// -----------------------------------------------------------------------------
// IMAGE ASSETS
// -----------------------------------------------------------------------------

export interface LocalizationConfig {
  currency?: string;
  locale: string;
  firstDayOfWeek: number;
}

export interface AppCdnAssets {
  translations: string;
  footer: string;
  topbar: string;
  branding: string;
  layout: string;
  listingTypes: string;
  listingFields: string;
  search: string;
  transactionSize: string;
  analytics: string;
  googleSearchConsole: string;
  maps: string;
  categories: string;
  localization: string;
  userTypes: string;
  userFields: string;
}

export interface GoogleSearchConsoleConfig {
  googleSiteVerification: string | null;
}

export interface AddressConfig {
  addressCountry: string | null;
  addressRegion: string | null;
  postalCode: string | null;
  streetAddress: string | null;
}

// -----------------------------------------------------------------------------
// CATEGORY CONFIG
// -----------------------------------------------------------------------------

// A single category node — recursive structure
export interface CategoryNode {
  name: string;
  id: string;
  subcategories: CategoryNode[];
}

export type AccessControlConfig = any;

export type Translations = Record<string, string>;

export type TransactionSizeConfig = {
  listingMinimumPrice: {
    amount: number;
    type: string;
  };
};

export type AnalyticsConfig = any;
