// Basic config helpers
// Simplified version for React Native

export const mergeConfig = (hostedConfig: any = {}, defaultConfig: any) => {
  // Simple merge for now - can be expanded with deep merge logic later
  return {
    ...defaultConfig,
    ...hostedConfig,
  };
};

export const displayPrice = (listingTypeConfig: any) => {
  return listingTypeConfig?.defaultListingFields?.price !== false;
};

export const displayLocation = (listingTypeConfig: any) => {
  return listingTypeConfig?.defaultListingFields?.location !== false;
};

export const displayDeliveryPickup = (listingTypeConfig: any) => {
  return listingTypeConfig?.defaultListingFields?.pickup !== false;
};

export const displayDeliveryShipping = (listingTypeConfig: any) => {
  return listingTypeConfig?.defaultListingFields?.shipping !== false;
};
