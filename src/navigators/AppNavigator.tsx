import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREENS } from '@constants/screens';
import { AppStackParamList } from '@appTypes/index';
import navigationConfig from './navigationConfig';
import Home from '@screens/Home/Home';
import { EditListingNavigator } from '@features/editListing/EditListingNavigator';

const { Screen, Navigator } = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <Navigator
      screenOptions={navigationConfig}
      initialRouteName={SCREENS.EDIT_LISTING_WIZARD}
    >
      <Screen name={SCREENS.HOME} component={Home} />
      <Screen
        name={SCREENS.EDIT_LISTING_WIZARD}
        component={EditListingNavigator}
      />
    </Navigator>
  );
};

export default AppNavigator;
