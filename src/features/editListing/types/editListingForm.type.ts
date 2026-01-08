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
};

export type AvailabilityException = {
  start: Date; // Start of exception (inclusive)
  end: Date; // End of exception (exclusive)
  seats: number; // 0 means unavailable
};

type EditListingStaticForm = {
  type: string | undefined;
  title: string;
  location: {
    origin: [number, number]; // [latitude, longitude]
    address: string;
    building?: string;
  };
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
