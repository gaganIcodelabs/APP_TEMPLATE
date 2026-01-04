import { UserFieldConfigItem } from '@appTypes/config';
import { ListingField } from '@appTypes/config/configListing';
import {
  SCHEMA_TYPE_ENUM,
  SCHEMA_TYPE_LONG,
  SCHEMA_TYPE_MULTI_ENUM,
  SCHEMA_TYPE_TEXT,
  SCHEMA_TYPE_YOUTUBE,
} from '@constants/schemaTypes';
import { Control } from 'react-hook-form';
import { Text } from 'react-native';
import { CustomFieldMultiselect } from './CustomFieldMultiselect';
import CustomFieldSingleSelect from './CustomFieldSingleSelect';
import CustomFieldText from './CustomFieldText';
import { CustomFieldYoutube } from './CustomFieldYoutube';

type CustomExtendedDataFieldPropsBase = {
  name: string;
  control: Control<any>;
};

type CustomExtendedDataFieldPropsUser = CustomExtendedDataFieldPropsBase & {
  fieldType: 'user';
  fieldConfig: UserFieldConfigItem;
};

type CustomExtendedDataFieldPropsListing = CustomExtendedDataFieldPropsBase & {
  fieldType: 'listing';
  fieldConfig: ListingField;
};

export type CustomExtendedDataFieldProps =
  | CustomExtendedDataFieldPropsUser
  | CustomExtendedDataFieldPropsListing;

export const getLabel = (
  fieldConfig: UserFieldConfigItem | ListingField | undefined,
) => fieldConfig?.saveConfig?.label || fieldConfig?.label;

const CustomExtendedDataField = ({
  fieldConfig,
  control,
  name,
  fieldType,
}: CustomExtendedDataFieldProps) => {
  const { schemaType, enumOptions = [] } = fieldConfig || {};

  switch (schemaType) {
    case SCHEMA_TYPE_TEXT:
    case SCHEMA_TYPE_LONG:
      return (
        <CustomFieldText
          // for type narrowing
          {...(fieldType === 'user'
            ? {
                fieldType: 'user',
                fieldConfig: fieldConfig,
              }
            : {
                fieldType: 'listing',
                fieldConfig: fieldConfig,
              })}
          name={name}
          control={control}
        />
      );
    case SCHEMA_TYPE_ENUM:
      return enumOptions?.length > 0 ? (
        <CustomFieldSingleSelect
          // for type narrowing
          {...(fieldType === 'user'
            ? {
                fieldType: 'user',
                fieldConfig: fieldConfig,
              }
            : {
                fieldType: 'listing',
                fieldConfig: fieldConfig,
              })}
          name={name}
          control={control}
        />
      ) : null;
    case SCHEMA_TYPE_MULTI_ENUM:
      return enumOptions?.length > 0 ? (
        <CustomFieldMultiselect
          // for type narrowing
          {...(fieldType === 'user'
            ? {
                fieldType: 'user',
                fieldConfig: fieldConfig,
              }
            : {
                fieldType: 'listing',
                fieldConfig: fieldConfig,
              })}
          name={name}
          control={control}
        />
      ) : null;
    case SCHEMA_TYPE_YOUTUBE:
      return (
        <CustomFieldYoutube
          // for type narrowing
          {...(fieldType === 'user'
            ? {
                fieldType: 'user',
                fieldConfig: fieldConfig,
              }
            : {
                fieldType: 'listing',
                fieldConfig: fieldConfig,
              })}
          name={name}
          control={control}
        />
      );

    default:
      return <Text>Unknown schema type: {schemaType}</Text>;
  }
};

export default CustomExtendedDataField;
