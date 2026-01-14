import { types } from '@util/sdkLoader';
import { EditListingForm } from '../types/editListingForm.type';
import { pickCategoryFields } from '@util/fieldHelpers';
import { pickListingFieldsData } from '../editListing.helper';
import { CategoryNode, ListingFields } from '@appTypes/config';

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
// export const transformFormToListingData = (
//   formData: EditListingForm,
//   marketplaceCurrency: string,
// ) => {
//   const {
//     title,
//     description,
//     listingType,
//     location,
//     images,
//     price,
//     priceVariants,
//     bookingLengthInMinutes,
//     startTimeInterval,
//     availabilityPlan,
//     deliveryOptions,
//     pickupLocation,
//     shippingPriceOneItem,
//     shippingPriceAdditionalItems,
//     // fields,
//   } = formData;

//   console.log('priceVariants inside', JSON.stringify(priceVariants));

//   // Build publicData from custom fields and other data
//   const publicData: Record<string, any> = {};

//   // Add custom fields to publicData
//   // if (fields && Object.keys(fields).length > 0) {
//   //   Object.assign(publicData, fields);
//   // }

//   // Add listing type to publicData
//   if (listingType) {
//     publicData.listingType = listingType;
//   }

//   // Add price variants for booking listings to publicData
//   if (priceVariants && priceVariants.length > 0) {
//     publicData.priceVariationsEnabled = true;
//     publicData.priceVariants = priceVariants.map(variant => ({
//       name: variant.name,
//       price:
//         variant.priceInSubunits != null
//           ? variant.priceInSubunits * 100
//           : undefined,
//       bookingLengthInMinutes: variant.bookingLengthInMinutes,
//     }));
//   }

//   // Add booking length for simple FIXED unit type bookings to publicData
//   if (bookingLengthInMinutes) {
//     publicData.bookingLengthInMinutes = bookingLengthInMinutes;
//   }

//   // Add start time interval for FIXED unit type bookings to publicData
//   if (startTimeInterval) {
//     publicData.startTimeInterval = startTimeInterval;
//   }

//   // Add delivery options to publicData
//   if (deliveryOptions && deliveryOptions.length > 0) {
//     publicData.deliveryOptions = deliveryOptions;
//   }

//   // Add location/address to publicData (not geolocation - that's top level)
//   if (location && location.address) {
//     publicData.location = {
//       address: location.address,
//       building: location.building ? location.building : '',
//     };
//     // if (location.building) {
//     //   publicData.location.building = location.building;
//     // }
//   }

//   // Add pickup location to publicData
//   if (pickupLocation && pickupLocation.address) {
//     publicData.pickupLocation = {
//       address: pickupLocation.address,
//     };
//     if (pickupLocation.building) {
//       publicData.pickupLocation.building = pickupLocation.building;
//     }
//   }

//   // Add pickup location geolocation to publicData
//   if (
//     pickupLocation &&
//     pickupLocation.origin &&
//     pickupLocation.origin.length === 2
//   ) {
//     publicData.pickupLocationGeolocation = {
//       lat: pickupLocation.origin[0],
//       lng: pickupLocation.origin[1],
//     };
//   }

//   // Add shipping prices to publicData (convert from string to number in minor units)
//   if (shippingPriceOneItem) {
//     publicData.shippingPriceOneItem = Math.round(
//       parseFloat(shippingPriceOneItem) * 100,
//     );
//   }

//   if (shippingPriceAdditionalItems) {
//     publicData.shippingPriceAdditionalItems = Math.round(
//       parseFloat(shippingPriceAdditionalItems) * 100,
//     );
//   }

//   // Build the listing data object (top-level parameters)
//   const listingData: Record<string, any> = {
//     title,
//   };

//   // Add publicData if it has any properties
//   if (Object.keys(publicData).length > 0) {
//     listingData.publicData = publicData;
//   }

//   // Add description if provided
//   if (description) {
//     listingData.description = description;
//   }

//   // Add geolocation if location is provided (top-level, not in publicData)
//   if (location && location.origin && location.origin.length === 2) {
//     listingData.geolocation = {
//       lat: location.origin[0],
//       lng: location.origin[1],
//     };
//   }

//   // Add images if provided (array of UUIDs)
//   if (images && images.length > 0) {
//     listingData.images = images.map(img => img.id);
//   }

//   // // Add price if provided (Money object format: { amount, currency })
//   // if (price !== undefined && price !== null) {
//   //   const newPrice = new types.Money(price * 100, marketplaceCurrency);
//   //   listingData.price = newPrice;
//   //   // listingData.price = {
//   //   //   amount: price,
//   //   //   currency: 'USD', // You may want to make this configurable
//   //   // };
//   // }
//   if (priceVariants && priceVariants.length > 0) {
//     const firstVariantPrice = priceVariants[0].priceInSubunits;

