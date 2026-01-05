type EditListingStaticForm = {
  type: string | undefined;
  title: string;
  location: {
    origin: [number, number]; // [latitude, longitude]
    address: string;
    building?: string;
  };
};

type EditListingDynamicForm = {
  fields: Record<string, string | number>;
};

export type EditListingForm = EditListingStaticForm & EditListingDynamicForm;
