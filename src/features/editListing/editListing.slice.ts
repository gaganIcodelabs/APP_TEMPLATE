import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  EntityState,
} from '@reduxjs/toolkit';
import { Thunk, StorableError } from '@appTypes/index';
import { OwnListing } from '@appTypes/entities/listing';
import { ListingImageLayout } from '@appTypes/config/configLayoutAndBranding';
import { RootState } from '@redux/store';
import { storableError } from '@util/errors';
import { denormalisedResponseEntities, updatedEntities } from '@util/data';
import { addMarketplaceEntities } from '@redux/slices/marketplaceData.slice';
import { getImageVariantInfo } from './editListing.helper';

// ================ Entity Adapter ================ //

// Each entity represents the state for one editListing wizard/screen
export interface EditListingEntity {
  id: string; // The editListing wizard.key from React Navigation (required by EntityAdapter)
  wizardKey: string; // Same as id, kept for clarity
  currentListing: OwnListing | null;

  // Create listing
  createListingInProgress: boolean;
  createListingError: StorableError | null;

  // Update listing
  updateListingInProgress: boolean;
  updateListingError: StorableError | null;

  // Fetch listing
  fetchListingInProgress: boolean;
  fetchListingError: StorableError | null;
}

// Create the entity adapter
const editListingAdapter = createEntityAdapter<EditListingEntity>();

// ================ Initial State ================ //

const initialState = editListingAdapter.getInitialState();

// Helper to get or create entity for a editListing wizard
const getOrCreateEntity = (
  state: EntityState<EditListingEntity, string>,
  wizardKey: string,
): EditListingEntity => {
  const existing = state.entities[wizardKey];
  if (existing) return existing;

  return {
    id: wizardKey,
    wizardKey,
    currentListing: null,
    createListingInProgress: false,
    createListingError: null,
    updateListingInProgress: false,
    updateListingError: null,
    fetchListingInProgress: false,
    fetchListingError: null,
  };
};

// ================ Async Thunks ================ //

export const createListing = createAsyncThunk<
  { wizardKey: string; listing: OwnListing },
  {
    wizardKey: string;
    title: string;
    description?: string;
    price?: any;
    publicData?: Record<string, any>;
    privateData?: Record<string, any>;
    geolocation?: any;
    availabilityPlan?: any;
    [key: string]: any;
  },
  Thunk
>(
  'editListing/createListing',
  async (params, { dispatch, extra: sdk, rejectWithValue }) => {
    const { wizardKey, ...listingParams } = params;

    try {
      const response = await sdk.ownListings?.create(listingParams, {
        expand: true,
      });

      const apiResponse = response.data;
      const entities = updatedEntities({}, apiResponse);
      dispatch(addMarketplaceEntities({ entities }));

      const denormalisedEntities = denormalisedResponseEntities(response);
      if (denormalisedEntities.length !== 1) {
        throw new Error('Expected a single listing in the response');
      }

      return { wizardKey, listing: denormalisedEntities[0] as OwnListing };
    } catch (error: any) {
      console.log('Error creating listing:', error);
      return rejectWithValue({ wizardKey, error: storableError(error) });
    }
  },
);

export const updateListing = createAsyncThunk<
  { wizardKey: string; listing: OwnListing },
  {
    wizardKey: string;
    id: string;
    title?: string;
    description?: string;
    price?: any;
    publicData?: Record<string, any>;
    privateData?: Record<string, any>;
    geolocation?: any;
    availabilityPlan?: any;
    [key: string]: any;
  },
  Thunk
>(
  'editListing/updateListing',
  async (params, { dispatch, extra: sdk, rejectWithValue }) => {
    const { wizardKey, id, ...updateParams } = params;

    try {
      const response = await sdk.ownListings?.update(
        { id: id as any, ...updateParams },
        { expand: true },
      );

      const apiResponse = response.data;
      const entities = updatedEntities({}, apiResponse);
      dispatch(addMarketplaceEntities({ entities }));

      const denormalisedEntities = denormalisedResponseEntities(response);
      if (denormalisedEntities.length !== 1) {
        throw new Error('Expected a single listing in the response');
      }

      return { wizardKey, listing: denormalisedEntities[0] as OwnListing };
    } catch (error: any) {
      console.log('Error updating listing:', error);
      return rejectWithValue({ wizardKey, error: storableError(error) });
    }
  },
);

export const fetchOwnListing = createAsyncThunk<
  { wizardKey: string; listing: OwnListing },
  { wizardKey: string; id: string },
  Thunk
