/**
 * Google Authentication Feature Module
 * 
 * This module provides a separate Redux slice for Google-specific
 * authentication functionality including OAuth sign-in, token exchange,
 * and error handling.
 * 
 * The Google auth state is stored separately from base auth at state.googleAuth
 * 
 * @module features/auth/google
 */

// Export the Google auth slice and reducer
export { default as googleAuthReducer } from './googleAuth.slice';
export { default } from './googleAuth.slice';
export type { GoogleAuthState } from './googleAuth.slice';

// Export async thunks
export {
  signInWithGoogle,
  exchangeGoogleToken,
} from './googleAuth.slice';

// Export actions
export {
  clearGoogleSignInError,
  resetGoogleSignInState,
} from './googleAuth.slice';

// Export selectors
export {
  selectGoogleAuthState,
  selectGoogleSignInProgress,
  selectGoogleSignInError,
  selectHasGoogleSignInError,
  selectGoogleErrorMessage,
} from './googleAuth.slice';

// Export types
export type {
  GoogleAuthError,
  GoogleSignInParams,
  GoogleSignInResponse,
} from './types';

export { GoogleAuthErrorCode } from './types';

// Export custom hook
export { useGoogleAuth } from './useGoogleAuth';
export type { UseGoogleAuthReturn } from './useGoogleAuth';
