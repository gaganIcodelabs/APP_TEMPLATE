import { EditListingForm } from '../types/editListingForm.type';

/**
 * Transforms EditListingForm data into the format expected by Sharetribe SDK's ownListings.create API
 * 
 * Based on official Sharetribe SDK documentation format:
 * - title: string (required, top-level)
 * - description: string (optional, top-level)
 * - geolocation: { lat, lng } (optional, top-level)
 * - price: { amount, currency } (optional, top-level)
 * - images: UUID[] (optional, top-level)
 * - availabilityPlan: { type, timezone, entries } (optional, top-level)
 * - publicData: object (optional, top-level) - custom fields and marketplace-specific data
 * - privateData: object (optional, top-level) - private data not visible to other users
 * 
 * Note: Stock management and availability exceptions are handled separately via additional API calls
 */
export const transformFormToListingData = (formData: EditListingForm) => {
  const {
    title,
    description,
    type,
    location,
    images,
    price,
    priceVariants,
    bookingLengthInMinutes,
    startTimeInterval,
    availabilityPlan,
    deliveryOptions,
    pickupLocation,
    shippingPriceOneItem,
    shippingPriceAdditionalItems,
    fields,
  } = formData;

  // Build publicData from custom fields and other data
  const publicData: Record<string, any> = {};

  // Add custom fields to publicData
  if (fields && Object.keys(fields).length > 0) {
    Object.assign(publicData, fields);
  }

  // Add listing type to publicData
  if (type) {
    publicData.listingType = type;
  }

  // Add price variants for booking listings to publicData
  if (priceVariants && priceVariants.length > 0) {
    publicData.priceVariants = priceVariants.map(variant => ({
      name: variant.name,
      price: variant.price,
      bookingLengthInMinutes: variant.bookingLengthInMinutes,
    }));
  }

  // Add booking length for simple FIXED unit type bookings to publicData
  if (bookingLengthInMinutes) {
    publicData.bookingLengthInMinutes = bookingLengthInMinutes;
  }

  // Add start time interval for FIXED unit type bookings to publicData
  if (startTimeInterval) {
    publicData.startTimeInterval = startTimeInterval;
  }

  // Add delivery options to publicData
  if (deliveryOptions && deliveryOptions.length > 0) {
    publicData.deliveryOptions = deliveryOptions;
  }

  // Add location/address to publicData (not geolocation - that's top level)
  if (location && location.address) {
    publicData.location = {
      address: location.address,
    };
    if (location.building) {
      publicData.location.building = location.building;
    }
  }

  // Add pickup location to publicData
  if (pickupLocation && pickupLocation.address) {
    publicData.pickupLocation = {
      address: pickupLocation.address,
    };
    if (pickupLocation.building) {
      publicData.pickupLocation.building = pickupLocation.building;
    }
  }

  // Add pickup location geolocation to publicData
  if (pickupLocation && pickupLocation.origin && pickupLocation.origin.length === 2) {
    publicData.pickupLocationGeolocation = {
      lat: pickupLocation.origin[0],
      lng: pickupLocation.origin[1],
    };
  }

  // Add shipping prices to publicData (convert from string to number in minor units)
  if (shippingPriceOneItem) {
    publicData.shippingPriceOneItem = Math.round(parseFloat(shippingPriceOneItem) * 100);
  }

  if (shippingPriceAdditionalItems) {
    publicData.shippingPriceAdditionalItems = Math.round(
      parseFloat(shippingPriceAdditionalItems) * 100,
    );
  }

  // Build the listing data object (top-level parameters)
  const listingData: Record<string, any> = {
    title,
  };

  // Add publicData if it has any properties
  if (Object.keys(publicData).length > 0) {
    listingData.publicData = publicData;
  }

  // Add description if provided
  if (description) {
    listingData.description = description;
  }

  // Add geolocation if location is provided (top-level, not in publicData)
  if (location && location.origin && location.origin.length === 2) {
    listingData.geolocation = {
      lat: location.origin[0],
      lng: location.origin[1],
    };
  }

  // Add images if provided (array of UUIDs)
  if (images && images.length > 0) {
    listingData.images = images.map(img => img.id);
  }

  // Add price if provided (Money object format: { amount, currency })
  if (price !== undefined && price !== null) {
    listingData.price = {
      amount: price,
      currency: 'USD', // You may want to make this configurable
    };
  }

  // Add availability plan for calendar bookings (top-level)
  if (availabilityPlan) {
    listingData.availabilityPlan = {
      type: availabilityPlan.type,
      timezone: availabilityPlan.timezone,
      entries: availabilityPlan.entries.map(entry => ({
        dayOfWeek: entry.dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
        seats: entry.seats || 1,
      })),
    };
  }

  // Note: privateData can be added here if needed
  // listingData.privateData = { ... };

  return listingData;
};
