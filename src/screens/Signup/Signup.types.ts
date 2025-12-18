export type SignupFormValues = {
  email: string;
  password: string;
  userType: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  phoneNumber?: string;
  terms: string[];
} & Record<string, any>; // Dynamic user fields
