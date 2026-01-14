import {
  Button,
  CommonTextInput,
  RadioList,
  SessionLengthPicker,
} from '@components/index';
import { useConfiguration } from '@context/configurationContext';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEditListingWizardRoute } from '../editListing.helper';
import { useIsCompatibleCurrency } from '../hooks/useIsCompatibleCurrency';
import { useIsPriceVariationsEnabled } from '../hooks/useIsPriceVariationsEnabled';
import { EditListingForm } from '../types/editListingForm.type';

const START_TIME_INTERVAL_OPTIONS = [
  { label: 'Start every hour', value: 'hour' },
  { label: 'Start every half hour', value: 'halfHour' },
  { label: 'Start every quarter hour', value: 'quarterHour' },
];
export const FIXED = 'fixed';

const EditListingPriceVariations = () => {
  const listingId = useEditListingWizardRoute().params.listingId;
  const { control } = useFormContext<EditListingForm>();
  const config = useConfiguration();
  const isCompatibleCurrency = useIsCompatibleCurrency(listingId);
  const isPriceVariationsEnabled = useIsPriceVariationsEnabled();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'priceVariants',
  });

  const listingType = useWatch<EditListingForm>({
    control,
    name: 'listingType',
  });

  if (!isPriceVariationsEnabled || !isCompatibleCurrency) return null;

  const listingTypeConfig = config?.listing?.listingTypes?.find(
    type => type.listingType === listingType,
  );

  const unitType = listingTypeConfig?.transactionType?.unitType || 'day';
  const isFixedUnitType = unitType === FIXED;

  const handleAddVariation = () => {
    const newVariation = isFixedUnitType
      ? { name: '', price: undefined, bookingLengthInMinutes: 60 }
      : { name: '', price: undefined };
    append(newVariation);
  };

  const handleRemoveVariation = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Ensure at least one variation exists
  if (fields.length === 0) {
    const initialVariation = isFixedUnitType
      ? { name: '', price: undefined, bookingLengthInMinutes: 60 }
      : { name: '', price: undefined };
    append(initialVariation);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Pricing</Text>

      {fields.map((field, index) => (
        <View key={field.id} style={styles.variationContainer}>
          <View style={styles.variationHeader}>
            <Text style={styles.variationTitle}>Variation {index + 1}</Text>
            {fields.length > 1 && (
              <TouchableOpacity
                onPress={() => handleRemoveVariation(index)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <CommonTextInput
              control={control}
              name={`priceVariants.${index}.name`}
              labelValue="Variation name"
              labelStyle={styles.label}
              placeholder="Add a name..."
            />
          </View>

          <View style={styles.fieldContainer}>
            <CommonTextInput
              control={control}
              name={`priceVariants.${index}.priceInSubunits`}
              // name={`priceVariants.${index}.price`}
              labelValue={`Price per ${isFixedUnitType ? 'session' : unitType}`}
              labelStyle={styles.label}
              placeholder={`Add a price...`}
              keyboardType="numeric"
            />
          </View>

          {/* Session Length for FIXED unit type */}
          {isFixedUnitType && (
            <View style={styles.fieldContainer}>
              <Controller
                control={control}
                name={`priceVariants.${index}.bookingLengthInMinutes`}
                defaultValue={60}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <SessionLengthPicker
                    value={value}
                    onChange={onChange}
                    label="Session length"
                    error={error?.message}
                  />
                )}
              />
            </View>
          )}
        </View>
      ))}

      {fields.length < 20 && (
        <View style={styles.addButtonContainer}>
          <Button
            title="Add a price variation"
            onPress={handleAddVariation}
            style={styles.addButton}
            titleStyle={styles.addButtonText}
          />
        </View>
      )}

      {/* Start Time Interval */}
      {isFixedUnitType && (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  variationContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  variationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  variationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFE5E5',
  },
  deleteButtonText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '500',
  },
  fieldContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  addButtonContainer: {
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default EditListingPriceVariations;
