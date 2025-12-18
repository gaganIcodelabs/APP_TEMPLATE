import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREENS } from '@constants/screens';
import { Login, Signup } from '@screens/index';
import { AuthStackParamList } from '@appTypes/index';
import navigationConfig from './navigationConfig';

const { Screen, Navigator } = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Navigator
      initialRouteName={SCREENS.SIGNUP}
      screenOptions={navigationConfig}
    >
      <Screen name={SCREENS.LOGIN} component={Login} />
      <Screen name={SCREENS.SIGNUP} component={Signup} />
    </Navigator>
  );
};

export default AuthNavigator;
