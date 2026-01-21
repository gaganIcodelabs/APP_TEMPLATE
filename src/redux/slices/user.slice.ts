/* eslint-disable @typescript-eslint/no-unused-vars */
import { CurrentUser, StorableError, Thunk } from '@appTypes/index';
import { RootState } from '@redux/store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { denormalisedResponseEntities } from '@util/data';
import { storableError } from '@util/errors';
import { util as sdkUtil } from '@util/sdkLoader';
import { showCreateListingLinkForUser } from '@util/userHelpers';
import { AppConfig } from './hostedAssets.slice';

export interface UserState {
  currentUser: null | CurrentUser;
  currentUserShowError: StorableError | null;
  updateCurrentUserError: null | StorableError;
  updateCurrentUserInProgress: boolean;
  language: string;
  isUserGuest: boolean;
  isGuestLoginModalOpenOnce: boolean;
  fetchCurrentUserProgress: boolean;
  updateOwnListingInProgress: boolean;
}

const currentUserParameters = {
  include: ['effectivePermissionSet', 'profileImage', 'stripeAccount'],
  'fields.image': [
    'variants.square-small',
    'variants.square-small2x',
    'variants.square-xsmall',
    'variants.square-xsmall2x',
  ],
  'imageVariant.square-xsmall': sdkUtil.objectQueryString({
    w: 40,
    h: 40,
    fit: 'crop',
  }),
  'imageVariant.square-xsmall2x': sdkUtil.objectQueryString({
    w: 80,
    h: 80,
    fit: 'crop',
  }),
};

const mergeCurrentUser = (
  oldCurrentUser: CurrentUser | null,
  newCurrentUser: CurrentUser | null,
): CurrentUser | null => {
  const {
    id: oId,
    type: oType,
    attributes: oAttr,
    ...oldRelationships
  } = oldCurrentUser || {};

  if (newCurrentUser === null) {
    return null;
  }
  if (oldCurrentUser === null) {
    return newCurrentUser;
  }

  const { id, type, attributes, ...relationships } = newCurrentUser;

  // Passing null will remove currentUser entity.
  // Only relationships are merged.
  // TODO figure out if sparse fields handling needs a better handling.
  return { id, type, attributes, ...oldRelationships, ...relationships };
};

const initialState: UserState = {
  currentUser: null,
  currentUserShowError: null,
  updateCurrentUserError: null,
  updateCurrentUserInProgress: false,
  fetchCurrentUserProgress: false,
  language: '',
  isUserGuest: false,
  isGuestLoginModalOpenOnce: false,
  updateOwnListingInProgress: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearCurrentUser: state => {
      state.currentUser = null;
      state.currentUserShowError = null;
      // state.currentUserHasListings = false;
      // state.currentUserHasListingsError = null;
      // state.currentUserSaleNotificationCount = 0;
      // state.currentUserOrderNotificationCount = 0;

      // state.currentUserNotificationCountError = null;
    },
    setCurrentUser: (state, { payload }) => {
      state.currentUser = mergeCurrentUser(
        state.currentUser as CurrentUser,
        payload,
      );
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchCurrentUser.pending, state => {
      state.currentUserShowError = null;
      state.fetchCurrentUserProgress = true;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.currentUser = mergeCurrentUser(
        state.currentUser as CurrentUser,
        action.payload as CurrentUser,
      );
      state.fetchCurrentUserProgress = false;
      state.currentUserShowError = null;
    });

    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.currentUserShowError = storableError(action.error as any);
      state.fetchCurrentUserProgress = false;
    });

    // builder.addCase(updateCurrentUser.pending, (state, _) => {
    //   state.updateCurrentUserError = null;
    //   state.updateCurrentUserInProgress = true;
    // });

    // builder.addCase(updateCurrentUser.fulfilled, (state, action) => {
    //   state.currentUser = mergeCurrentUser(
    //     state.currentUser as CurrentUser,
    //     action.payload as CurrentUser,
    //   );
    //   state.updateCurrentUserError = null;
    //   state.updateCurrentUserInProgress = false;
    // });
    // builder.addCase(updateCurrentUser.rejected, (state, action) => {
    //   state.updateCurrentUserInProgress = false;
    //   state.updateCurrentUserError = storableError(action.error as any);
    // });
    // builder.addCase(updateOwnListing.pending, state => {
    //   state.updateOwnListingInProgress = true;
    // });
    // builder.addCase(updateOwnListing.fulfilled, state => {
    //   state.updateOwnListingInProgress = false;
    // });

    // builder.addCase(updateOwnListing.rejected, state => {
    //   state.updateOwnListingInProgress = false;
    // });
  },
});

export const fetchCurrentUser = createAsyncThunk<
  CurrentUser | undefined,
  Record<string, unknown>,
  Thunk
>(
  'user/fetchCurrentUser',
  async (params = {}, { dispatch, extra: sdk, rejectWithValue }) => {
    try {
      const parameters = { ...currentUserParameters, ...params } as any;
      const response = await sdk.currentUser?.show(parameters);
      const entities = denormalisedResponseEntities(response);

      if (entities.length !== 1) {
        throw new Error(
          'Expected a resource in the sdk.currentUser.show response',
        );
      }

      const currentUser: CurrentUser = entities[0];

      // Make sure auth info is up to date
      //   dispatch(authInfo());
      //   dispatch(fetchStripeAccount());

      return currentUser;
    } catch (error: any) {
      console.log('err', error);
      return rejectWithValue({
        message: error?.message || 'Failed to fetch current user',
      });
    }
  },
);

