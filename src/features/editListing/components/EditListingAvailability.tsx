import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFormContext, useWatch } from 'react-hook-form';
import { EditListingForm } from '../types/editListingForm.type';
import { useIsShowAvailability } from '../hooks/useIsShowAvailability';
import { AvailabilityModal } from './availability';

const WEEKDAYS = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
] as const;

/**
 * EditListingAvailability Component
 * 
 * Allows providers to set their weekly availability schedule for calendar bookings.
 */
const EditListingAvailability: React.FC = () => {
  const isShowAvailability = useIsShowAvailability();
  const { control, setValue } = useFormContext<EditListingForm>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { isScheduleExists, availabilityTimezone } = useWatch({
    control,
    name: 'availabilityPlan',
    compute: (data: EditListingForm['availabilityPlan']) => ({
      isScheduleExists: data?.entries.length && data?.entries.length > 0 || data?.timezone ? true : false,
      availabilityTimezone: data?.timezone
    })
  });
  // Don't show if availability is not enabled for this listing type
  if (!isShowAvailability) {
    return null;
  }

  const timezone = availabilityTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleOpenModal = () => {
    // Initialize with default timezone if not set
    if (!isScheduleExists) {
      setValue('availabilityPlan', {
        type: 'availability-plan/time',
        timezone,
        entries: [],
      });
    }
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Availability</Text>
      <Text style={styles.description}>
        When is this listing available for booking? Start by setting a default weekly schedule.
      </Text>

      <TouchableOpacity style={styles.setScheduleButton} onPress={handleOpenModal}>
        <Text style={styles.setScheduleButtonText}>
          {isScheduleExists ? 'Edit default schedule' : 'Set default schedule'}
        </Text>
      </TouchableOpacity>

      <AvailabilityModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        timezone={timezone}
        weekdays={WEEKDAYS}
      />
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  setScheduleButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  setScheduleButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EditListingAvailability;
