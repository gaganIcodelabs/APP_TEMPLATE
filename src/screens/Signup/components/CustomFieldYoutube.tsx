import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { CustomUserFieldInputProps } from '@appTypes/config';
import { SignupFormValues } from '../Signup.types';
import { Control } from 'react-hook-form';
import { getLabel } from './CustomExtendedDataField';
import { CommonTextInput } from '@components/index';

interface CustomFieldYoutubeProps
  extends Omit<CustomUserFieldInputProps, 'key' | 'defaultRequiredMessage'> {
  control: Control<SignupFormValues>;
}

export const CustomFieldYoutube = ({
  fieldConfig,
  control,
  name,
}: CustomFieldYoutubeProps) => {
  const { saveConfig, schemaType } = fieldConfig;
  const placeholder =
    saveConfig?.placeholderMessage ||
    'CustomExtendedDataField.placeholderText ';

  const label = getLabel(fieldConfig);

  return (
    <CommonTextInput
      control={control}
      name={name}
      labelKey={label}
      placeholder={placeholder}
    />
  );
};

const styles = StyleSheet.create({});