// export const updateCurrentUser = createAsyncThunk<{}, {}, Thunk>(
//   'user/updateCurrentUser',
//   async (params, { dispatch, extra: sdk }) => {
//     const res = await sdk.currentUser?.updateProfile(params, {
//       expand: true,
//       include: ['profileImage', 'stripeAccount'],
//       'fields.image': [
//         'variants.square-small',
//         'variants.square-small2x',
//       ] as any,
//     });
//     dispatch(addMarketplaceEntities({ sdkResponse: res }));
//     const entities = denormalisedResponseEntities(res);
//     if (entities.length !== 1) {
//       throw new Error(
//         'Expected a resource in the sdk.currentUser.show response',
//       );
//     }
//     const currentUser = entities[0];
//     return currentUser;
//   },
// );

// export const uploadUserProfileImage = createAsyncThunk<
//   {},
//   { file: any },
//   Thunk
// >('userSlice/uploadUserProfileImage', async ({ file }, { extra: sdk }) => {
//   try {
//     const bodyParams = {
//       image: file,
//     };

//     const queryParams = {
//       expand: true,
//       'fields.image': [
//         'variants.square-small',
//         'variants.square-small2x',
//       ] as any,
//     };
//     const res = await sdk.images?.upload(bodyParams, queryParams);

//     return res?.data?.data;
//   } catch (error) {
//     return storableError(error as any);
//   }
// });

// export const updateOwnListing = createAsyncThunk<
//   {},
//   { listingId: string; [key: string]: any },
//   Thunk
// >('userSlice/updateOwnListing', async (params, { dispatch, extra: sdk }) => {
//   try {
//     const { listingId, ...rest } = params;
//     const response = await sdk.ownListings?.update(
//       { id: listingId as any, ...rest },
//       { expand: true },
//     );
//     dispatch(addMarketplaceEntities({ sdkResponse: response }));
//     return response;
//   } catch (error) {
//     console.log('error updateOwnListing', error);
//   }
// });

// export const fectchOwnListings = createAsyncThunk<{}, {}, Thunk>(
//   'userSlice/fectchOwnListings',
//   async (_, { dispatch, extra: sdk }) => {
//     try {
//       const response = await sdk.ownListings?.query({});
//       dispatch(addMarketplaceEntities({ sdkResponse: response }));
//       return response;
//     } catch (error) {
//       console.log('error fectchOwnListings', error);
//     }
//   },
// );

export const { clearCurrentUser, setCurrentUser } = userSlice.actions;

export const currentUserWishListSelector = (state: RootState) =>
  state.user?.currentUser?.attributes?.profile?.publicData?.wishList;
export const currentUserSelector = (state: RootState) => state.user.currentUser;
export const updateCurrentUserInProgressSelector = (state: RootState) =>
  state.user?.updateCurrentUserInProgress;
export const currentUserDisplayNameSelector = (state: RootState) =>
  state.user?.currentUser?.attributes.profile?.displayName;
export const currentUserBioSelector = (state: RootState) =>
  state.user?.currentUser?.attributes.profile?.bio;
export const currentUserStripeAccountSelector = (state: RootState) =>
  state.user?.currentUser?.stripeAccount;
export const currentUserProfileImageSelector = (state: RootState) =>
  state.user?.currentUser?.profileImage;
// export const stripeCustomerSelector = (state: RootState) =>
//   state.user.currentUser?.stripeCustomer;
export const stripeAccountIdSelector = (state: RootState) =>
  state.user?.currentUser?.stripeAccount?.attributes?.stripeAccountId;
export const currentUserIdSelector = (state: RootState) =>
  state.user?.currentUser?.id.uuid;
export const currentUserProgressSelector = (state: RootState) =>
  state.user?.fetchCurrentUserProgress;
export const currentUserEmailSelector = (state: RootState) =>
  state.user?.currentUser?.attributes.email;
export const currentUserProfileSelector = (state: RootState) =>
  state.user?.currentUser?.attributes.profile;
export const currentUserTypeSelector = (state: RootState) =>
  state.user?.currentUser?.attributes?.profile?.publicData?.userType;
export const currentUserMetadataSelector = (state: RootState) =>
  state.user?.currentUser?.attributes?.profile?.metadata;
export const currentUserPublicDataSelector = (state: RootState) =>
  state.user?.currentUser?.attributes.profile?.publicData;
export const canCurrentUserPostListingsSelector = (state: RootState) =>
  state.user?.currentUser?.effectivePermissionSet?.attributes?.postListings ===
  'permission/allow';
export const showCreateListingLinkForCurrentUserSelector = (
  state: RootState,
  config: AppConfig | undefined,
) => {
  if (!config) return false;
  if (!state.user?.currentUser) return false;
  return showCreateListingLinkForUser(config, state.user?.currentUser);
};

export default userSlice.reducer;