//     if (firstVariantPrice != null) {
//       listingData.price = new types.Money(
//         firstVariantPrice * 100,
//         marketplaceCurrency,
//       );
//     }
//   } else if (price !== undefined && price !== null) {
//     listingData.price = new types.Money(price * 100, marketplaceCurrency);
//   }

//   // Add availability plan for calendar bookings (top-level)
//   if (availabilityPlan) {
//     listingData.availabilityPlan = {
//       type: availabilityPlan.type,
//       timezone: availabilityPlan.timezone,
//       entries: availabilityPlan.entries.map(entry => ({
//         dayOfWeek: entry.dayOfWeek,
//         startTime: entry.startTime,
//         endTime: entry.endTime,
//         seats: entry.seats || 1,
//       })),
//     };
//   }

//   // Note: privateData can be added here if needed
//   // listingData.privateData = { ... };

//   return listingData;
// };

export const transformFormToListingData = (
  formData: EditListingForm,
  marketplaceCurrency: string,
  listingType: string,
  categoryKey: string,
  listingCategories: CategoryNode[] = [],
  listingFields: ListingFields,
) => {
  const {
    title,
    description,
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
    ...rest
  } = formData;

  /* ---------------------------
     PUBLIC DATA
  ---------------------------- */
  const publicData: Record<string, any> = {
    listingType,
    transactionProcessAlias: rest.fields.transactionProcessAlias,
    unitType: rest.fields.unitType,
  };

  if (priceVariants?.length) {
    publicData.priceVariationsEnabled = true;
    publicData.priceVariants = priceVariants.map(v => ({
      name: v.name,
      price: v.priceInSubunits ? v.priceInSubunits * 100 : undefined,
      bookingLengthInMinutes: v.bookingLengthInMinutes,
    }));
  }

  if (bookingLengthInMinutes) {
    publicData.bookingLengthInMinutes = bookingLengthInMinutes;
  }

  if (startTimeInterval) {
    publicData.startTimeInterval = startTimeInterval;
  }

  if (deliveryOptions?.length) {
    publicData.deliveryOptions = deliveryOptions;
  }

  if (location?.address) {
    publicData.location = {
      address: location.address,
      building: location.building ?? '',
    };
  }

  if (pickupLocation?.address) {
    publicData.pickupLocation = {
      address: pickupLocation.address,
      building: pickupLocation.building,
    };
  }

  if (pickupLocation?.origin?.length === 2) {
    publicData.pickupLocationGeolocation = {
      lat: pickupLocation.origin[0],
      lng: pickupLocation.origin[1],
    };
  }

  if (shippingPriceOneItem) {
    publicData.shippingPriceOneItem = Math.round(
      Number(shippingPriceOneItem) * 100,
    );
  }

  if (shippingPriceAdditionalItems) {
    publicData.shippingPriceAdditionalItems = Math.round(
      Number(shippingPriceAdditionalItems) * 100,
    );
  }

  /* ---------------------------
     CATEGORY + CUSTOM FIELDS
  ---------------------------- */
  const nestedCategories = pickCategoryFields(
    rest.fields,
    categoryKey,
    1,
    listingCategories,
  );

  Object.assign(publicData, {
    ...[1, 2, 3].reduce((a, i) => ({ ...a, [`${categoryKey}${i}`]: null }), {}),
    ...nestedCategories,
  });

  const publicListingFields = pickListingFieldsData(
    rest,
    'public',
    listingType,
    nestedCategories,
    listingFields,
  );

  const privateListingFields = pickListingFieldsData(
    rest,
    'private',
    listingType,
    nestedCategories,
    listingFields,
  );

  Object.assign(publicData, publicListingFields);

  /* ---------------------------
     PRICE (Sharetribe requires one)
  ---------------------------- */
  let resolvedPrice: any | undefined;

  if (priceVariants?.length && priceVariants[0].priceInSubunits != null) {
    resolvedPrice = new types.Money(
      priceVariants[0].priceInSubunits * 100,
      marketplaceCurrency,
    );
  } else if (price != null) {
    resolvedPrice = new types.Money(price * 100, marketplaceCurrency);
  }

  /* ---------------------------
     FINAL PAYLOAD
  ---------------------------- */
  return {
    title,
    description,
    price: resolvedPrice,
    images: images?.map(i => i.id),
    geolocation:
      location?.origin?.length === 2
        ? { lat: location.origin[0], lng: location.origin[1] }
        : undefined,
    availabilityPlan,
    publicData: Object.keys(publicData).length ? publicData : undefined,
    privateData: Object.keys(privateListingFields).length
      ? privateListingFields
      : undefined,
  };
};
