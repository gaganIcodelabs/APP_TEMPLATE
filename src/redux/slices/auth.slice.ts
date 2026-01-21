import { Thunk } from '@appTypes/index';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { AuthInfo } from '../../types/auth';
import { storableError } from '../../util';
import * as log from '../../util/log';
import { RootState } from '../store';
import { clearCurrentUser, fetchCurrentUser } from './user.slice';

const authenticated = (authInfo: AuthInfo) => authInfo?.isAnonymous === false;
const loggedInAs = (authInfo: AuthInfo) => authInfo?.isLoggedInAs === true;

// ================ Initial State ================ //

const initialState = {
  isAuthenticated: null as boolean | null,

  // is marketplace operator logged in as a marketplace user
  isLoggedInAs: false,

  // scopes associated with current token
  authScopes: [] as string[],

  // auth info
  authInfoLoaded: false,
  authInfoInProgress: false,
  authInfoError: null as any,

  // login
  loginError: null as any,
  loginInProgress: false,

  // logout
  logoutError: null as any,
  logoutInProgress: false,

  // signup
  createUserError: null as any,
  createUserInProgress: false,

  // confirm (create use with idp)
  confirmError: null as any,
  confirmInProgress: false,
};

// ================ Async Thunks ================ //

// const loadAuthInfo = createAsyncThunk<
//   Promise<AuthInfo | null>,
//   void,
//   {
//     dispatch: AppDispatch;
//     state: RootState;
//     extra: any;
//   }
// >('auth/loadAuthInfo', (_, thunkAPI) => {
//   const { extra: sdk } = thunkAPI;
//   return sdk.authInfo().catch((e: ApiErrorResponse) => {
//     // Requesting auth info just reads the token from the token
//     // store (i.e. cookies), and should not fail in normal
//     // circumstances. If it fails, it's due to a programming
//     // error. In that case we mark the operation done and dispatch
//     // `null` success action that marks the user as unauthenticated.
//     log.error(e, 'auth-info-failed');

//     return null;
//   });
// });

// const loginWithUsernamePassword = createAsyncThunk<
//   unknown,
//   { username: string; password: string },
//   {
//     dispatch: AppDispatch;
//     state: RootState;
//     extra: any;
//   }
// >(
//   'auth/loginWithUsernamePassword',
//   ({ username, password }, thunkAPI) => {
//     const { rejectWithValue, extra: sdk } = thunkAPI;

//     return sdk
//       .login({ username, password })
//       .catch((e: ApiErrorResponse) => rejectWithValue(storableError(e)));
//   },
//   {
//     condition: (_, { getState }) => {
//       const state = getState();
//       if (authenticationInProgress(state, 'loginInProgress')) {
//         return false;
//       }
//     },
//   },
// );

// const logoutThunk = createAsyncThunk<
//   unknown,
//   void,
//   {
//     dispatch: AppDispatch;
//     state: RootState;
//     extra: any;
//     rejectWithValue: (value: unknown) => never;
//   }
// >(
//   'auth/logout',
//   (_, thunkAPI) => {
//     const { rejectWithValue, extra: sdk, dispatch } = thunkAPI;

//     return sdk
//       .logout()
//       .then(() => {
//         // dispatch(clearCurrentUser());
//         log.clearUserId();
//         return true;
//       })
//       .catch((e: ApiErrorResponse) => rejectWithValue(storableError(e)));
//   },
//   {
//     condition: (_, { getState }) => {
//       const state = getState();
//       if (authenticationInProgress(state, 'logoutInProgress')) {
//         return false;
//       }
//     },
//   },
// );

// Old version with .then() chain - kept for reference
// export const signupWithEmailPassword = createAsyncThunk<
//   unknown,
//   {
//     email: string;
//     password: string;
//     firstName: string;
//     lastName: string;
//     displayName?: string;
//     publicData: Record<string, any>;
//     privateData: Record<string, any>;
//     protectedData: Record<string, any>;
//   },
//   Thunk
// >(
//   'auth/signupWithEmailPassword',
//   async (params, thunkAPI) => {
//     const { rejectWithValue, extra: sdk, dispatch } = thunkAPI;

