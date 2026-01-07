export type PriceVariant = {
  name?: string;
  price?: number; // Price in minor units (cents)
  bookingLengthInMinutes?: number; // For FIXED unit type bookings
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
  stockTypeInfinity?: string[] | boolean; // For infinite stock checkbox
  priceVariants?: PriceVariant[]; // For booking listings with price variations
  bookingLengthInMinutes?: number; // For simple FIXED unit type bookings
  startTimeInterval?: 'hour' | 'halfHour' | 'quarterHour'; // For FIXED unit type bookings
};

type EditListingDynamicForm = {
  fields: Record<string, string | number>;
};

export type EditListingForm = EditListingStaticForm & EditListingDynamicForm;
