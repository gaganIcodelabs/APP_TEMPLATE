import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormContext, useWatch } from 'react-hook-form';
import { EditListingForm, AvailabilityPlan } from '../types/editListingForm.type';
import { useIsShowAvailability } from '../hooks/useIsShowAvailability';
import { TimeZoneSelector, DayScheduleEntry } from './availability';

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

  const availabilityPlan = useWatch<EditListingForm>({
    control,
    name: 'availabilityPlan',
  }) as AvailabilityPlan | undefined;

  // Don't show if availability is not enabled for this listing type
  if (!isShowAvailability) {
    return null;
  }

  const timezone = availabilityPlan?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleOpenModal = () => {
    // Initialize with default timezone if not set
    if (!availabilityPlan) {
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
          {availabilityPlan?.entries?.length ? 'Edit default schedule' : 'Set default schedule'}
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


/**
 * Modal for editing availability schedule
 */
interface AvailabilityModalProps {
  visible: boolean;
  onClose: () => void;
  timezone: string;
  weekdays: readonly { key: string; label: string }[];
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  visible,
  onClose,
  timezone,
  weekdays,
}) => {
  const { control, setValue } = useFormContext<EditListingForm>();
  
  const availabilityPlan = useWatch<EditListingForm>({
    control,
    name: 'availabilityPlan',
  }) as AvailabilityPlan | undefined;

  const handleTimezoneChange = (newTimezone: string) => {
    setValue('availabilityPlan', {
      type: 'availability-plan/time',
      timezone: newTimezone,
      entries: availabilityPlan?.entries || [],
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalSafeArea} edges={['top']}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Edit default schedule</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.modalContent} 
          contentContainerStyle={styles.modalContentContainer}
          showsVerticalScrollIndicator={true}
        >
          <TimeZoneSelector
            value={timezone}
            onChange={handleTimezoneChange}
          />

          <Text style={styles.sectionHeading}>Weekly default schedule</Text>

          {weekdays.map(({ key, label }) => (
            <DayScheduleEntry
              key={key}
              dayOfWeek={key}
              dayLabel={label}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#666',
  },
  modalContent: {
    flex: 1,
  },
  modalContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 16,
  },
});

export default EditListingAvailability;
