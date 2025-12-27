# Google Authentication Slice

This module provides a **separate Redux slice** for Google-specific authentication functionality. The Google auth state is stored independently at `state.googleAuth`, keeping it cleanly separated from the base authentication state at `state.auth`.

## Overview

The Google auth slice manages two key state fields:
- `googleSignInProgress`: Tracks loading state during Google sign-in operations
- `googleSignInError`: Stores Google-specific authentication errors with detailed error codes

## Architecture

This implementation uses **Approach 2: Separate Slice with Different Name**

```
State Structure:
├── state.auth           (Base authentication - from redux/slices/auth.slice.ts)
│   ├── isAuthenticated
│   ├── loginInProgress
│   ├── loginError
│   └── ... (other base auth fields)
│
└── state.googleAuth     (Google authentication - this module)
    ├── googleSignInProgress
    └── googleSignInError
```

**Benefits:**
- ✅ Clean separation of concerns
- ✅ No duplication of base auth state
- ✅ Independent state management
- ✅ Easy to maintain and extend
- ✅ Can be removed without affecting base auth

## Directory Structure

```
features/auth/google/
├── googleAuth.slice.ts  # Google auth slice implementation
├── types.ts             # TypeScript type definitions
├── index.ts             # Public API exports
└── README.md           # This file
```

## Installation & Setup

### 1. Install Google Sign-In Dependencies

For React Native:

```bash
npm install @react-native-google-signin/google-signin
# or
yarn add @react-native-google-signin/google-signin
```

### 2. Configure Google Sign-In

Add configuration in your app initialization:

```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  offlineAccess: true,
  hostedDomain: '', // Optional
  forceCodeForRefreshToken: true,
});
```

### 3. The googleAuth Slice is Already Integrated

The `googleAuth` reducer is already added to your root reducer via `redux/slices/index.ts`:

```typescript
// redux/slices/index.ts
export { default as googleAuth } from '../../features/auth/google';
```

This means `state.googleAuth` is automatically available in your Redux store!

## Usage

### Importing

```typescript
import {
  // Async Thunks
  signInWithGoogle,
  exchangeGoogleToken,
  signOutFromGoogle,
  
  // Actions
  clearGoogleSignInError,
  resetGoogleSignInState,
  
  // Selectors
  selectGoogleSignInProgress,
  selectGoogleSignInError,
  selectHasGoogleSignInError,
  selectGoogleErrorMessage,
  
  // Types
  GoogleAuthError,
  GoogleAuthErrorCode,
  GoogleSignInParams,
} from '@/features/auth/google';
```

### Async Thunks

#### `signInWithGoogle`

Initiates the Google Sign-In flow.

```typescript
import { useAppDispatch } from '@/redux/store';
import { signInWithGoogle } from '@/features/auth/google';

function SignInButton() {
  const dispatch = useAppDispatch();

  const handleGoogleSignIn = async () => {
    try {
      const result = await dispatch(signInWithGoogle()).unwrap();
      console.log('Sign-in successful:', result);
      // Handle successful sign-in
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  };

  return <Button onPress={handleGoogleSignIn} title="Sign in with Google" />;
}
```

With optional parameters:

```typescript
dispatch(signInWithGoogle({
  scopes: ['profile', 'email'],
  hostedDomain: 'example.com', // For G Suite accounts
}));
```

#### `exchangeGoogleToken`

Exchanges Google ID token with your backend for application authentication.

```typescript
const handleTokenExchange = async (idToken: string, serverAuthCode?: string) => {
  try {
    await dispatch(exchangeGoogleToken({ idToken, serverAuthCode })).unwrap();
    // Token exchange successful
  } catch (error) {
    // Handle error
  }
};
```

#### `signOutFromGoogle`

Signs out the user from Google.

```typescript
const handleSignOut = async () => {
  try {
    await dispatch(signOutFromGoogle()).unwrap();
    // Sign-out successful
  } catch (error) {
    // Handle error
  }
};
```

### Actions

#### `clearGoogleSignInError`

Manually clear Google sign-in errors.

```typescript
dispatch(clearGoogleSignInError());
```

#### `resetGoogleSignInState`

Reset all Google sign-in state (progress and error).

```typescript
dispatch(resetGoogleSignInState());
```

### Selectors

Use selectors to access Google auth state in your components:

