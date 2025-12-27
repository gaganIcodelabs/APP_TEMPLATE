import { Thunk } from '@appTypes/index';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../redux/store';
import * as log from '../../../util/log';
import {
  GoogleAuthError,
  GoogleAuthErrorCode,
  GoogleSignInParams,
  GoogleSignInResponse,
} from './types';

// ================ Initial State ================ //

/**
 * Google authentication state
 * This is a separate slice that manages only Google-specific auth state
 */
export interface GoogleAuthState {
  /** Track the loading state during Google sign-in */
  googleSignInProgress: boolean;
  /** Store any errors that occur during Google authentication */
  googleSignInError: GoogleAuthError | null;
}

/**
 * Initial state for Google authentication
 */
const initialState: GoogleAuthState = {
  googleSignInProgress: false,
  googleSignInError: null,
};

// ================ Async Thunks ================ //

/**
 * Initiates Google Sign-In flow
 * This thunk handles the Google OAuth flow and returns the sign-in response
 */
export const signInWithGoogle = createAsyncThunk<
  GoogleSignInResponse,
  GoogleSignInParams | void,
  Thunk
>(
  'googleAuth/signInWithGoogle',
  async (params, { rejectWithValue }) => {
    try {
      // TODO: Implement actual Google Sign-In logic here
      // This is where you would integrate with @react-native-google-signin/google-signin
      // or your web Google OAuth implementation

      // Example placeholder implementation:
      // const result = await GoogleSignin.signIn();
      // return {
      //   idToken: result.idToken,
      //   serverAuthCode: result.serverAuthCode,
      //   email: result.user.email,
      //   displayName: result.user.name,
      //   photoUrl: result.user.photo,
      //   userId: result.user.id,
      // };

      throw new Error('Google Sign-In not implemented yet');
    } catch (error: any) {
      log.error(error, 'google-sign-in-failed', { params });

      // Map error to GoogleAuthError
      const googleError: GoogleAuthError = {
        code: mapErrorToCode(error),
        message: error.message || 'Google sign-in failed',
        details: error,
        timestamp: Date.now(),
      };

      return rejectWithValue(googleError);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState();
      // Prevent multiple simultaneous Google sign-in attempts
      if (selectGoogleSignInProgress(state)) {
        return false;
      }
    },
  },
);

/**
 * Exchanges Google ID token for application authentication
 * This thunk sends the Google token to your backend for verification
 */
export const exchangeGoogleToken = createAsyncThunk<
  { success: boolean },
  { idToken: string; serverAuthCode?: string },
  Thunk
>(
  'googleAuth/exchangeGoogleToken',
  async ({ idToken, serverAuthCode }, { extra: sdk, rejectWithValue }) => {
    try {
      // TODO: Implement token exchange with your backend
      // This is where you would call your API to verify the Google token
      // and create/login the user in your system

      // Example placeholder:
      // const response = await sdk.exchangeGoogleToken({ idToken, serverAuthCode });
      // return response;

      throw new Error('Google token exchange not implemented yet');
    } catch (error: any) {
      log.error(error, 'google-token-exchange-failed');

      const googleError: GoogleAuthError = {
        code: GoogleAuthErrorCode.TOKEN_EXCHANGE_FAILED,
        message: error.message || 'Failed to exchange Google token',
        details: error,
        timestamp: Date.now(),
      };

      return rejectWithValue(googleError);
    }
  },
);

// ================ Slice ================ //

/**
 * Google auth slice - manages Google-specific authentication state
 * This is separate from the base auth slice and stored at state.googleAuth
 */
