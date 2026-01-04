import { UserFieldConfigItem } from '@appTypes/config';
import { ListingField } from '@appTypes/config/configListing';
import { CommonTextInput } from '@components/index';
import { SCHEMA_TYPE_LONG } from '@constants/schemaTypes';
import { Control } from 'react-hook-form';
import { getLabel } from './CustomExtendedDataField';

type CustomFieldTextPropsBase = {
  name: string;
  control: Control;
};

type CustomFieldTextPropsUser = CustomFieldTextPropsBase & {
  fieldType: 'user';
  fieldConfig: UserFieldConfigItem;
};

type CustomFieldTextPropsListing = CustomFieldTextPropsBase & {
  fieldType: 'listing';
  fieldConfig: ListingField;
};

type CustomFieldTextProps =
  | CustomFieldTextPropsUser
  | CustomFieldTextPropsListing;

export const CustomFieldText = (props: CustomFieldTextProps) => {
  const { name, fieldConfig, control, fieldType } = props;
  const { schemaType } = fieldConfig;

  // Handle different placeholder message structures
  const placeholder =
    fieldType === 'user'
      ? fieldConfig?.saveConfig?.placeholderMessage
      : 'CustomExtendedDataField.placeholderText ';

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
