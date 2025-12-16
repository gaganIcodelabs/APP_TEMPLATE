import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

// Native Stack has different options than Stack Navigator
// It uses native navigation primitives for better performance
const navigationConfig: NativeStackNavigationOptions = {
  headerShown: false,
  gestureEnabled: true,
  // animation: 'fade', // 'default' | 'fade' | 'slide_from_right' | 'slide_from_left' | 'slide_from_bottom' | 'none'
  // presentation: 'card', // 'card' | 'modal' | 'transparentModal' | 'containedModal' | 'containedTransparentModal' | 'fullScreenModal' | 'formSheet'
  // statusBarAnimation: 'slide',
  // Note: Native Stack doesn't support custom interpolators like Stack Navigator
  // It uses native transitions which are more performant
};

export default navigationConfig;
