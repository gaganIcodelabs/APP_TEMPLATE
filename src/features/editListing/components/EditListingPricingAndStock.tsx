import { CheckBox, CommonTextInput } from '@components/index';
import { useConfiguration } from '@context/configurationContext';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEditListingWizardRoute } from '../editListing.helper';
import { useIsCompatibleCurrency } from '../hooks/useIsCompatibleCurrency';
import { useIsShowPricing } from '../hooks/useIsShowPricing';
import { useIsShowStock } from '../hooks/useIsShowStock';
import { EditListingForm } from '../types/editListingForm.type';

// Stock type constants (matching web-template)
const STOCK_ONE_ITEM = 'oneItem';
const STOCK_MULTIPLE_ITEMS = 'multipleItems';
const STOCK_INFINITE_ONE_ITEM = 'infiniteOneItem';
const STOCK_INFINITE_MULTIPLE_ITEMS = 'infiniteMultipleItems';
const STOCK_INFINITE_ITEMS = [STOCK_INFINITE_ONE_ITEM, STOCK_INFINITE_MULTIPLE_ITEMS];

const MILLION = 1000000;

const EditListingPricingAndStock = () => {
  const listingId = useEditListingWizardRoute().params.listingId;
  const { control } = useFormContext<EditListingForm>();
  const config = useConfiguration();
  const isCompatibleCurrency = useIsCompatibleCurrency(listingId);
  const isShowPricing = useIsShowPricing();
  const isShowStock = useIsShowStock();

  const listingType = useWatch<EditListingForm>({
    control,
    name: 'type',
  });

  // Only show if both pricing and stock should be shown
  if (!isShowPricing || !isShowStock || !isCompatibleCurrency) return null;

  const listingTypeConfig = config?.listing?.listingTypes?.find(
    type => type.listingType === listingType,
  );

  const currency = config?.currency || 'USD';
  const stockType = listingTypeConfig?.stockType;

  // Determine stock management type
  const hasFiniteStock = stockType === STOCK_MULTIPLE_ITEMS;

  return (
    <View style={styles.container}>
      {/* Price Field */}
      <View style={styles.fieldContainer}>
        <CommonTextInput
          control={control}
          name="price"
          labelValue={`Price`}
          labelStyle={styles.label}
          placeholder={`Add a price...`}
          keyboardType="numeric"
        />
        <Text style={styles.helperText}>
          Enter the price in {currency}. 
        </Text>
      </View>

      {/* Stock Field - for finite stock (multipleItems) */}
      {hasFiniteStock && (
        <View style={styles.fieldContainer}>
          <CommonTextInput
            control={control}
            name="stock"
            labelValue="Stock"
            labelStyle={styles.label}
            placeholder="How many items do you have for sale?"
            keyboardType="numeric"
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
  fieldContainer: {
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
  infoContainer: {
    backgroundColor: '#F0F8FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default EditListingPricingAndStock;
