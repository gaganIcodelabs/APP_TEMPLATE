import { Text } from 'react-native';
import {
  SCHEMA_TYPE_ENUM,
  SCHEMA_TYPE_LONG,
  SCHEMA_TYPE_MULTI_ENUM,
  SCHEMA_TYPE_TEXT,
  SCHEMA_TYPE_YOUTUBE,
} from '@constants/schemaTypes';
import {
  CustomUserFieldInputProps,
  UserFieldConfigItem,
} from '@appTypes/config';
import CustomFieldText from './CustomFieldText';
import { Control } from 'react-hook-form';
import { SignupFormValues } from '../Signup.types';
import CustomFieldSingleSelect from './CustomFieldSingleSelect';
import { CustomFieldMultiselect } from './CustomFieldMultiselect';
import { CustomFieldYoutube } from './CustomFieldYoutube';

interface CustomExtendedDataFieldProps
  extends Omit<CustomUserFieldInputProps, 'key' | 'defaultRequiredMessage'> {
  control: Control<SignupFormValues>;
}

export const getLabel = (fieldConfig: UserFieldConfigItem | undefined) =>
  fieldConfig?.saveConfig?.label || fieldConfig?.label;

const CustomExtendedDataField = ({
  fieldConfig,
  control,
  name,
}: CustomExtendedDataFieldProps) => {
  const { schemaType, enumOptions = [] } = fieldConfig || {};

  switch (schemaType) {
    case SCHEMA_TYPE_TEXT:
    case SCHEMA_TYPE_LONG:
      return (
        <CustomFieldText
          fieldConfig={fieldConfig}
          name={name}
          control={control}
        />
      );
    case SCHEMA_TYPE_ENUM:
      return enumOptions?.length > 0 ? (
        <CustomFieldSingleSelect
          fieldConfig={fieldConfig}
          name={name}
          control={control}
        />
      ) : null;
    case SCHEMA_TYPE_MULTI_ENUM:
      return enumOptions?.length > 0 ? (
        <CustomFieldMultiselect
          fieldConfig={fieldConfig}
          name={name}
          control={control}
        />
      ) : null;
    case SCHEMA_TYPE_YOUTUBE:
      return (
        <CustomFieldYoutube
          fieldConfig={fieldConfig}
          name={name}
          control={control}
        />
      );

    default:
      return <Text>Unknown schema type: {schemaType}</Text>;
  }
};

export default CustomExtendedDataField;
