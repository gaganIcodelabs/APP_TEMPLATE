import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface MarketplaceDataState {
  entities: Record<string, any>;
}

const initialState: MarketplaceDataState = {
  entities: {},
};

const marketplaceDataSlice = createSlice({
  name: 'marketplaceData',
  initialState,
  reducers: {
    addMarketplaceEntities: (
      state,
      action: PayloadAction<{ entities: Record<string, any> }>,
    ) => {
      state.entities = {
        ...state.entities,
        ...action.payload.entities,
      };
    },
    clearMarketplaceEntities: state => {
      state.entities = {};
    },
  },
});

const marketplaceDataState = (state: RootState) => state.marketplaceData;

export const entitiesSelector = createSelector(
  [marketplaceDataState],
  state => state.entities,
);

export const { addMarketplaceEntities, clearMarketplaceEntities } =
  marketplaceDataSlice.actions;

export default marketplaceDataSlice.reducer;
