/* eslint-disable react-native/no-inline-styles */
import { useConfiguration } from '@context/configurationContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import { getSignUpSchema } from './helper';
import { SignupFormValues } from './Signup.types';

type SignupRouteProp = RouteProp<AuthStackParamList, 'Signup'>;

export const Signup: React.FC = () => {
  const route = useRoute<SignupRouteProp>();
  const preselectedUserType = route.params?.userType;

  const config = useConfiguration();
  const { t } = useTranslation();
  const userTypes = useMemo(() => config?.user.userTypes || [], [config]);
  const userFields = useMemo(() => config?.user.userFields || [], [config]);

  const hasMultipleUserTypes = userTypes.length > 1;

  const [selectedUserType, setSelectedUserType] = useState(
    preselectedUserType ||
      (hasMultipleUserTypes ? '' : userTypes[0]?.userType) ||
      '',
  );
  const { control, handleSubmit } = useForm<SignupFormValues>({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      displayName: '',
      phoneNumber: '',
      // terms: [],
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
    try {
      console.log('data', data);

      data.userType = selectedUserType; // append user type to the form data before submitting
    } catch (error) {
      console.error('Validation error:', error);
      // Handle validation errors here
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
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
          <TouchableOpacity
            style={[styles.button]}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
            // don't use disabled prop = isValid because it will prevent the error to be displayed on cross field validation
          >
            <Text style={styles.buttonText}>Create account</Text>
          </TouchableOpacity>
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
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
