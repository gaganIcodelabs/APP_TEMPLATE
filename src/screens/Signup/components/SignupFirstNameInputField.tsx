import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { isNonEmptyString } from '@util/validators';
import { SignupFormValues } from '../Signup.types';
import { CommonTextInput } from '@components/index';

type Props = {
  control: Control<SignupFormValues>;
};

export const SignupFirstNameInputField: React.FC<Props> = ({ control }) => {
  return (
    <CommonTextInput
      control={control}
      name="firstName"
      labelKey="firstName"
      placeholder="Enter your firstName"
    />
    // <Controller
    //   control={control}
    //   name="firstName"
    //   rules={{
    //     required: 'First name is required',
    //     validate: {
    //       nonEmpty: value => {
    //         return isNonEmptyString(value) || 'First name is required';
    //       },
    //     },
    //   }}
    //   render={({ field: { onChange, onBlur, value } }) => (
    //     <>
    //       <TextInput
    //         style={styles.input}
    //         placeholder="First name"
    //         autoComplete="given-name"
    //         autoCapitalize="words"
    //         onBlur={onBlur}
    //         onChangeText={onChange}
    //         value={value}
    //       />
    //       {errors.firstName && (
    //         <Text style={styles.errorText}>{errors.firstName.message}</Text>
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
