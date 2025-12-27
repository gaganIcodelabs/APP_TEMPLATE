/**
 * Custom Hook for Google Authentication
 * 
 * Provides a simple interface for Google sign-in functionality
 * with automatic state management and error handling.
 * 
 * @example
 * ```typescript
 * const { signIn, isLoading, errorMessage } = useGoogleAuth();
 * 
 * const handleSignIn = async () => {
 *   try {
 *     const result = await signIn();
 *     console.log('Signed in:', result.email);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * };
 * ```
 */

import { useAppDispatch, useTypedSelector } from '../../../redux/store';
import {
  signInWithGoogle,
  exchangeGoogleToken,
  clearGoogleSignInError,
  resetGoogleSignInState,
  selectGoogleSignInProgress,
  selectGoogleSignInError,
  selectGoogleErrorMessage,
  selectHasGoogleSignInError,
  GoogleSignInParams,
  GoogleSignInResponse,
} from './index';

export interface UseGoogleAuthReturn {
  /** Initiate Google sign-in flow */
  signIn: (params?: GoogleSignInParams) => Promise<GoogleSignInResponse>;
  /** Exchange Google token with backend */
  exchangeToken: (idToken: string, serverAuthCode?: string) => Promise<{ success: boolean }>;
  /** Clear current error */
  clearError: () => void;
  /** Reset all Google auth state */
  resetState: () => void;
  /** Loading state indicator */
  isLoading: boolean;
  /** Current error object */
  error: any;
  /** User-friendly error message */
  errorMessage: string | null;
  /** Boolean indicating if there's an error */
  hasError: boolean;
}

/**
 * Hook for managing Google authentication
 */
export function useGoogleAuth(): UseGoogleAuthReturn {
  const dispatch = useAppDispatch();
  
  // Select state from Redux
  const isLoading = useTypedSelector(selectGoogleSignInProgress);
  const error = useTypedSelector(selectGoogleSignInError);
  const errorMessage = useTypedSelector(selectGoogleErrorMessage);
  const hasError = useTypedSelector(selectHasGoogleSignInError);

  /**
   * Initiate Google sign-in
   */
  const signIn = async (params?: GoogleSignInParams): Promise<GoogleSignInResponse> => {
    dispatch(clearGoogleSignInError());
    return dispatch(signInWithGoogle(params)).unwrap();
  };

  /**
   * Exchange Google token with backend
   */
  const exchangeToken = async (
    idToken: string,
    serverAuthCode?: string
  ): Promise<{ success: boolean }> => {
    return dispatch(exchangeGoogleToken({ idToken, serverAuthCode })).unwrap();
  };

  /**
   * Clear the current error
   */
  const clearError = (): void => {
    dispatch(clearGoogleSignInError());
  };

  /**
   * Reset all Google auth state
   */
  const resetState = (): void => {
    dispatch(resetGoogleSignInState());
  };

  return {
    signIn,
    exchangeToken,
    clearError,
    resetState,
    isLoading,
    error,
    errorMessage,
    hasError,
  };
}

