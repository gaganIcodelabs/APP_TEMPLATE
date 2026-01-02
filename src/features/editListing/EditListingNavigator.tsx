import { AppStackParamList } from '@appTypes/index';
import { RouteProp, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch } from '@redux/store';
import { useEffect } from 'react';
import { initializeEditListingWizard } from './editListing.slice';
import { EDIT_LISTING_SCREENS } from './screens.constant';
import EditListing from './screens/EditListing';
import { EditListingWizardParamList } from './types/navigation.types';

const Stack = createNativeStackNavigator<EditListingWizardParamList>();

export const EditListingNavigator = () => {
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<AppStackParamList, 'EditListingWizard'>>();

  useEffect(() => {
    dispatch(initializeEditListingWizard(route.key));
  }, [route.key, dispatch]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={EDIT_LISTING_SCREENS.EDIT_LISTING_PAGE}
        component={EditListing}
        initialParams={{
          listingId: route.params?.listingId,
          wizardKey: route.key,
        }}
      />
    </Stack.Navigator>
  );
};
