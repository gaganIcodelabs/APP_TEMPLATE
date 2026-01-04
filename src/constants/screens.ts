import { EDIT_LISTING_WIZARD } from '@features/editListing';

const SCREENS = {
  // Auth screens
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  FORGET_PASSWORD: 'ForgetPassword',
  RESET_PASSWORD: 'ResetPassword',

  HOME: 'Home',

  ...EDIT_LISTING_WIZARD,
} as const;

export { SCREENS };
