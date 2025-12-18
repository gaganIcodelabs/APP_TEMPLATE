import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { SignupFormValues } from '../Signup.types';
import { isNonEmptyString } from '@util/validators';
import { CommonTextInput } from '@components/index';

type Props = {
  control: Control<SignupFormValues>;
};

export const SignupDisplayNameInputField: React.FC<Props> = ({ control }) => {
  return (
    <CommonTextInput
      control={control}
      name="displayName"
      labelKey="displayName"
      placeholder="Enter your displayName"
    />
    // <Controller
    //   control={control}
    //   name="displayName"
    //   rules={
    //     isRequired
    //       ? {
    //           required: 'Display name is required',
    //           validate: {
    //             nonEmpty: value => {
    //               return isNonEmptyString(value) || 'Display name is required';
    //             },
    //           },
    //         }
    //       : undefined
    //   }
    //   render={({
    //     field: { onChange, onBlur, value },
    //     fieldState: { error },
    //   }) => (
    //     <>
    //       <TextInput
    //         style={styles.input}
    //         placeholder="Display name"
    //         autoCapitalize="words"
    //         onBlur={onBlur}
    //         onChangeText={onChange}
    //         value={value}
    //       />
    //       {errors.displayName && (
    //         <Text style={styles.errorText}>{errors.displayName.message}</Text>
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
