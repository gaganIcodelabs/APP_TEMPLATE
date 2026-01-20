import { Alert, AlertButton } from 'react-native';

/**
 * Alert helper functions for consistent alert dialogs
 */

/**
 * Show a confirmation dialog with Yes/No options
 */
export const showConfirmAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
): void => {
  Alert.alert(title, message, [
    {
      text: 'Cancel',
      style: 'cancel',
      onPress: onCancel,
    },
    {
      text: 'Confirm',
      onPress: onConfirm,
    },
  ]);
};

/**
 * Show a destructive confirmation dialog (e.g., for delete actions)
 */
export const showDeleteConfirmAlert = (
  title: string,
  message: string,
  onDelete: () => void,
  onCancel?: () => void
): void => {
  Alert.alert(title, message, [
    {
      text: 'Cancel',
      style: 'cancel',
      onPress: onCancel,
    },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: onDelete,
    },
  ]);
};

/**
 * Show a simple error alert
 */
export const showErrorAlert = (title: string, message: string): void => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

/**
 * Show a simple info alert
 */
export const showInfoAlert = (title: string, message: string): void => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

/**
 * Show a custom alert with custom buttons
 */
export const showCustomAlert = (
  title: string,
  message: string,
  buttons: AlertButton[]
): void => {
  Alert.alert(title, message, buttons);
};
