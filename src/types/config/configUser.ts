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
  required?: boolean;
}

export interface PhoneNumberSettings {
  displayInSignUp: boolean;
  required?: boolean;
}

// Individual user type configuration: customer / provider
export interface UserTypeConfigItem {
  id?: string;
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
  required: boolean;
  displayInSignUp: boolean;
  placeholderMessage?: string;
  requiredMessage?: string;
}

export interface UserFieldTypeConfig {
  limitToUserTypeIds: boolean;
  userTypeIds?: string[];
}

export type UserSchemaType =
  | 'text'
  | 'long'
  | 'enum'
  | 'multi-enum'
  | 'boolean'
  // | 'date'
  | 'youtubeVideoUrl';
// | string; // fallback for future expansion

export interface UserFieldNumberConfig {
  minimum?: number;
  maximum?: number;
}

export interface UserFieldConfigItem {
  key: string;
  // scope: string;
  scope: 'private' | 'protected' | 'public' | 'meta';
  label?: string;

  schemaType: UserSchemaType;

  // Optional for text/long
  // minimum?: number;
  // maximum?: number;
  numberConfig?: UserFieldNumberConfig;

  // Optional for enum/multi-enum
  enumOptions?: UserEnumOption[];

  showConfig?: UserFieldShowConfig;
  saveConfig?: UserFieldSaveConfig;
  userTypeConfig?: UserFieldTypeConfig;
}

// -----------------------------------------------------------------------------
// ROOT USER CONFIG
// -----------------------------------------------------------------------------

export interface UserConfig {
  userTypes: UserTypeConfigItem[];
  userFields: UserFieldConfigItem[];
}

// custom field for user
export interface CustomUserFieldInputProps {
  key: string;
  name: string;
  fieldConfig: UserFieldConfigItem;
  defaultRequiredMessage: string;
}