//     return sdk.currentUser
//       .create(params)
//       .then(() => {
//         // After user is created, automatically log them in
//         dispatch(
//           login({
//             username: params.email,
//             password: params.password,
//           }),
//         );
//         return params;
//       })
//       .catch((e: any) => {
//         log.error(e, 'signup-failed', {
//           email: params.email,
//           firstName: params.firstName,
//           lastName: params.lastName,
//         });
//         return rejectWithValue(storableError(e));
//       });
//   },

// New version with async/await and try/catch
export const signupWithEmailPassword = createAsyncThunk<
  unknown,
  {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    publicData: Record<string, any>;
    privateData: Record<string, any>;
    protectedData: Record<string, any>;
  },
  Thunk
>(
  'auth/signupWithEmailPassword',
  async (params, thunkAPI) => {
    const { rejectWithValue, extra: sdk, dispatch } = thunkAPI;

    try {
      await sdk.currentUser.create(params);
      // After user is created, automatically log them in
      dispatch(
        login({
          username: params.email,
          password: params.password,
        }),
      );

      return params;
    } catch (e: any) {
      log.error(e, 'signup-failed', {
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
      });
      return rejectWithValue(storableError(e));
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState();
      if (signupInProgress(state)) {
        return false;
      }
    },
  },
);

// const signupWithIdpThunk = createAsyncThunk(
//   'auth/signupWithIdp',
//   (params, thunkAPI) => {
//     const { rejectWithValue, dispatch } = thunkAPI;
//     return createUserWithIdp(params)
//       .then(() => dispatch(fetchCurrentUser({ afterLogin: true })))
//       .then(() => params)
//       .catch(e => {
//         log.error(e, 'create-user-with-idp-failed', { params });
//         return rejectWithValue(storableError(e));
//       });
//   },
//   {
//     condition: (_, { getState }) => {
//       const state = getState();
//       if (authenticationInProgress(state, 'confirmInProgress')) {
//         return false;
//       }
//     },
//   },
// );

// this thunk will not only fetch authInfo but also fetch current user and check if user is banned or deleted
export const fetchAuthenticationState = createAsyncThunk<AuthInfo, void, Thunk>(
  'auth/fetchAuthenticationState',
  async (_, { dispatch, extra: sdk, rejectWithValue }) => {
    try {
      const info = await sdk.authInfo();
      // console.log('info', info);

      if (info && !info.isAnonymous) {
        // Step 2: If user token exists, fetch current user from user slice
        try {
          const userResult = await dispatch(fetchCurrentUser({}));
          // console.log('userResult', JSON.stringify(userResult));

          if (fetchCurrentUser.fulfilled.match(userResult)) {
            const user = userResult.payload;
            // console.log('user?.attributes', JSON.stringify(user?.attributes));
            // Step 3: Check if user is banned or deleted
            if (user?.attributes) {
              const attributes = user.attributes as any;
              if (attributes.banned === true || attributes.deleted === true) {
                // User is banned or deleted - they should not be authenticated
                await sdk.logout();
                return rejectWithValue({
                  message: 'User is banned or deleted',
                  userStatus: attributes.banned ? 'banned' : 'deleted',
                });
              }
            }
          } else if (fetchCurrentUser.rejected.match(userResult)) {
            // Handle user fetch errors (4xx vs 5xx)
            const error = userResult.payload as any;
            const status = error?.status;

            if (status >= 400 && status < 500) {
              // 4xx errors - token invalid/expired, show AuthNavigator
              await sdk.logout();
              return rejectWithValue({
                message: 'Token invalid or expired',
                errorType: 'client_error',
                status,
              });
            }
            // 5xx errors - server issues, assume authenticated and show AppNavigator
            // We'll handle this in the reducer
          }
        } catch (userError) {
          console.log('User fetch error:', userError);
        }
      }

      return info;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch auth info';
      return rejectWithValue({ message });
    }
  },
);

export const login = createAsyncThunk<
  {
    status: number;
    data: {
      access_token: string;
      scope: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
    };
  },
  {
    username: string;
    password: string;
  },
  Thunk
