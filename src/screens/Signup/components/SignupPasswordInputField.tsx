import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from '@util/validators';
import { SignupFormValues } from '../Signup.types';
import { CommonTextInput } from '@components/index';

type Props = {
  control: Control<SignupFormValues>;
};

export const SignupPasswordInputField: React.FC<Props> = ({ control }) => {
  return (
    <CommonTextInput
      control={control}
      name="password"
      labelKey="PassWord"
      placeholder="Enter your password"
    />
    // <Controller
    //   control={control}
    //   name="password"
    //   rules={{
    //     required: 'Password is required',
    //     validate: {
    //       // Don't trim password - validate exact string length
    //       noTrim: value => {
    //         if (typeof value !== 'string' || value.length === 0) {
    //           return 'Password is required';
    //         }
    //         return true;
    //       },
    //     },
    //     minLength: {
    //       value: PASSWORD_MIN_LENGTH,
    //       message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    //     },
    //     maxLength: {
    //       value: PASSWORD_MAX_LENGTH,
    //       message: `Password must be no more than ${PASSWORD_MAX_LENGTH} characters`,
    //     },
    //   }}
    //   render={({ field: { onChange, onBlur, value } }) => (
    //     <>
    //       <TextInput
    //         style={styles.input}
    //         placeholder="Password"
    //         secureTextEntry
    //         onBlur={onBlur}
    //         onChangeText={onChange}
    //         value={value}
    //       />
    //       {errors.password && (
    //         <Text style={styles.errorText}>{errors.password.message}</Text>
    //       )}
    //     </>
    //   )}
    // />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12,
  },
});