>(
  'editListing/fetchOwnListing',
  async ({ wizardKey, id }, { dispatch, extra: sdk, rejectWithValue }) => {
    try {
      const response = await sdk.ownListings?.show(
        { id: id as any },
        { expand: true },
      );

      const apiResponse = response.data;
      const entities = updatedEntities({}, apiResponse);
      dispatch(addMarketplaceEntities({ entities }));

      const denormalisedEntities = denormalisedResponseEntities(response);
      if (denormalisedEntities.length !== 1) {
        throw new Error('Expected a single listing in the response');
      }

      return { wizardKey, listing: denormalisedEntities[0] as OwnListing };
    } catch (error: any) {
      console.log('Error fetching listing:', error);
      return rejectWithValue({ wizardKey, error: storableError(error) });
    }
  },
);

export const requestImageUpload = createAsyncThunk<
  any,
  {
    file: {
      uri: string;
      id: string;
      type: string;
      name: string;
    };
    listingImageConfig: ListingImageLayout;
  },
  Thunk
>(
  'editListing/requestImageUploadStatus',
  async (actionPayload, { extra: sdk }) => {
    try {
      const { listingImageConfig, file } = actionPayload;

      const imageVariantInfo = getImageVariantInfo(listingImageConfig);
      const queryParams = {
        expand: true,
        'fields.image': imageVariantInfo.fieldsImage,
        ...imageVariantInfo.imageVariants,
      };

      const res = await sdk.images?.upload(
        { image: file } as any,
        queryParams as any,
      );
      return res;
    } catch (error) {
      return storableError(error as any);
    }
  },
);

// ================ Slice ================ //

const editListingSlice = createSlice({
  name: 'editListing',
  initialState,
  reducers: {
    // Initialize or clear state for a specific editListing wizard
    initializeEditListingWizard: (state, action: { payload: string }) => {
      const wizardKey = action.payload;
      if (!state.entities[wizardKey]) {
        editListingAdapter.addOne(state, getOrCreateEntity(state, wizardKey));
      }
    },

    // Clear state for a specific editListing wizard (when screen is unmounted)
    clearEditListingWizard: (state, action: { payload: string }) => {
      const wizardKey = action.payload;
      editListingAdapter.removeOne(state, wizardKey);
    },

    // Clear listing for a specific editListing wizard
    clearCurrentListing: (state, action: { payload: string }) => {
      const wizardKey = action.payload;
      const entity = state.entities[wizardKey];
      if (entity) {
        editListingAdapter.updateOne(state, {
          id: wizardKey,
          changes: {
            currentListing: null,
            createListingError: null,
            updateListingError: null,
            fetchListingError: null,
          },
        });
      }
    },

    // Set listing for a specific editListing wizard
    setCurrentListing: (
      state,
      action: { payload: { wizardKey: string; listing: OwnListing } },
    ) => {
      const { wizardKey, listing } = action.payload;
      const entity =
        state.entities[wizardKey] || getOrCreateEntity(state, wizardKey);

      if (!state.entities[wizardKey]) {
        editListingAdapter.addOne(state, {
          ...entity,
          currentListing: listing,
        });
      } else {
        editListingAdapter.updateOne(state, {
          id: wizardKey,
          changes: { currentListing: listing },
        });
      }
    },

    // Clear errors for a specific editListing wizard
    clearErrors: (state, action: { payload: string }) => {
      const wizardKey = action.payload;
      const entity = state.entities[wizardKey];
      if (entity) {
        editListingAdapter.updateOne(state, {
          id: wizardKey,
          changes: {
            createListingError: null,
            updateListingError: null,
            fetchListingError: null,
          },
        });
      }
    },
  },
  extraReducers: builder => {
    // Create listing
    builder
      .addCase(createListing.pending, (state, action) => {
        const wizardKey = action.meta.arg.wizardKey;
        const entity =
          state.entities[wizardKey] || getOrCreateEntity(state, wizardKey);

        if (!state.entities[wizardKey]) {
          editListingAdapter.addOne(state, {
            ...entity,
            createListingInProgress: true,
            createListingError: null,
          });
        } else {
          editListingAdapter.updateOne(state, {
            id: wizardKey,
            changes: {
              createListingInProgress: true,
              createListingError: null,
            },
          });
        }
      })
      .addCase(createListing.fulfilled, (state, action) => {
        const { wizardKey, listing } = action.payload;
        editListingAdapter.updateOne(state, {
          id: wizardKey,
          changes: {
            createListingInProgress: false,
            currentListing: listing,
            createListingError: null,
          },
        });
      })
      .addCase(createListing.rejected, (state, action) => {
        const wizardKey =
          (action.payload as any)?.wizardKey || action.meta.arg.wizardKey;
        const error =
          (action.payload as any)?.error || (action.payload as StorableError);

        if (state.entities[wizardKey]) {
          editListingAdapter.updateOne(state, {
            id: wizardKey,
            changes: {
              createListingInProgress: false,
              createListingError: error,
            },
          });
        }
      });

    // Update listing
    builder
      .addCase(updateListing.pending, (state, action) => {
        const wizardKey = action.meta.arg.wizardKey;
        const entity =
          state.entities[wizardKey] || getOrCreateEntity(state, wizardKey);

        if (!state.entities[wizardKey]) {
          editListingAdapter.addOne(state, {
            ...entity,
            updateListingInProgress: true,
            updateListingError: null,
          });
        } else {
          editListingAdapter.updateOne(state, {
            id: wizardKey,
            changes: {
              updateListingInProgress: true,
              updateListingError: null,
            },
          });
        }
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        const { wizardKey, listing } = action.payload;
        editListingAdapter.updateOne(state, {
          id: wizardKey,
          changes: {
            updateListingInProgress: false,
            currentListing: listing,
            updateListingError: null,
          },
        });
      })
      .addCase(updateListing.rejected, (state, action) => {
        const wizardKey =
          (action.payload as any)?.wizardKey || action.meta.arg.wizardKey;
        const error =
          (action.payload as any)?.error || (action.payload as StorableError);

        if (state.entities[wizardKey]) {
          editListingAdapter.updateOne(state, {
            id: wizardKey,
            changes: {
              updateListingInProgress: false,
              updateListingError: error,
            },
          });
        }
      });

    // Fetch listing
    builder
      .addCase(fetchOwnListing.pending, (state, action) => {
        const wizardKey = action.meta.arg.wizardKey;
        const entity =
          state.entities[wizardKey] || getOrCreateEntity(state, wizardKey);

        if (!state.entities[wizardKey]) {
          editListingAdapter.addOne(state, {
            ...entity,
            fetchListingInProgress: true,
            fetchListingError: null,
          });
        } else {
          editListingAdapter.updateOne(state, {
            id: wizardKey,
            changes: {
              fetchListingInProgress: true,
              fetchListingError: null,
            },
          });
        }
      })
      .addCase(fetchOwnListing.fulfilled, (state, action) => {
        const { wizardKey, listing } = action.payload;
        editListingAdapter.updateOne(state, {
          id: wizardKey,
          changes: {
            fetchListingInProgress: false,
            currentListing: listing,
            fetchListingError: null,
          },
        });
      })
      .addCase(fetchOwnListing.rejected, (state, action) => {
        const wizardKey =
          (action.payload as any)?.wizardKey || action.meta.arg.wizardKey;
        const error =
          (action.payload as any)?.error || (action.payload as StorableError);

        if (state.entities[wizardKey]) {
          editListingAdapter.updateOne(state, {
            id: wizardKey,
            changes: {
              fetchListingInProgress: false,
              fetchListingError: error,
            },
          });
        }
      });
  },
});

