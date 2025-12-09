// -----------------------------------------------------------------------------
// USER CONFIG
// -----------------------------------------------------------------------------

// Roles assigned to a user type
export interface UserRoles {
  provider: boolean;
  customer: boolean;
}

// Visibility of various account links in UI
export interface AccountLinksVisibility {
  postListings: boolean;
  payoutDetails: boolean;
  paymentMethods: boolean;
}

// Fields automatically included in the sign-up & profile flow
export interface DefaultUserFields {
  email: boolean;
  payoutDetails: boolean;
  profileImage: boolean;
  paymentMethods: boolean;
  password: boolean;
  displayName: boolean;
  firstName: boolean;
  bio: boolean;
  lastName: boolean;
  phoneNumber: boolean;
}

export interface DisplayNameSettings {
  displayInSignUp: boolean;
}

export interface PhoneNumberSettings {
  displayInSignUp: boolean;
}

// Individual user type configuration: customer / provider
export interface UserTypeConfigItem {
  userType: string; // "customer" | "provider"
  roles: UserRoles;
  accountLinksVisibility: AccountLinksVisibility;
  defaultUserFields: DefaultUserFields;

  label: string;

  displayNameSettings?: DisplayNameSettings;
  phoneNumberSettings?: PhoneNumberSettings;
}

// -----------------------------------------------------------------------------
// USER FIELDS CONFIG
// -----------------------------------------------------------------------------

export interface UserEnumOption {
  label: string;
  option: string;
}

export interface UserFieldShowConfig {
  label: string;
  displayInProfile: boolean;
  unselectedOptions: boolean;
}

export interface UserFieldSaveConfig {
  label: string;
  isRequired: boolean;
  displayInSignUp: boolean;
}

export interface UserFieldTypeConfig {
  limitToUserTypeIds: boolean;
}

export type UserSchemaType =
  | 'text'
  | 'long'
  | 'enum'
  | 'multi-enum'
  | 'boolean'
  | 'date'
  | string; // fallback for future expansion

export interface UserFieldConfigItem {
  key: string;
  scope: string;

  schemaType: UserSchemaType;

  // Optional for text/long
  minimum?: number;
  maximum?: number;

  // Optional for enum/multi-enum
  enumOptions?: UserEnumOption[];

  showConfig: UserFieldShowConfig;
  saveConfig: UserFieldSaveConfig;
  userTypeConfig: UserFieldTypeConfig;
}

// -----------------------------------------------------------------------------
// ROOT USER CONFIG
// -----------------------------------------------------------------------------

export interface UserConfig {
  userTypes: UserTypeConfigItem[];
  userFields: UserFieldConfigItem[];
}