const googleAuthSlice = createSlice({
  name: 'googleAuth',
  initialState,
  reducers: {
    /**
     * Manually clear Google sign-in error
     */
    clearGoogleSignInError: state => {
      state.googleSignInError = null;
    },

    /**
     * Reset Google sign-in state
     */
    resetGoogleSignInState: state => {
      state.googleSignInProgress = false;
      state.googleSignInError = null;
    },
  },
  extraReducers: builder => {
    // Google Sign-In
    builder
      .addCase(signInWithGoogle.pending, state => {
        state.googleSignInProgress = true;
        state.googleSignInError = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state) => {
        state.googleSignInProgress = false;
        state.googleSignInError = null;
        // User will handle authentication state updates separately
      })
      .addCase(
        signInWithGoogle.rejected,
        (state, action: PayloadAction<any>) => {
          state.googleSignInProgress = false;
          state.googleSignInError = action.payload as GoogleAuthError;
        },
      );

    // Google Token Exchange
    builder
      .addCase(exchangeGoogleToken.pending, state => {
        state.googleSignInProgress = true;
        state.googleSignInError = null;
      })
      .addCase(exchangeGoogleToken.fulfilled, state => {
        state.googleSignInProgress = false;
        state.googleSignInError = null;
      })
      .addCase(
        exchangeGoogleToken.rejected,
        (state, action: PayloadAction<any>) => {
          state.googleSignInProgress = false;
          state.googleSignInError = action.payload as GoogleAuthError;
        },
      );
  },
});

// ================ Helper Functions ================ //

/**
 * Maps generic errors to Google-specific error codes
 */
function mapErrorToCode(error: any): GoogleAuthErrorCode {
  // Map common error codes from Google Sign-In library
  const errorCode = error?.code || error?.message || '';

  if (
    errorCode.includes('SIGN_IN_CANCELLED') ||
    errorCode.includes('cancelled')
  ) {
    return GoogleAuthErrorCode.CANCELLED;
  }

  if (errorCode.includes('NETWORK_ERROR') || errorCode.includes('network')) {
    return GoogleAuthErrorCode.NETWORK_ERROR;
  }

  if (
    errorCode.includes('PLAY_SERVICES_NOT_AVAILABLE') ||
    errorCode.includes('play_services')
  ) {
    return GoogleAuthErrorCode.PLAY_SERVICES_NOT_AVAILABLE;
  }

  if (
    errorCode.includes('SIGN_IN_FAILED') ||
    errorCode.includes('configuration')
  ) {
    return GoogleAuthErrorCode.CONFIGURATION_ERROR;
  }

  return GoogleAuthErrorCode.UNKNOWN_ERROR;
}

// ================ Actions ================ //

export const { clearGoogleSignInError, resetGoogleSignInState } =
  googleAuthSlice.actions;

// ================ Selectors ================ //

/**
 * Select the entire Google auth state
 */
export const selectGoogleAuthState = (state: RootState): GoogleAuthState => {
  return state.googleAuth;
};

/**
 * Select Google sign-in progress state
 */
export const selectGoogleSignInProgress = (state: RootState): boolean => {
  return state.googleAuth?.googleSignInProgress || false;
};

/**
 * Select Google sign-in error
 */
export const selectGoogleSignInError = (
  state: RootState,
): GoogleAuthError | null => {
  return state.googleAuth?.googleSignInError || null;
};

/**
 * Check if there is an active Google sign-in error
 */
export const selectHasGoogleSignInError = (state: RootState): boolean => {
  return selectGoogleSignInError(state) !== null;
};

/**
 * Get user-friendly error message from Google error
 */
export const selectGoogleErrorMessage = (state: RootState): string | null => {
  const error = selectGoogleSignInError(state);
  if (!error) return null;

  // Map error codes to user-friendly messages
  switch (error.code) {
    case GoogleAuthErrorCode.CANCELLED:
      return 'Sign-in was cancelled';
    case GoogleAuthErrorCode.NETWORK_ERROR:
      return 'Network error. Please check your connection and try again';
    case GoogleAuthErrorCode.PLAY_SERVICES_NOT_AVAILABLE:
      return 'Google Play Services not available';
    case GoogleAuthErrorCode.CONFIGURATION_ERROR:
      return 'Sign-in configuration error. Please contact support';
    case GoogleAuthErrorCode.TOKEN_EXCHANGE_FAILED:
      return 'Failed to complete sign-in. Please try again';
    default:
      return error.message || 'An unknown error occurred';
  }
};

// ================ Export ================ //

export default googleAuthSlice.reducer;
