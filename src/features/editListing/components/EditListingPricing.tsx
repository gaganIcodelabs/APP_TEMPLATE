import { CommonTextInput, RadioList, SessionLengthPicker } from '@components/index';
import { useConfiguration } from '@context/configurationContext';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { useEditListingWizardRoute } from '../editListing.helper';
import { useIsCompatibleCurrency } from '../hooks/useIsCompatibleCurrency';
import { useIsShowPricing } from '../hooks/useIsShowPricing';
import { useIsPriceVariationsEnabled } from '../hooks/useIsPriceVariationsEnabled';
import { EditListingForm } from '../types/editListingForm.type';

const START_TIME_INTERVAL_OPTIONS = [
  { label: 'Start every hour', value: 'hour' },
  { label: 'Start every half hour', value: 'halfHour' },
  { label: 'Start every quarter hour', value: 'quarterHour' },
];
export const FIXED = 'fixed';

const EditListingPricing = () => {
  const listingId = useEditListingWizardRoute().params.listingId;
  const { control } = useFormContext<EditListingForm>();
  const config = useConfiguration();
  const isCompatibleCurrency = useIsCompatibleCurrency(listingId);
  const isShowPricing = useIsShowPricing();
  const isPriceVariationsEnabled = useIsPriceVariationsEnabled();

  const listingType = useWatch<EditListingForm>({
    control,
    name: 'type',
  });

  // Don't show simple pricing if:
  // 1. Price variations are enabled, OR
  // 2. Stock management is enabled (use EditListingPricingAndStock instead)
  if (!isShowPricing || !isCompatibleCurrency || isPriceVariationsEnabled) {
    return null;
  }

  const listingTypeConfig = config?.listing?.listingTypes?.find(
    type => type.listingType === listingType,
  );
  // Hide if listing has stock type (should use EditListingPricingAndStock)
  if (listingTypeConfig?.stockType) {
    return null;
  }

  const unitType = listingTypeConfig?.transactionType?.unitType || 'item';
  const isFixedUnitType = unitType === FIXED;

  return (
    <View style={styles.container}>
      <CommonTextInput
        control={control}
        name="price"
        labelValue={`Price`}
        labelStyle={styles.label}
        placeholder={`Add a price...`}
        keyboardType="numeric"
      />

      {/* Session Length for FIXED unit type */}
      {isFixedUnitType && (
        <View style={styles.fixedFieldsContainer}>
          <Controller
            control={control}
            name="bookingLengthInMinutes"
            defaultValue={60}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <SessionLengthPicker
                value={value}
                onChange={onChange}
                label="Session length"
                error={error?.message}
              />
            )}
          />

          {/* Start Time Interval */}
          <Controller
            control={control}
            name="startTimeInterval"
            defaultValue="hour"
            render={({ field: { value, onChange } }) => (
              <RadioList
                label="When should bookings start?"
                options={START_TIME_INTERVAL_OPTIONS}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: -8,
    marginBottom: 8,
  },
  fixedFieldsContainer: {
    marginTop: 16,
  },
});

export default EditListingPricing;