>(
  'auth/loginStatus',
  async (params, { extra: sdk, rejectWithValue, dispatch }) => {
    try {
      const res = await sdk.login(params);
      dispatch(fetchAuthenticationState()); // this will fetch authInfo and current user and check if user is banned or deleted
      return res;
    } catch (error: any) {
      console.log('error', error);
      return rejectWithValue(storableError(error));
    }
  },
);

export const logout = createAsyncThunk<boolean, void, Thunk>(
  'auth/logout',
  async (_, { extra: sdk, rejectWithValue, dispatch }) => {
    try {
      await sdk.logout();
      dispatch(clearCurrentUser());
      log.clearUserId();
      return true;
    } catch (error: any) {
      // console.log('error', error);
      return rejectWithValue(storableError(error));
    }
  },
);

// ================ Slice ================ //

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetNavigationState: () => {},
  },
  extraReducers: builder => {
    // Auth Info Main Flow
    builder
      .addCase(fetchAuthenticationState.pending, state => {
        state.authInfoInProgress = true;
        state.authInfoError = null;
      })
      .addCase(fetchAuthenticationState.fulfilled, (state, action) => {
        const payload = action.payload;
        state.authInfoInProgress = false;
        state.authInfoLoaded = true;
        state.authInfoError = null;

        // Determine authentication and navigation
        const isAuth = authenticated(payload);
        state.isAuthenticated = isAuth;
        state.isLoggedInAs = loggedInAs(payload);
        state.authScopes = payload?.scopes || [];
      })
      .addCase(fetchAuthenticationState.rejected, (state, action) => {
        state.authInfoInProgress = false;
        state.authInfoError = action.payload;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logout.pending, state => {
        state.logoutInProgress = true;
        state.loginError = null;
        state.logoutError = null;
      })
      .addCase(logout.fulfilled, state => {
        state.logoutInProgress = false;
        state.isAuthenticated = false;
        state.isLoggedInAs = false;
        state.authScopes = [];
      })
      .addCase(logout.rejected, (state, action) => {
        state.logoutInProgress = false;
        state.logoutError = action.payload;
      });

    // // Login
    builder
      .addCase(login.pending, state => {
        state.loginInProgress = true;
        state.loginError = null;
        state.logoutError = null;
      })
      .addCase(login.fulfilled, state => {
        state.loginInProgress = false;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginInProgress = false;
        state.loginError = action.payload;
      });
    // // Signup
    builder
      .addCase(signupWithEmailPassword.pending, state => {
        state.createUserInProgress = true;
        state.createUserError = null;
      })
      .addCase(signupWithEmailPassword.fulfilled, state => {
        state.createUserInProgress = false;
        // state.isAuthenticated = true; // commented because we still need to login the user after creating the user
      })
      .addCase(signupWithEmailPassword.rejected, (state, action) => {
        state.createUserInProgress = false;
        state.createUserError = action.payload;
      });
    // // Signup with IDP (Confirm)
    // builder
    //   .addCase(signupWithIdpThunk.pending, state => {
    //     state.confirmInProgress = true;
    //     state.loginError = null;
    //     state.confirmError = null;
    //   })
    //   .addCase(signupWithIdpThunk.fulfilled, state => {
    //     state.confirmInProgress = false;
    //     state.isAuthenticated = true;
    //   })
    //   .addCase(signupWithIdpThunk.rejected, (state, action) => {
    //     state.confirmInProgress = false;
    //     state.confirmError = action.payload;
    //   });
  },
});

export const { resetNavigationState } = authSlice.actions;
export default authSlice.reducer;

// ================ Selectors ================ //

const authState = (state: RootState) => state.auth;

export const isAuthenticatedSelector = createSelector(
  [authState],
  state => state.isAuthenticated,
);

export const selectAuthState = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectAuthInfoInProgress = (state: RootState) =>
  state.auth.authInfoInProgress;
export const selectAuthInfoError = (state: RootState) =>
  state.auth.authInfoError;
export const signupInProgress = (state: RootState) =>
  state.auth.createUserInProgress || state.auth.loginInProgress;
export const loginInProgress = (state: RootState) => state.auth.loginInProgress;
export const loginOutInProgress = (state: RootState) =>
  state.auth.logoutInProgress;
export const selectLoginError = (state: RootState) => state.auth.loginError;
export const selectCreateUserError = (state: RootState) =>
  state.auth.createUserError;