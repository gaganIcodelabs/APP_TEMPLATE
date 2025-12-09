// -----------------------------------------------------------------------------
// IMAGE ASSETS
// -----------------------------------------------------------------------------

import { Branding, Layout } from './configLayoutAndBranding';
import { ListingConfig } from './configListing';
import { MapsConfig } from './configMaps';
import { SearchConfig } from './configSearch';
import { StripeConfig } from './configStripe';
import { UserConfig } from './configUser';

export interface LocalizationConfig {
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

// The root category configuration
export interface CategoryConfiguration {
  key: string; // "categoryLevel"
  scope: string; // "public"
  categoryLevelKeys: string[]; // ["categoryLevel1", "categoryLevel2", ...]
  categories: CategoryNode[]; // top-level categories (recursive tree)
}

export interface AppConfig {
  marketplaceRootURL: string;
  currency: string;
  listingMinimumPriceSubUnits: number;
  marketplaceName: string;

  localization: LocalizationConfig;
  appCdnAssets: AppCdnAssets;
  siteFacebookPage: string | null;
  siteInstagramPage: string | null;
  siteTwitterHandle: string | null;
  googleSearchConsole: GoogleSearchConsoleConfig;
  address: AddressConfig;

  branding: Branding;
  layout: Layout;
  maps: MapsConfig;
  listing: ListingConfig;
  stripe: StripeConfig;
  search: SearchConfig;
  user: UserConfig;
  categoryConfiguration: CategoryConfiguration;

  topbar: any;
  footer: any;

  hasMandatoryConfigurations: boolean;
}

export type Translations = Record<string, string>;

export interface FetchAppAssetsResponse {
  translations: Translations;
  appConfig: AppConfig;
}