// ================ Actions ================ //

export const {
  initializeEditListingWizard,
  clearEditListingWizard,
  clearCurrentListing,
  setCurrentListing,
  clearErrors,
} = editListingSlice.actions;

export default editListingSlice.reducer;

// ================ Selectors ================ //

// Get the entity adapter selectors
export const {
  selectById: selectRouteEntity,
  selectIds: selectRouteKeys,
  selectEntities: selectAllRouteEntities,
  selectAll: selectAllRoutes,
} = editListingAdapter.getSelectors((state: RootState) => state.editListing);

// Base selector for edit listing state
export const selectEditListingState = (state: RootState) => state.editListing;

// Selectors for a specific editListing wizard
export const selectCurrentListing = (state: RootState, wizardKey: string) =>
  selectRouteEntity(state, wizardKey)?.currentListing || null;

export const selectCreateListingInProgress = (
  state: RootState,
  wizardKey: string,
) => selectRouteEntity(state, wizardKey)?.createListingInProgress || false;

export const selectCreateListingError = (state: RootState, wizardKey: string) =>
  selectRouteEntity(state, wizardKey)?.createListingError || null;

export const selectUpdateListingInProgress = (
  state: RootState,
  wizardKey: string,
) => selectRouteEntity(state, wizardKey)?.updateListingInProgress || false;

export const selectUpdateListingError = (state: RootState, wizardKey: string) =>
  selectRouteEntity(state, wizardKey)?.updateListingError || null;

export const selectFetchListingInProgress = (
  state: RootState,
  wizardKey: string,
) => selectRouteEntity(state, wizardKey)?.fetchListingInProgress || false;

export const selectFetchListingError = (state: RootState, wizardKey: string) =>
  selectRouteEntity(state, wizardKey)?.fetchListingError || null;

// Helper selector to check if a editListing wizard is initialized
export const selectIsRouteInitialized = (state: RootState, wizardKey: string) =>
  !!selectRouteEntity(state, wizardKey);
