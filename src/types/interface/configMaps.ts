// -----------------------------------------------------------------------------
// Maps
// -----------------------------------------------------------------------------

export interface FuzzySearchConfig {
  enabled: boolean;
  offset: number; // meters
  defaultZoomLevel: number;
  circleColor: string;
}

export interface MapboxConfig {
  GEOCODING_PLACES_BASE_URL: string;
  countryLimit: string[]; // list of ISO country codes
  limit: number; // max search results
  language: string; // e.g. "en"
}

export interface MapSearchConfig {
  suggestCurrentLocation: boolean;
  currentLocationBoundsDistance: number; // meters
  defaults: any[]; // API returns empty array (type is unknown)
  sortSearchByDistance: boolean;
}

export interface MapsConfig {
  fuzzy: FuzzySearchConfig;

  googleMapsAPIKey: string;

  mapProvider: 'google' | 'mapbox';

  mapboxAccessToken?: string | null;
  mapboxConfig?: MapboxConfig | null;

  search: MapSearchConfig;
}
