import { Button } from '@components/index';
import { SCREENS } from '@constants/screens';
import { useConfiguration } from '@context/configurationContext';
import { useNavigation } from '@react-navigation/native';
import { loginOutInProgress, logout } from '@redux/slices/auth.slice';
import { showCreateListingLinkForCurrentUserSelector } from '@redux/slices/user.slice';
import { useAppDispatch, useTypedSelector } from '@redux/store';
import { Text, View } from 'react-native';

const Home = () => {
  const dispatch = useAppDispatch();
  const logoutInProcess = useTypedSelector(loginOutInProgress);
  const config = useConfiguration();
  const showCreateListingLink = useTypedSelector(state =>
    showCreateListingLinkForCurrentUserSelector(state, config),
  );
  const navigation = useNavigation();
  const handleLogout = async () => {
    try {
      await dispatch(logout());
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Home</Text>

      <Button
        title="Log out"
        onPress={handleLogout}
        loader={logoutInProcess}
        disabled={logoutInProcess}
        style={{
          width: 200,
        }}
      />
      {showCreateListingLink ? (
        <Button
          title="Post a listing"
          onPress={() =>
            navigation.navigate(SCREENS.EDIT_LISTING_WIZARD as never)
          }
        />
      ) : null}
    </View>
  );
};

export default Home;
