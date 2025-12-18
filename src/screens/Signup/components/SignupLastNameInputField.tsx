import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { isNonEmptyString } from '@util/validators';
import { SignupFormValues } from '../Signup.types';
import { CommonTextInput } from '@components/index';

type Props = {
  control: Control<SignupFormValues>;
};

export const SignupLastNameInputField: React.FC<Props> = ({ control }) => {
  return (
    <CommonTextInput
      control={control}
      name="lastName"
      labelKey="lastName"
      placeholder="Enter your lastName"
    />
    // <Controller
    //   control={control}
    //   name="lastName"
    //   rules={{
    //     required: 'Last name is required',
    //     validate: {
    //       nonEmpty: value => {
    //         return isNonEmptyString(value) || 'Last name is required';
    //       },
    //     },
    //   }}
    //   render={({ field: { onChange, onBlur, value } }) => (
    //     <>
    //       <TextInput
    //         style={styles.input}
    //         placeholder="Last name"
    //         autoComplete="family-name"
    //         autoCapitalize="words"
    //         onBlur={onBlur}
    //         onChangeText={onChange}
    //         value={value}
    //       />
    //       {errors.lastName && (
    //         <Text style={styles.errorText}>{errors.lastName.message}</Text>
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
