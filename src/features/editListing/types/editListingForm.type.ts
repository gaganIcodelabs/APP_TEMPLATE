export type PriceVariant = {
  name?: string;
  price?: number; // Price in minor units (cents)
  bookingLengthInMinutes?: number; // For FIXED unit type bookings
};

export type AvailabilityPlanEntry = {
  dayOfWeek: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  startTime: string; // Format: "HH:mm" (e.g., "09:00")
  endTime: string; // Format: "HH:mm" (e.g., "17:00")
  seats?: number; // Number of seats available (default: 1)
};

export type AvailabilityPlan = {
  type: 'availability-plan/time';
  timezone: string; // IANA timezone (e.g., "America/New_York")
  entries: AvailabilityPlanEntry[];
  exceptions?: AvailabilityException[]; // Optional availability exceptions
};

export type AvailabilityException = {
  start: string; // ISO date string (e.g., "2026-01-09T16:00:00.000Z")
  end: string; // ISO date string (e.g., "2026-01-09T17:00:00.000Z")
  seats: number; // 0 means unavailable
};

export type ImageItem = {
  id: string;
  uri: string;
};

type EditListingStaticForm = {
  type: string | undefined;
  title: string;
  description?: string;
  location: {
    origin: [number, number]; // [latitude, longitude]
    address: string;
    building?: string;
  };
  images?: ImageItem[]; // Array of uploaded images
  price?: number; // Price in minor units (cents)
  stock?: number; // Stock quantity
  stockTypeInfinity?: boolean; // For infinite stock checkbox
  priceVariants?: PriceVariant[]; // For booking listings with price variations
  bookingLengthInMinutes?: number; // For simple FIXED unit type bookings
  startTimeInterval?: 'hour' | 'halfHour' | 'quarterHour'; // For FIXED unit type bookings
  availabilityPlan?: AvailabilityPlan; // For calendar bookings
  availabilityExceptions?: AvailabilityException[]; // For calendar bookings
  // Delivery fields
  deliveryOptions?: ('pickup' | 'shipping')[]; // Selected delivery options
  pickupLocation?: {
    origin: [number, number]; // [latitude, longitude]
    address: string;
    building?: string;
  };
  shippingPriceOneItem?: string; // Shipping price for one item (as string for input)
  shippingPriceAdditionalItems?: string; // Shipping price for additional items (as string for input)
};

type EditListingDynamicForm = {
  fields: Record<string, string | number>;
};

export type EditListingForm = EditListingStaticForm & EditListingDynamicForm;

// Type for the rest of the form data (excluding known fields)
export type EditListingFormRest = Omit<
  EditListingForm,
  | 'type'
  | 'title'
  | 'description'
  | 'location'
  | 'images'
  | 'price'
  | 'stock'
  | 'stockTypeInfinity'
  | 'priceVariants'
  | 'bookingLengthInMinutes'
  | 'startTimeInterval'
  | 'availabilityPlan'
  | 'availabilityExceptions'
  | 'deliveryOptions'
  | 'pickupLocation'
  | 'shippingPriceOneItem'
  | 'shippingPriceAdditionalItems'
  | 'fields'
>;
