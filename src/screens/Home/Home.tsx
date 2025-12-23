import { View, Text } from 'react-native';
import React from 'react';
import { Button } from '@components/index';
import { loginOutInProgress, logout } from '@redux/slices/auth.slice';
import { useAppDispatch, useTypedSelector } from '@redux/store';

const Home = () => {
  const dispatch = useAppDispatch();
  const logoutInProcess = useTypedSelector(loginOutInProgress);
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
    </View>
  );
};

export default Home;
