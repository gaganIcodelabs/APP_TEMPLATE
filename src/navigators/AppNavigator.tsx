import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREENS } from '@constants/screens';
import { AppStackParamList } from '@appTypes/index';
import navigationConfig from './navigationConfig';
import Home from '@screens/Home/Home';
import { EditListingNavigator } from '@features/editListing/EditListingNavigator';
import { useTypedSelector } from '@redux/store';
import { canCurrentUserPostListingsSelector } from '@redux/slices/user.slice';

const { Screen, Navigator } = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  const canPostListings = useTypedSelector(canCurrentUserPostListingsSelector);
  return (
    <Navigator
      screenOptions={navigationConfig}
      initialRouteName={SCREENS.HOME}
    >
      <Screen name={SCREENS.HOME} component={Home} />
      {canPostListings ? (
        <Screen
          name={SCREENS.EDIT_LISTING_WIZARD}
          component={EditListingNavigator}
        />
      ) : null}
    </Navigator>
  );
};

export default AppNavigator;
