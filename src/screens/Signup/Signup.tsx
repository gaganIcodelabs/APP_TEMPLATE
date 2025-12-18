import React, { useMemo, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useForm, useWatch } from 'react-hook-form';
import { useRoute, RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../types/navigation/paramList';
import { UserTypeField } from './components/UserTypeField';
// import { SignupEmailInputField } from './SignupEmailInputField';
// import { SignupFirstNameInputField } from './SignupFirstNameInputField';
// import { SignupLastNameInputField } from './SignupLastNameInputField';
import { SignupDisplayNameInputField } from './components/SignupDisplayNameInputField';
// import { SignupPasswordInputField } from './SignupPasswordInputField';
// import { SignupPhoneNumberInputField } from './SignupPhoneNumberInputField';
import { SignupFormValues } from './Signup.types';
import { useConfiguration } from '@context/configurationContext';
import type { UserTypeConfigItem } from '../../types/config/configUser';
import CustomUserFields from './components/CustomUserFields';
import { SignupEmailInputField } from './components/SignupEmailInputField';
import { SignupPasswordInputField } from './components/SignupPasswordInputField';
import { SignupFirstNameInputField } from './components/SignupFirstNameInputField';
import { SignupLastNameInputField } from './components/SignupLastNameInputField';
import { SignupPhoneNumberInputField } from './components/SignupPhoneNumberInputField';
import { getSignUpSchema } from './helper';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';

type SignupRouteProp = RouteProp<AuthStackParamList, 'Signup'>;

export const Signup: React.FC = () => {
  const route = useRoute<SignupRouteProp>();
  const preselectedUserType = route.params?.userType;

  const config = useConfiguration();
  const { t } = useTranslation();
  const userTypes = useMemo(() => config?.user.userTypes || [], [config]);
  const userFields = useMemo(() => config?.user.userFields || [], [config]);

  const hasMultipleUserTypes = userTypes.length > 1;

  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { isValid, errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      displayName: '',
      phoneNumber: '',
      terms: [],
      userType:
        preselectedUserType ||
        (hasMultipleUserTypes ? '' : userTypes[0]?.userType) ||
        '',
    },
    resolver: (values, context, options) =>
      zodResolver(getSignUpSchema(userTypes, values, userFields, t))(
        values,
        context,
        options,
      ),

    mode: 'all',
  });
  // console.log('errors', errors);

  // Watch all form values for password matching validation
  const watchedValues = useWatch({ control });
  const watchedUserType = watch('userType') ?? '';

  // Custom validation to check if any field matches the password
  // useEffect(() => {
  //   const password = watchedValues.password;

  //   if (!password) {
  //     // Clear any existing password match errors when password is empty
  //     Object.keys(watchedValues).forEach(key => {
  //       if (
  //         key !== 'password' &&
  //         errors[key as keyof SignupFormValues]?.message ===
  //           t('SignupForm.passwordCannotMatchOtherFields')
  //       ) {
  //         clearErrors(key as keyof SignupFormValues);
  //       }
  //     });
  //     return;
  //   }

  //   // Check each field against password
  //   Object.entries(watchedValues).forEach(([key, value]) => {
  //     if (
  //       key !== 'password' &&
  //       typeof value === 'string' &&
  //       value &&
  //       value === password
  //     ) {
  //       setError(key as keyof SignupFormValues, {
  //         type: 'custom',
  //         message: t('SignupForm.passwordCannotMatchOtherFields'),
  //       });
  //     } else if (
  //       key !== 'password' &&
  //       errors[key as keyof SignupFormValues]?.message ===
  //         t('SignupForm.passwordCannotMatchOtherFields')
  //     ) {
  //       // Clear the error if the field no longer matches the password
  //       clearErrors(key as keyof SignupFormValues);
  //     }
  //   });
  // }, [watchedValues, setError, clearErrors, errors, t]);

  const initialUserTypeKnown = !!preselectedUserType || !hasMultipleUserTypes;
  const showDefaultUserFields = initialUserTypeKnown || !!watchedUserType;

  // Get the user type configuration
  const userTypeConfig = useMemo(() => {
    const foundConfig = userTypes.find(cfg => cfg.userType === watchedUserType);
    return foundConfig as UserTypeConfigItem | undefined;
  }, [userTypes, watchedUserType]);

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
          control={control}
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
            selectedUserType={watchedUserType}
            control={control}
          />
        ) : null}

        {showDefaultUserFields && (
          <TouchableOpacity
            style={[styles.button, !isValid && styles.disabled]}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
            disabled={!isValid}
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
