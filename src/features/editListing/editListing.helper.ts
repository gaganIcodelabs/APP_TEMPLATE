import { RouteProp, useRoute } from '@react-navigation/native';
import { EDIT_LISTING_SCREENS } from './screens.constant';
import { EditListingWizardParamList } from './types/navigation.types';

export const useEditListingWizardRoute = () => {
  return useRoute<
    RouteProp<
      EditListingWizardParamList,
      typeof EDIT_LISTING_SCREENS.EDIT_LISTING_PAGE
    >
  >();
};
