/**
 * Google Authentication Error Types
 */

export enum GoogleAuthErrorCode {
  /** User cancelled the sign-in flow */
  CANCELLED = 'GOOGLE_SIGN_IN_CANCELLED',
  /** Network error during sign-in */
  NETWORK_ERROR = 'GOOGLE_SIGN_IN_NETWORK_ERROR',
  /** Google Play Services not available (Android) */
  PLAY_SERVICES_NOT_AVAILABLE = 'GOOGLE_PLAY_SERVICES_NOT_AVAILABLE',
  /** Sign-in configuration error */
  CONFIGURATION_ERROR = 'GOOGLE_SIGN_IN_CONFIGURATION_ERROR',
  /** Token exchange failed */
  TOKEN_EXCHANGE_FAILED = 'GOOGLE_TOKEN_EXCHANGE_FAILED',
  /** Unknown error occurred */
  UNKNOWN_ERROR = 'GOOGLE_SIGN_IN_UNKNOWN_ERROR',
}

/**
 * Google Authentication Error Interface
 */
export interface GoogleAuthError {
  /** Error code identifying the type of error */
  code: GoogleAuthErrorCode;
  /** Human-readable error message */
  message: string;
  /** Optional additional error details */
  details?: any;
  /** Timestamp when the error occurred */
  timestamp: number;
}

/**
 * Google Sign-In Request Parameters
 */
export interface GoogleSignInParams {
  /** Optional: Specific scopes to request */
  scopes?: string[];
  /** Optional: Hosted domain for G Suite accounts */
  hostedDomain?: string;
}

/**
 * Google Sign-In Response
 */
export interface GoogleSignInResponse {
  /** ID token from Google */
  idToken: string;
  /** Server auth code for backend token exchange */
  serverAuthCode?: string;
  /** User's email */
  email?: string;
  /** User's display name */
  displayName?: string;
  /** User's profile photo URL */
  photoUrl?: string;
  /** User's Google ID */
  userId?: string;
}

