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
  id: string;
  label: string;
  transactionProcess: {
    name: string;
    alias: string;
  };
  unitType?: string;

  defaultListingFields: DefaultListingFields;

  availabilityType?: string;
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
  label?: string;
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
  label?: string;
  key: string;
  scope: 'private' | 'protected' | 'public' | 'meta' | 'metadata';
  schemaType: SchemaType;

  enumOptions?: EnumOption[];

  numberConfig?: {
    minimum?: number;
    maximum?: number;
    step?: number;
  };

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
