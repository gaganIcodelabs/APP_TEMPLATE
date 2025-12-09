// -----------------------------------------------------------------------------
// LISTING TYPES
// -----------------------------------------------------------------------------

export interface TransactionType {
  process: string;
  alias: string;
  unitType: string;
}

export interface DefaultListingFields {
  description: boolean;
  availability: boolean;
  payoutDetails: boolean;
  images: boolean;
  pickup: boolean;
  title: boolean;
  shipping: boolean;
  location: boolean;
  price: boolean;
  stock: boolean;
}

export interface PriceVariations {
  enabled: boolean;
}

export interface ListingType {
  listingType: string;
  label: string;
  transactionType: TransactionType;

  defaultListingFields: DefaultListingFields;

  availabilityType: string;
  stockType?: string;
  priceVariations?: PriceVariations;
}

export type ListingTypes = ListingType[];

// -----------------------------------------------------------------------------
// LISTING FIELDS
// -----------------------------------------------------------------------------

export type SchemaType = 'enum' | 'multi-enum' | 'text' | 'long';

export interface EnumOption {
  label: string;
  option: string;
}

export interface FilterConfig {
  indexForSearch?: boolean;
  label: string;
  filterType?: string; // e.g. SelectMultipleFilter
  searchMode?: string; // e.g. has_all
  group?: string; // "primary"
}

export interface ShowConfig {
  label: string;
  isDetail: boolean;
  unselectedOptions: boolean;
}

export interface SaveConfig {
  label: string;
  isRequired: boolean;
}

export interface CategoryConfig {
  limitToCategoryIds: boolean;
  categoryIds?: string[];
}

export interface ListingTypeConfig {
  limitToListingTypeIds: boolean;
  listingTypeIds?: string[];
}

export interface ListingField {
  key: string;
  scope: string; // "public"
  schemaType: SchemaType;

  enumOptions?: EnumOption[];

  minimum?: number;
  maximum?: number;
  step?: number;

  filterConfig: FilterConfig;
  showConfig: ShowConfig;
  saveConfig: SaveConfig;

  categoryConfig?: CategoryConfig;
  listingTypeConfig?: ListingTypeConfig;
}

export type ListingFields = ListingField[];

export interface ListingConfig {
  enforceValidListingType: boolean;
  listingFields: ListingFields;
  listingTypes: ListingTypes;
}
