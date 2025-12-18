import { CustomUserFieldInputProps } from '@appTypes/config';
import { Control, Controller } from 'react-hook-form';
import { SignupFormValues } from '../Signup.types';
import { CommonTextInput } from '@components/index';
import { getLabel } from './CustomExtendedDataField';
import { SCHEMA_TYPE_LONG } from '@constants/schemaTypes';

interface CustomFieldTextProps
  extends Omit<CustomUserFieldInputProps, 'key' | 'defaultRequiredMessage'> {
  control: Control<SignupFormValues>;
}

export const CustomFieldText = ({
  name,
  fieldConfig,
  control,
}: CustomFieldTextProps) => {
  const { saveConfig, schemaType } = fieldConfig;
  const placeholder =
    saveConfig?.placeholderMessage ||
    'CustomExtendedDataField.placeholderText ';

  const label = getLabel(fieldConfig);

  const isSchemaLong = schemaType === SCHEMA_TYPE_LONG;

  return (
    <CommonTextInput
      control={control}
      name={name}
      labelKey={label}
      placeholder={placeholder}
      keyboardType={isSchemaLong ? 'numeric' : 'default'}
    />
  );
};

export default CustomFieldText;
