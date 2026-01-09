import { CommonCheckbox, CommonTextInput } from '@components/index';
import { LocationModal, LocationSuggestion } from '@components/LocationModal';
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEditListingWizardRoute } from '../editListing.helper';
import { useIsCompatibleCurrency } from '../hooks/useIsCompatibleCurrency';
import { EditListingForm } from '../types/editListingForm.type';
import { useIsShowDelivery } from '../hooks/useIsShowDelivery';

const EditListingDelivery = () => {
  const listingId = useEditListingWizardRoute().params.listingId;
  const { control, setValue, getValues } = useFormContext<EditListingForm>();
  const isCompatibleCurrency = useIsCompatibleCurrency(listingId);
  const { showPickup, showShipping } = useIsShowDelivery();
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  // Watch delivery options to show/hide fields
  const {pickupEnabled, shippingEnabled} = useWatch({
    control,
    name: 'deliveryOptions',
    compute: (data: EditListingForm['deliveryOptions'])=>{
      return {
        pickupEnabled: data?.includes('pickup') || false,
        shippingEnabled: data?.includes('shipping') || false
      }
    }
  })

  const initialAddress = getValues('pickupLocation.address');

  const handleLocationSelect = (location: LocationSuggestion) => {
    // Convert Mapbox center [lng, lat] to origin [lat, lng] format
    const [longitude, latitude] = location.center;
    const origin: [number, number] = [latitude, longitude];

    // Get current location value to preserve building if it exists
    const currentLocation = getValues('pickupLocation') || {};

    // Set the entire location object at once
    setValue(
      'pickupLocation',
      {
        ...currentLocation,
        address: location.placeName,
        origin,
      },
      { shouldValidate: true },
    );
  };

  const toggleDeliveryOption = (option: 'pickup' | 'shipping') => {
    const currentOptions = getValues('deliveryOptions') || [];
    const newOptions = currentOptions.includes(option)
      ? currentOptions.filter(o => o !== option)
      : [...currentOptions, option];
    setValue('deliveryOptions', newOptions, { shouldValidate: true });
  };

  if (!isCompatibleCurrency || (!showPickup && !showShipping)) return null;

  const showMultipleDelivery = showPickup && showShipping;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Delivery Options</Text>

      {/* Pickup Option */}
      {showPickup && (
        <View style={styles.deliverySection}>
          {showMultipleDelivery && (
            <CommonCheckbox
              checked={pickupEnabled}
              onPress={() => toggleDeliveryOption('pickup')}
              label="Pickup"
            />
          )}

          <View
            style={[
              styles.deliveryFields,
              !pickupEnabled && showMultipleDelivery ? styles.disabledFields : undefined,
            ]}
            pointerEvents={
              !pickupEnabled && showMultipleDelivery ? 'none' : 'auto'
            }
          >
            {/* Pickup Address Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Pickup Address</Text>
              <Controller
                control={control}
                name="pickupLocation"
                rules={{
                  validate: value => {
                    if (pickupEnabled && !value?.address) {
                      return 'Pickup address is required';
                    }
                    return true;
                  },
                }}
                render={({ field: { value }, fieldState: { error } }) => {
                  return (
                    <>
                      <TouchableOpacity
                        style={[
                          styles.addressInput,
                          error ? styles.addressInputError : undefined,
                          !pickupEnabled && showMultipleDelivery ? styles.disabledInput : undefined,
                        ]}
                        onPress={() => setIsLocationModalVisible(true)}
                        activeOpacity={0.7}
                        disabled={!pickupEnabled && showMultipleDelivery ? true : false}
                      >
                        <Text
                          style={[
                            styles.addressText,
                            !value?.address ? styles.addressPlaceholder : undefined,
                            !pickupEnabled && showMultipleDelivery ? styles.disabledText : undefined,
                          ]}
                        >
                          {value?.address || 'Search for a pickup location...'}
                        </Text>
                      </TouchableOpacity>
                      {error && <Text style={styles.errorText}>{error.message}</Text>}
                    </>
                  );
                }}
              />
              <LocationModal
                visible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
                onSelectLocation={handleLocationSelect}
                initialValue={initialAddress || ''}
                placeholder="Search for a pickup location..."
              />
            </View>

            {/* Building/Apt/Suite Field for Pickup */}
            <View style={styles.fieldContainer}>
              <CommonTextInput
                labelValue="Apt, suite, building • optional"
                labelStyle={styles.label}
                control={control}
                name="pickupLocation.building"
                placeholder="Apt, suite, building"
                editable={pickupEnabled || !showMultipleDelivery}
              />
            </View>
          </View>
        </View>
      )}

      {/* Shipping Option */}
      {showShipping && (
        <View style={styles.deliverySection}>
          {showMultipleDelivery && (
            <CommonCheckbox
              checked={shippingEnabled}
              onPress={() => toggleDeliveryOption('shipping')}
              label="Shipping"
            />
          )}

          <View
            style={[
              styles.deliveryFields,
              !shippingEnabled && showMultipleDelivery ? styles.disabledFields : undefined,
            ]}
            pointerEvents={
              !shippingEnabled && showMultipleDelivery ? 'none' : 'auto'
            }
          >
            {/* Shipping Price for One Item */}
            <View style={styles.fieldContainer}>
              <Controller
                control={control}
                name="shippingPriceOneItem"
                rules={{
                  validate: (value: any) => {
                    if (shippingEnabled && !value) {
                      return 'Shipping price is required';
                    }
                    if (value && isNaN(Number(value))) {
                      return 'Please enter a valid number';
                    }
                    return true;
                  },
                }}
                render={({ fieldState: { error } }) => (
                  <>
                    <CommonTextInput
                      labelValue="Shipping fee for one item"
                      labelStyle={styles.label}
                      control={control}
                      name="shippingPriceOneItem"
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                      editable={shippingEnabled || !showMultipleDelivery}
                    />
                    {error && <Text style={styles.errorText}>{error.message}</Text>}
                  </>
                )}
              />
            </View>

            {/* Shipping Price for Additional Items */}
            <View style={styles.fieldContainer}>
              <Controller
                control={control}
                name="shippingPriceAdditionalItems"
                rules={{
                  validate: (value: any) => {
                    if (value && isNaN(Number(value))) {
                      return 'Please enter a valid number';
                    }
                    return true;
                  },
                }}
                render={({ fieldState: { error } }) => (
                  <>
                    <CommonTextInput
                      labelValue="Shipping fee for additional items"
                      labelStyle={styles.label}
                      control={control}
                      name="shippingPriceAdditionalItems"
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                      editable={shippingEnabled || !showMultipleDelivery}
                    />
                    {error && <Text style={styles.errorText}>{error.message}</Text>}
                  </>
                )}
              />
            </View>
          </View>
        </View>
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
    marginBottom: 16,
  },
  deliverySection: {
    marginBottom: 24,
  },
  deliveryFields: {
    paddingLeft: 0,
  },
  disabledFields: {
    opacity: 0.5,
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
  addressInput: {
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  addressInputError: {
    borderColor: 'red',
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
  },
  addressPlaceholder: {
    color: '#999',
  },
  disabledText: {
    color: '#999',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
});

export default EditListingDelivery;