```typescript
import { useTypedSelector } from '@/redux/store';
import {
  selectGoogleSignInProgress,
  selectGoogleSignInError,
  selectGoogleErrorMessage,
} from '@/features/auth/google';

function GoogleAuthStatus() {
  const isSigningIn = useTypedSelector(selectGoogleSignInProgress);
  const error = useTypedSelector(selectGoogleSignInError);
  const errorMessage = useTypedSelector(selectGoogleErrorMessage);

  if (isSigningIn) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <ErrorMessage>{errorMessage}</ErrorMessage>;
  }

  return null;
}
```

## Type Definitions

### `GoogleAuthState`

```typescript
interface GoogleAuthState {
  googleSignInProgress: boolean;
  googleSignInError: GoogleAuthError | null;
}
```

**Note:** This is stored at `state.googleAuth`, separate from `state.auth`

### `GoogleAuthError`

```typescript
interface GoogleAuthError {
  code: GoogleAuthErrorCode;
  message: string;
  details?: any;
  timestamp: number;
}
```

### `GoogleAuthErrorCode`

```typescript
enum GoogleAuthErrorCode {
  CANCELLED = 'GOOGLE_SIGN_IN_CANCELLED',
  NETWORK_ERROR = 'GOOGLE_SIGN_IN_NETWORK_ERROR',
  PLAY_SERVICES_NOT_AVAILABLE = 'GOOGLE_PLAY_SERVICES_NOT_AVAILABLE',
  CONFIGURATION_ERROR = 'GOOGLE_SIGN_IN_CONFIGURATION_ERROR',
  TOKEN_EXCHANGE_FAILED = 'GOOGLE_TOKEN_EXCHANGE_FAILED',
  UNKNOWN_ERROR = 'GOOGLE_SIGN_IN_UNKNOWN_ERROR',
}
```

## Complete Implementation Example

### Custom Hook for Google Authentication

```typescript
import { useAppDispatch, useTypedSelector } from '@/redux/store';
import {
  signInWithGoogle,
  signOutFromGoogle,
  clearGoogleSignInError,
  selectGoogleSignInProgress,
  selectGoogleSignInError,
  selectGoogleErrorMessage,
  selectHasGoogleSignInError,
} from '@/features/auth/google';

export function useGoogleAuth() {
  const dispatch = useAppDispatch();
  const isLoading = useTypedSelector(selectGoogleSignInProgress);
  const error = useTypedSelector(selectGoogleSignInError);
  const errorMessage = useTypedSelector(selectGoogleErrorMessage);
  const hasError = useTypedSelector(selectHasGoogleSignInError);

  const signIn = async (params?: { scopes?: string[] }) => {
    dispatch(clearGoogleSignInError());
    return dispatch(signInWithGoogle(params)).unwrap();
  };

  const signOut = async () => {
    return dispatch(signOutFromGoogle()).unwrap();
  };

  const clearError = () => {
    dispatch(clearGoogleSignInError());
  };

  return {
    signIn,
    signOut,
    clearError,
    isLoading,
    error,
    errorMessage,
    hasError,
  };
}
```

### Using the Hook in a Component

```typescript
import React from 'react';
import { Button, View, Text, ActivityIndicator } from 'react-native';
import { useGoogleAuth } from './useGoogleAuth';

export function SignInScreen() {
  const { signIn, isLoading, errorMessage, hasError, clearError } = useGoogleAuth();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn({ scopes: ['profile', 'email'] });
      console.log('Signed in as:', result.email);
      // Handle successful sign-in
      // You can now integrate with your base auth flow
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  };

  return (
    <View>
      <Text>Welcome!</Text>
      
      {isLoading && <ActivityIndicator size="large" />}
      
      {hasError && (
        <View>
          <Text style={{ color: 'red' }}>{errorMessage}</Text>
          <Button title="Dismiss" onPress={clearError} />
        </View>
      )}
      
      <Button
        title="Sign in with Google"
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      />
    </View>
  );
}
```

## Integration with Base Auth

Since the Google auth slice is separate from the base auth slice, you have full control over how to integrate them. Here's a typical flow:

```typescript
import { useAppDispatch } from '@/redux/store';
import { signInWithGoogle, exchangeGoogleToken } from '@/features/auth/google';
import { fetchAuthenticationState } from '@/redux/slices/auth.slice';

function CompleteGoogleAuthFlow() {
  const dispatch = useAppDispatch();

  const handleGoogleSignIn = async () => {
    try {
      // Step 1: Sign in with Google
      const googleResult = await dispatch(signInWithGoogle()).unwrap();
      
      // Step 2: Exchange token with your backend
      await dispatch(exchangeGoogleToken({
        idToken: googleResult.idToken!,
        serverAuthCode: googleResult.serverAuthCode,
      })).unwrap();
      
      // Step 3: Update base auth state
      await dispatch(fetchAuthenticationState());
      
      // Now state.auth.isAuthenticated should be true
      // Navigate to authenticated screens
      
    } catch (error) {
      console.error('Google auth flow failed:', error);
    }
  };

  return (
    <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
  );
}
```

