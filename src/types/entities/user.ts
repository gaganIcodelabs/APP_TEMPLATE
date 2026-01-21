import { UUID } from '../common/types';
import { Image } from '../common/images';

export interface UserAttributes {
  banned?: boolean;
  deleted?: boolean;
  profile?: {
    displayName?: string;
    abbreviatedName?: string;
    bio?: string;
  };
}

export interface AuthorAttributes {
  profile?: {
    displayName?: string;
    abbreviatedName?: string;
    bio?: string;
  };
}

export interface DeletedUserAttributes {
  deleted: boolean;
}

export interface BannedUserAttributes {
  banned: boolean;
}

// Denormalised user object
export interface User {
  id: UUID;
  type: 'user';
  attributes:
    | UserAttributes
    | AuthorAttributes
    | DeletedUserAttributes
    | BannedUserAttributes;
  profileImage?: Image;
}

export type CurrentUserPermissions = {
  read: 'permission/allow' | 'permission/deny';
  initiateTransactions: 'permission/allow' | 'permission/deny';
  postListings: 'permission/allow' | 'permission/deny';
};

export type CurrentUserState = 'active' | 'pending-approval' | 'inactive';

export interface CurrentUserAttributes {
  banned: boolean;
  deleted: boolean;
  email: string;
  emailVerified?: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    abbreviatedName?: string;
    bio?: string | null;
    privateData?: Record<string, any>;
    protectedData?: Record<string, any>;
    publicData?: Record<string, any>;
    metadata?: Record<string, any>;
  };
  stripeConnected?: boolean;

  permissions?: CurrentUserPermissions;
  stripePayoutsEnabled?: boolean;
  createdAt?: string;
  state?: CurrentUserState;
  stripeChargesEnabled?: boolean;
  identityProviders?: { idpId: string; userId: string }[];
  pendingEmail?: string | null;
}

// Denormalised currentUser object
export type CurrentUser = {
  id: UUID;
  type: 'currentUser';
  attributes: CurrentUserAttributes;
  profileImage?: Image;
  stripeAccount?: any; // TODO: Define StripeAccount type
  effectivePermissionSet?: {
    id: UUID;
    type: 'permissionSet';
    attributes: CurrentUserPermissions;
  };
};
