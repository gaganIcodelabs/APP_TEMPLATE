import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../store';
import defaultConfig from '../../config/configDefault';
import { denormalizeAssetData, mergeConfig } from '../../util';

interface Thunk {
  state: RootState;
  extra: any;
}

interface AssetData {
  appAssets: Record<string, string>;
  pageAssetsData: Record<string, any> | null;
  currentPageAssets: string[];
  version: number | null;
  inProgress: boolean;
  error: string | null;
  translations: Record<string, any>;
}

const initialState: AssetData = {
  appAssets: {},
  pageAssetsData: null,
  currentPageAssets: [],
  version: null,
  inProgress: false,
  error: null,
  translations: {},
};

const pickHostedConfigPaths = (
  assetEntries: [string, string][],
  excludeAssetNames: string[],
) => {
  return assetEntries.reduce((pickedPaths: string[], [name, path]) => {
    if (excludeAssetNames.includes(name)) {
      return pickedPaths;
    }
    return [...pickedPaths, path];
  }, []);
};

const getFirstAssetData = (response: any) =>
  response?.data?.data[0]?.attributes?.data;
const getMultiAssetData = (response: any) => response?.data?.data;
const getMultiAssetIncluded = (response: any) => response?.data?.included;
const findJSONAsset = (assets: any[], absolutePath: string) =>
  assets.find(
    (a: any) =>
      a.type === 'jsonAsset' && a.attributes.assetPath === absolutePath,
  );
const getAbsolutePath = (path: string) =>
  path.charAt(0) !== '/' ? `/${path}` : path;

export const fetchAppAssets = createAsyncThunk<any, void, Thunk>(
  'hostedAssets/fetchAppAssets',
  async (_, { dispatch, getState, extra: sdk }) => {
    const assets = defaultConfig.appCdnAssets;
    const version = getState()?.hostedAssets?.version;

    // App-wide assets include 2 content assets: translations and footer
    const translationsPath = assets.translations;
    const footerPath = assets.footer;

    // The rest of the assets are considered as configurations
    const assetEntries = Object.entries(assets);
    const nonConfigAssets = ['translations', 'footer'];
    const configPaths = pickHostedConfigPaths(assetEntries, nonConfigAssets);

    // If version is given fetch assets by the version,
    // otherwise default to "latest" alias
    const fetchAssets = (paths: string[]) =>
      version
        ? sdk.assetsByVersion({ paths, version })
        : sdk.assetsByAlias({ paths, alias: 'latest' });

    const separateAssetFetches = [
      fetchAssets([translationsPath]),
      fetchAssets([footerPath]),
      fetchAssets(configPaths),
    ];

    const [translationAsset, footerAsset, configAssets] = await Promise.all(
      separateAssetFetches,
    );

    const getVersionHash = (response: any) => response?.data?.meta?.version;
    const versionInTranslationsCall = getVersionHash(translationAsset);

    dispatch(setAppAssets({ assets, versionInTranslationsCall }));

    const response = assetEntries.reduce(
      (collectedAssets: any, assetEntry, i) => {
        const [name, path] = assetEntry;

        if (nonConfigAssets.includes(name)) {
          const assetResponse =
            name === 'translations' ? translationAsset : footerAsset;
          return {
            ...collectedAssets,
            [name]: { path, data: getFirstAssetData(assetResponse) },
          };
        }

        const fetchedConfigAssets = getMultiAssetData(configAssets);
        const jsonAsset = findJSONAsset(
          fetchedConfigAssets,
          getAbsolutePath(path),
        );

        const data = denormalizeAssetData({
          data: jsonAsset?.attributes?.data,
          included: getMultiAssetIncluded(configAssets),
        });
        return { ...collectedAssets, [name]: { path, data } };
      },
      {},
    );

    const { translations: translationsRaw, ...rest } = response || {};
    const translations = translationsRaw?.data || {};

    const configEntries = Object.entries(rest);
    const hostedConfig = configEntries.reduce(
      (collectedData: any, [name, content]: [string, any]) => {
        return { ...collectedData, [name]: content.data || {} };
      },
      {},
    );

    const appConfig = mergeConfig(hostedConfig, defaultConfig);

    return {
      translations,
      appConfig,
    };
  },
);

const hostedAssetsSlice = createSlice({
  name: 'hostedAssets',
  initialState,
  reducers: {
    setAppAssets: (
      state,
      action: PayloadAction<{
        assets: Record<string, string>;
        versionInTranslationsCall: number;
      }>,
    ) => {
      state.appAssets = action.payload.assets;
      state.version = state.version || action.payload.versionInTranslationsCall;
    },
    setTranslations: (state, action: PayloadAction<Record<string, any>>) => {
      state.translations = action.payload;
    },
    setPageAssets: (state, action: PayloadAction<Record<string, any>>) => {
      state.pageAssetsData = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAppAssets.pending, state => {
      state.inProgress = true;
      state.error = null;
    });
    builder.addCase(fetchAppAssets.fulfilled, (state, { payload }) => {
      state.inProgress = false;
      state.error = null;
      state.translations = payload.translations;
    });
    builder.addCase(fetchAppAssets.rejected, (state, action) => {
      state.inProgress = false;
      state.error = action.error.message || 'Failed to fetch assets';
    });
  },
});

const assetsState = (state: RootState) => state.hostedAssets;

export const pageAssetsSelector = createSelector(
  [assetsState],
  state => state.pageAssetsData,
);

export const pageAssetsInProgressSelector = createSelector(
  [assetsState],
  state => state.inProgress,
);

export const pageAssetsErrorSelector = createSelector(
  [assetsState],
  state => state.error,
);

export const translationsSelector = createSelector(
  [assetsState],
  state => state.translations,
);

export const { setAppAssets, setTranslations, setPageAssets } =
  hostedAssetsSlice.actions;

export default hostedAssetsSlice.reducer;
