import { UserFieldConfigItem } from '@appTypes/config';
import { ListingField } from '@appTypes/config/configListing';
import { CommonText } from '@components/index';
import { Control, Controller } from 'react-hook-form';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { getLabel } from './CustomExtendedDataField';

type CustomFieldMultiSelectPropsBase = {
  name: string;
  control: Control;
};

type CustomFieldMultiSelectPropsUser = CustomFieldMultiSelectPropsBase & {
  fieldType: 'user';
  fieldConfig: UserFieldConfigItem;
};

type CustomFieldMultiSelectPropsListing = CustomFieldMultiSelectPropsBase & {
  fieldType: 'listing';
  fieldConfig: ListingField;
};

type CustomFieldMultiSelectProps =
  | CustomFieldMultiSelectPropsUser
  | CustomFieldMultiSelectPropsListing;

export const CustomFieldMultiselect = (props: CustomFieldMultiSelectProps) => {
  const { control, fieldConfig, name } = props;
  const { enumOptions = [] } = fieldConfig || {};
  const label = getLabel(fieldConfig);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={styles.customFieldMultiEnumContainer}>
          <CommonText style={styles.label}>{label}</CommonText>
          <View style={styles.customFieldMultiEnumButtonContainer}>
            {enumOptions.map(elm => {
              const isSelected = value && value.includes(elm.option);
              return (
                <TouchableOpacity
                  key={elm.option}
                  activeOpacity={0.5}
                  style={[
                    styles.multiEnumButtonItem,
                    isSelected && {
                      backgroundColor: 'gold',
                    },
                  ]}
                  onPress={() => {
                    let arr = value ? [...value] : [];
                    const index = arr.findIndex(item => item === elm.option);
                    if (index > -1) {
                      arr = arr.filter(item => item !== elm.option);
                    } else {
                      arr.push(elm.option);
                    }
                    onChange(arr);
                  }}
                >
                  {!isSelected && (
                    <View style={styles.nonSelectedMultiEnumButtonIndicator} />
                  )}
                  <CommonText style={styles.multiEnumButtonText}>
                    {elm.label}
                  </CommonText>
                </TouchableOpacity>
              );
            })}
          </View>
          {error && (
            <CommonText style={styles.error}>{error.message}</CommonText>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
    fontWeight: '500',
  },
  error: {
    marginTop: 5,
    fontSize: 14,
    color: 'red',
  },
  customFieldMultiEnumContainer: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  customFieldMultiEnumButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  multiEnumButtonItem: {
    borderRadius: 12,
  },
  multiEnumButtonText: {
    fontSize: 14,
    marginVertical: 8,
    marginHorizontal: 12,
  },
  nonSelectedMultiEnumButtonIndicator: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: 12,
    backgroundColor: 'lightgrey',
  },
});
