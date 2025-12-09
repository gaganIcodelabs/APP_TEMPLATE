// ----------------------
//  FILTER TYPES
// ----------------------

// export type SchemaType =
//   | "category"
//   | "dates"
//   | "price"
//   | "listingType"
//   | "seats"
//   | string;

// --- Category filter ---
export interface CategoryFilter {
  key: string; // "categoryLevel"
  schemaType: 'category';
  scope: string; // "public"
  isNestedEnum: boolean;
  nestedParams: string[]; // ["categoryLevel1", "categoryLevel2", ...]
}

// --- Dates filter ---
export interface DatesFilter {
  key: string; // "dates"
  schemaType: 'dates';
  label: string;
  availability: string; // "time-full"
  dateRangeMode: string; // "day"
}

// --- Price filter ---
export interface PriceFilter {
  key: string; // "price"
  schemaType: 'price';
  label: string;
  min: number;
  max: number;
  step: number;
}

// Union of default filters
export type DefaultFilter = CategoryFilter | DatesFilter | PriceFilter;

// ----------------------
//  SORTING CONFIG
// ----------------------

export interface SortOption {
  key: string; // e.g. "createdAt", "-price", "relevance"
  labelTranslationKey: string;
  labelTranslationKeyLong?: string;
}

export interface SortConfig {
  active: boolean;
  queryParamName: string; // "sort"
  relevanceKey: string; // "relevance"
  relevanceFilter: string; // "keywords"
  conflictingFilters: string[];
  options: SortOption[];
}

// ----------------------
//  OTHER SEARCH CONFIG
// ----------------------

export interface ListingTypeFilter {
  enabled: boolean;
  schemaType: 'listingType';
}

export interface SeatsFilter {
  enabled: boolean;
  schemaType: 'seats';
}

export interface MainSearch {
  searchType: string; // "location"
}

// ----------------------
// FINAL Search Config
// ----------------------

export interface SearchConfig {
  mainSearch: MainSearch;
  defaultFilters: DefaultFilter[];
  sortConfig: SortConfig;
  listingTypeFilter: ListingTypeFilter;
  seatsFilter: SeatsFilter;
}