## Implementation Checklist

Before using this slice in production, implement the actual Google Sign-In logic:

### 1. Implement `signInWithGoogle` thunk

In `googleAuth.slice.ts`, replace the TODO with:

```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// In signInWithGoogle thunk (line ~81):
const result = await GoogleSignin.signIn();
return {
  idToken: result.idToken,
  serverAuthCode: result.serverAuthCode,
  email: result.user.email,
  displayName: result.user.name,
  photoUrl: result.user.photo,
  userId: result.user.id,
};
```

### 2. Implement `exchangeGoogleToken` thunk

Add your backend API call (line ~135):

```typescript
// Call your backend to verify Google token
const response = await sdk.currentUser.create({
  // Your API expects something like:
  idToken,
  authProvider: 'google',
  // ... other fields
});
return { success: true };
```

### 3. Implement `signOutFromGoogle` thunk

Add sign-out logic (line ~170):

```typescript
await GoogleSignin.signOut();
// Optionally revoke access:
// await GoogleSignin.revokeAccess();
```

## State Access Patterns

### Accessing Google Auth State

```typescript
// Access Google auth state
const googleAuth = useTypedSelector(state => state.googleAuth);

// Access base auth state
const baseAuth = useTypedSelector(state => state.auth);

// Use both together
const isFullyAuthenticated = useTypedSelector(state => 
  state.auth.isAuthenticated && !state.googleAuth.googleSignInProgress
);
```

### Type Safety

The `RootState` type automatically includes `googleAuth`:

```typescript
import { RootState } from '@/redux/store';

// RootState now includes:
// {
//   auth: AuthState,
//   googleAuth: GoogleAuthState,
//   user: UserState,
//   // ... other slices
// }
```

## Error Handling

The slice provides comprehensive error handling with user-friendly messages:

```typescript
// In your component:
const errorMessage = useTypedSelector(selectGoogleErrorMessage);

// Error messages are automatically mapped:
// - CANCELLED → "Sign-in was cancelled"
// - NETWORK_ERROR → "Network error. Please check your connection and try again"
// - PLAY_SERVICES_NOT_AVAILABLE → "Google Play Services not available"
// - CONFIGURATION_ERROR → "Sign-in configuration error. Please contact support"
// - TOKEN_EXCHANGE_FAILED → "Failed to complete sign-in. Please try again"
// - UNKNOWN_ERROR → Custom message or "An unknown error occurred"
```

## Persistence

If you want to persist Google auth state across app restarts, add it to the persist whitelist:

```typescript
// redux/store.ts
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 0,
  whitelist: ['hostedAssets', 'user', 'googleAuth'], // Add googleAuth
};
```

**Note:** Be cautious about persisting authentication tokens. Consider security implications.

## Best Practices

1. ✅ **Always check loading state** before showing UI elements
2. ✅ **Clear errors** before initiating new sign-in attempts
3. ✅ **Handle all error codes** with appropriate user messages
4. ✅ **Test on both iOS and Android** as behavior may differ
5. ✅ **Implement proper token refresh** logic in your backend
6. ✅ **Don't persist sensitive tokens** in Redux state
7. ✅ **Use selectors** instead of direct state access
8. ✅ **Handle edge cases** like cancelled sign-in gracefully

## Troubleshooting

### TypeError: Cannot read property 'googleSignInProgress' of undefined

**Cause:** The `googleAuth` slice isn't properly added to the root reducer.

**Solution:** Verify that `redux/slices/index.ts` exports `googleAuth`:

```typescript
export { default as googleAuth } from '../../features/auth/google';
```

### Google Sign-In not working on Android

**Cause:** Google Play Services configuration issue.

**Solution:** 
1. Ensure you've configured the SHA-1 certificate in Google Cloud Console
2. Add the correct `webClientId` in your configuration
3. Test on a physical device, not an emulator without Google Play Services

### Token exchange fails with 401 error

**Cause:** Backend can't verify the Google token.

**Solution:**
1. Verify your backend is using the correct Google OAuth client ID
2. Check that the token hasn't expired
3. Ensure `serverAuthCode` is being sent if required

## License

Part of the APP_TEMPLATE project.
