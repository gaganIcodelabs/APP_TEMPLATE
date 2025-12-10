/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Error logging
 *
 * Can be used to log errors to console or and eternal
 * error logging system, like Sentry for example.
 *
 */

import React from 'react';
import appSettings from '../config/settings';
import { ENV } from '../constants/env';
import * as Sentry from '@sentry/react-native';

const ingoreErrorsMap = {
  ['ResizeObserver loop limit exceeded']: true, // Some exotic browsers seems to emit these.
  ['Error reading']: true, // Ignore file reader errors (ImageFromFile)
  ['AxiosError: Network Error']: true,
};

const pickSelectedErrors = (ignored: string[], entry: [string, boolean]) => {
  const [key, value] = entry;
  return value === true ? [...ignored, key] : ignored;
};

/**
 * Set up error handling. If a Sentry DSN is
 * provided a Sentry client will be installed.
 */
export const setup = () => {
  // Only initialize Sentry if DSN is provided in environment
  if (ENV.SENTRY_DSN) {
    Sentry.init({
      dsn: ENV.SENTRY_DSN,

      // Adds more context data to events (IP address, cookies, user, etc.)
      sendDefaultPii: true,

      // Enable Logs
      enableLogs: true,

      // Configure Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1,
      integrations: [
        Sentry.mobileReplayIntegration(),
        Sentry.feedbackIntegration(),
      ],

      // Environment and ignored errors
      environment: appSettings.env || ENV.APP_ENV || 'development',
      ignoreErrors: Object.entries(ingoreErrorsMap).reduce(
        pickSelectedErrors,
        [],
      ),

      // uncomment the line below to enable Spotlight (https://spotlightjs.com)
      // spotlight: __DEV__,
    });
  }
};

/**
 * Set user ID for the logger so that it
 * can be attached to Sentry issues.
 *
 * @param {String} userId ID of current user
 */
export const setUserId = (userId: string) => {
  if (ENV.SENTRY_DSN) {
    Sentry.setUser({ id: userId });
  }
};

/**
 * Clears the user ID.
 */
export const clearUserId = () => {
  if (ENV.SENTRY_DSN) {
    Sentry.setUser(null);
  }
};

const printAPIErrorsAsConsoleTable = (apiErrors: any[]) => {
  if (
    apiErrors != null &&
    apiErrors.length > 0 &&
    typeof console.table === 'function'
  ) {
    console.log('Errors returned by Marketplace API call:');
    console.table(
      apiErrors.map((err: any) => ({
        status: err.status,
        code: err.code,
        ...err.meta,
      })),
    );
  }
};

const responseAPIErrors = (error: any) => {
  return error && error.data && error.data.errors ? error.data.errors : [];
};

const responseApiErrorInfo = (err: any) =>
  responseAPIErrors(err).map((e: any) => ({
    status: e.status,
    code: e.code,
    meta: e.meta,
  }));

/**
 * Logs an exception. If Sentry is configured
 * sends the error information there. Otherwise
 * prints the error to the console.
 *
 * @param {Error} e Error that occurred
 * @param {String} code Error code
 * @param {Object} data Additional data to be sent to Sentry
 */
export const error = (e: any, code: string, data: Record<string, any>) => {
  const apiErrors = responseApiErrorInfo(e);

  if (ENV.SENTRY_DSN) {
    const extra = { ...data, apiErrorData: apiErrors };

    Sentry.withScope(scope => {
      scope.setTag('code', code);
      Object.keys(extra).forEach(key => {
        scope.setExtra(key, (extra as any)[key]);
      });
      Sentry.captureException(e);
    });
  } else {
    console.error(e);
    console.error('Error code:', code, 'data:', data);
  }

  printAPIErrorsAsConsoleTable(apiErrors);
};

/**
 * Capture an exception directly to Sentry
 */
export const captureException = (exception: Error) => {
  if (ENV.SENTRY_DSN) {
    Sentry.captureException(exception);
  } else {
    console.error('Exception captured:', exception);
  }
};

/**
 * Wrap a React component with Sentry error boundary
 */
export const wrapComponent = (component: React.ComponentType<any>) => {
  // Only wrap with Sentry if DSN is provided, otherwise return component as-is
  if (ENV.SENTRY_DSN) {
    return Sentry.wrap(component);
  }
  return component;
};
