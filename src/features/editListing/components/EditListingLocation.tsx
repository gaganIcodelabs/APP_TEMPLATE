import { LocationModal, LocationSuggestion } from '@components/LocationModal';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useIsShowLocation } from '../hooks/useIsShowLocation';
import { EditListingForm } from '../types/editListingForm.type';
import { CommonTextInput } from '@components/index';

const EditListingLocation = () => {
  const { control, setValue, getValues } = useFormContext<EditListingForm>();
  const isShowLocation = useIsShowLocation();
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  // Watch the location value to display it
  const initialAddress = getValues('location.address');

  const handleLocationSelect = (location: LocationSuggestion) => {
    // Convert Mapbox center [lng, lat] to origin [lat, lng] format
    const [longitude, latitude] = location.center;
    const origin: [number, number] = [latitude, longitude];

    // Get current location value to preserve building if it exists
    const currentLocation = getValues('location') || {};

    // Set the entire location object at once
    setValue(
      'location',
      {
        ...currentLocation,
        address: location.placeName,
        origin,
      },
      { shouldValidate: true },
    );
  };

  if (!isShowLocation) return null;

  return (
    <View style={styles.container}>
      {/* Address Field - Looks like text input but opens modal */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Address</Text>
        <Controller
          control={control}
          name="location"
          render={({ field: { value }, fieldState: { error } }) => {
            return (
              <>
                <TouchableOpacity
                  style={[
                    styles.addressInput,
                    error && styles.addressInputError,
                  ]}
                  onPress={() => setIsLocationModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.addressText,
                      !value?.address && styles.addressPlaceholder,
                    ]}
                  >
                    {value?.address || 'Search for a location...'}
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
          placeholder="Search for a location..."
        />
      </View>

      {/* Building/Apt/Suite Field */}
      <View style={styles.fieldContainer}>
        <CommonTextInput
          labelValue="Apt, suite, building # • optional"
          labelStyle={styles.label}
          control={control}
          name="location.building"
          placeholder="Apt, suite, building #"
        />
      </View>
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
  addressText: {
    fontSize: 16,
    color: '#333',
  },
  addressPlaceholder: {
    color: '#999',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
});

export default EditListingLocation;
