/* eslint-disable react-native/no-inline-styles */
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useConfiguration } from '@context/configurationContext';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { UserTypeConfigItem } from '../../types/config/configUser';
import { AuthStackParamList } from '../../types/navigation/paramList';
import CustomUserFields from './components/CustomUserFields';
import { SignupDisplayNameInputField } from './components/SignupDisplayNameInputField';
import { SignupEmailInputField } from './components/SignupEmailInputField';
import { SignupFirstNameInputField } from './components/SignupFirstNameInputField';
import { SignupLastNameInputField } from './components/SignupLastNameInputField';
import { SignupPasswordInputField } from './components/SignupPasswordInputField';
import { SignupPhoneNumberInputField } from './components/SignupPhoneNumberInputField';
import { UserTypeField } from './components/UserTypeField';
import { getSignUpSchema, getSoleUserTypeMaybe } from './helper';
import { SignupFormValues } from './Signup.types';
import { getNonUserFieldParams, pickUserFieldsData } from '@util/userHelpers';
import { useAppDispatch, useTypedSelector } from '@redux/store';
import {
  loginInProgress,
  signupInProgress,
  signupWithEmailPassword,
} from '@redux/slices/auth.slice';
import { TermsAndPolicy } from './components/TermsAndPolicy';
import { Button, CommonText } from '@components/index';
import { colors } from '@constants/colors';
import { SCREENS } from '@constants/screens';

type SignupRouteProp = RouteProp<AuthStackParamList, 'Signup'>;
type SignupNavigationProp = NavigationProp<AuthStackParamList, 'Signup'>;

export const Signup: React.FC = () => {
  const route = useRoute<SignupRouteProp>();
  const preselectedUserType = route.params?.userType;
  const dispatch = useAppDispatch();

  const navigation = useNavigation<SignupNavigationProp>();
  const signupInProcess = useTypedSelector(signupInProgress);
  const loginInProcess = useTypedSelector(loginInProgress);
  const config = useConfiguration();
  const { t } = useTranslation();
  const userTypes = useMemo(() => config?.user.userTypes || [], [config]);
  const userFields = useMemo(() => config?.user.userFields || [], [config]);
  const hasMultipleUserTypes = userTypes.length > 1;
  const [selectedUserType, setSelectedUserType] = useState<string>(
    preselectedUserType || getSoleUserTypeMaybe(userTypes) || '',
  );

  const { control, handleSubmit } = useForm<SignupFormValues>({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      displayName: '',
      phoneNumber: '',
      terms: [],
    },
    resolver: zodResolver(
      getSignUpSchema(userTypes, selectedUserType, userFields, t),
    ),

    mode: 'onChange',
  });

  const initialUserTypeKnown = !!preselectedUserType || !hasMultipleUserTypes;
  const showDefaultUserFields = initialUserTypeKnown || !!selectedUserType;

  // Get the user type configuration
  const userTypeConfig = useMemo(() => {
    const foundConfig = userTypes.find(
      cfg => cfg.userType === selectedUserType,
    );
    return foundConfig as UserTypeConfigItem | undefined;
  }, [userTypes, selectedUserType]);

  // Check if displayName should be shown
  const showDisplayName = useMemo(() => {
    if (!userTypeConfig) return false;
    const { displayNameSettings, defaultUserFields } = userTypeConfig;
    const isDisabled = defaultUserFields?.displayName === false;
    const isAllowedInSignUp = displayNameSettings?.displayInSignUp === true;
    return !isDisabled && isAllowedInSignUp;
  }, [userTypeConfig]);

  // Check if phone number should be shown
  const showPhoneNumber = useMemo(() => {
    if (!userTypeConfig) return false;
    const { phoneNumberSettings, defaultUserFields } = userTypeConfig;
    const isDisabled = defaultUserFields?.phoneNumber === false;
    const isAllowedInSignUp = phoneNumberSettings?.displayInSignUp === true;
    return !isDisabled && isAllowedInSignUp;
  }, [userTypeConfig]);

  const onSubmit = (data: SignupFormValues) => {
    data.userType = selectedUserType; // append user type to the form data before submitting
    const {
      userType,
      email,
      password,
      firstName,
      lastName,
      displayName,
      ...rest
    } = data;
    const displayNameMaybe = displayName
      ? { displayName: displayName.trim() }
      : {};

    const params = {
      email,
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      ...displayNameMaybe,
      publicData: {
        userType,
        ...pickUserFieldsData(rest, 'public', userType, userFields),
      },
      privateData: {
        ...pickUserFieldsData(rest, 'private', userType, userFields),
      },
      protectedData: {
        ...pickUserFieldsData(rest, 'protected', userType, userFields),
        ...getNonUserFieldParams(rest, userFields),
      },
    };

    dispatch(signupWithEmailPassword(params));
  };

  const handleLoginPress = () => navigation.navigate(SCREENS.LOGIN);

  return (
    <View style={styles.container}>
      <CommonText style={styles.title}>Sign up</CommonText>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <UserTypeField
          value={selectedUserType}
          onUserTypeChange={setSelectedUserType}
          hasExistingUserType={!!preselectedUserType}
          userTypes={userTypes}
        />

        {showDefaultUserFields && (
          <>
            <SignupEmailInputField control={control} />
            <SignupPasswordInputField control={control} />
            <SignupFirstNameInputField control={control} />
            <SignupLastNameInputField control={control} />
            {showDisplayName && (
              <SignupDisplayNameInputField control={control} />
            )}
            {showPhoneNumber && (
              <SignupPhoneNumberInputField control={control} />
            )}
          </>
        )}

        {showDefaultUserFields ? (
          <CustomUserFields
            showDefaultUserFields={showDefaultUserFields}
            selectedUserType={selectedUserType}
            control={control}
          />
        ) : null}

        {showDefaultUserFields && (
          <>
            <TermsAndPolicy control={control} />
            <Button
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              style={{ marginBottom: 20 }}
              loader={signupInProcess || loginInProcess}
              disabled={signupInProcess || loginInProcess}
              //   // don't use disabled prop = isValid because it will prevent the error to be displayed on cross field validation
            />
            <View style={styles.loginContainer}>
              <CommonText style={styles.loginText}>
                {t('Authentication.haveAnAccount')}{' '}
              </CommonText>
              <TouchableOpacity onPress={handleLoginPress}>
                <CommonText style={styles.loginLink}>
                  {t('Authentication.login')}
                </CommonText>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    backgroundColor: '#fff',
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
});
