import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useAppDispatch, useTypedSelector } from '@redux/store';
import {
  login,
  loginInProgress,
  selectLoginError,
} from '@redux/slices/auth.slice';
import { Button, CommonText } from '@components/index';
import { useTranslation } from 'react-i18next';
import { colors } from '@constants/colors';
import { SCREENS } from '@constants/screens';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '@appTypes/index';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginEmailInputField } from './components/LoginEmailInputField';
import { LoginPasswordInputField } from './components/LoginPasswordInputField';
import { LoginFormValues } from './Login.types';
import { getLoginSchema } from './helper';

type LoginNavigationProp = NavigationProp<AuthStackParamList, 'Login'>;

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<LoginNavigationProp>();
  const loginInProcess = useTypedSelector(loginInProgress);
  const loginError = useTypedSelector(state => !!selectLoginError(state));
  const { t } = useTranslation();

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await dispatch(
        login({
          username: values.email,
          password: values.password,
        }),
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  const { control, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(getLoginSchema(t)),
    mode: 'onChange',
  });

  const handleSignupPress = () => navigation.navigate(SCREENS.SIGNUP);

  return (
    <View style={styles.container}>
      <CommonText style={styles.title}>Login</CommonText>

      <LoginEmailInputField control={control} />
      <LoginPasswordInputField control={control} />

      {loginError && (
        <CommonText style={styles.errorText}>
          {t('Authentication.loginFailed')}
        </CommonText>
      )}

      <Button
        title="Login"
        onPress={handleSubmit(onSubmit)}
        loader={loginInProcess}
        disabled={loginInProcess}
      />

      <View style={styles.loginContainer}>
        <CommonText style={styles.loginText}>
          {t('Authentication.dontHaveAnAccount')}{' '}
        </CommonText>
        <TouchableOpacity onPress={handleSignupPress}>
          <CommonText style={styles.loginLink}>
            {t('Authentication.signup')}
          </CommonText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: colors.grey,
    fontSize: 14,
    // ...primaryFont('400'),
  },
  loginLink: {
    color: colors.marketplaceColor,
    fontSize: 14,
    textDecorationLine: 'underline',
    // ...primaryFont('600'),
  },
  errorText: {
    color: colors.errorRed,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
});
