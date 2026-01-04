type EditListingStaticForm = {
  type: string | undefined;
  title: string;
};

type EditListingDynamicForm = {
  fields: Record<string, string | number>;
};

export type EditListingForm = EditListingStaticForm & EditListingDynamicForm;
