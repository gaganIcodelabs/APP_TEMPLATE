// -----------------------------------------------------------------------------
// STRIPE CONFIG
// -----------------------------------------------------------------------------

export interface StripeAccountTypeOption {
  id: string;
  type: string; // e.g. "radio"
  label: string;
  key: string; // "individual" | "company"
}

export interface AccountConfig {
  // Since every country has different fields, we make all optional.
  iban?: boolean;
  bsb?: boolean;
  accountNumber?: boolean;
  transitNumber?: boolean;
  institutionNumber?: boolean;
  clearingCode?: boolean;
  branchCode?: boolean;
  clabe?: boolean;

  bankName?: boolean;
  branchName?: boolean;
  bankCode?: boolean;
  accountOwnerName?: boolean;

  sortCode?: boolean;
  routingNumber?: boolean;
}

export interface SupportedCountry {
  code: string; // e.g. "AU"
  currency: string; // e.g. "AUD"
  accountConfig: AccountConfig;
}

export interface SupportedCountryWithName extends SupportedCountry {
  name: string; // e.g. "Australia"
}

export interface StripeConfig {
  dayCountAvailableForBooking: number;
  defaultMCC: string;
  publishableKey: string;

  stripeAccountTypeOptions: StripeAccountTypeOption[];

  supportedCountries: SupportedCountry[];
  supportedCountriesWithNames: SupportedCountryWithName[];
}
