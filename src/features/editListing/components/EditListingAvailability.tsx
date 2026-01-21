import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFormContext, useWatch } from 'react-hook-form';
import { EditListingForm, AvailabilityException } from '../types/editListingForm.type';
import { useIsShowAvailability } from '../hooks/useIsShowAvailability';
import { AvailabilityModal, AvailabilityExceptionModal, AvailabilityModalImperativeHandle } from './availability';
import { showDeleteConfirmAlert } from '@util/alertHelpers';
import { formatExceptionDate } from '@util/dateHelpers';

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
  const { control, setValue, getValues } = useFormContext<EditListingForm>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExceptionModalVisible, setIsExceptionModalVisible] = useState(false);
  const availabilityModalRef = useRef<AvailabilityModalImperativeHandle | null>(null);
  const { isScheduleExists, availabilityTimezone, exceptions } = useWatch({
    control,
    name: 'availabilityPlan',
    compute: (data: EditListingForm['availabilityPlan']) => ({
      isScheduleExists: data?.entries.length && data?.entries.length > 0 || data?.timezone ? true : false,
      availabilityTimezone: data?.timezone,
      exceptions: data?.exceptions || []
    })
  });
  // Don't show if availability is not enabled for this listing type
  if (!isShowAvailability) {
    return null;
  }

  const timezone = availabilityTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleOpenModal = () => {
    // Don't initialize form values here - let the modal handle it with local state
    setIsModalVisible(true);
    availabilityModalRef.current?.repopulateForm();
  };

  const handleSaveException = (exception: AvailabilityException) => {
    const currentPlan = getValues('availabilityPlan');
    const currentExceptions = currentPlan?.exceptions || [];
    
    setValue('availabilityPlan', {
      ...currentPlan!,
      exceptions: [...currentExceptions, exception],
    });
  };

  const handleDeleteException = (index: number) => {
    showDeleteConfirmAlert(
      'Delete Exception',
      'Are you sure you want to delete this exception?',
      () => {
        const currentPlan = getValues('availabilityPlan');
        const currentExceptions = currentPlan?.exceptions || [];
        const newExceptions = currentExceptions.filter((_: AvailabilityException, i: number) => i !== index);
        
        setValue('availabilityPlan', {
          ...currentPlan!,
          exceptions: newExceptions,
        });
      }
    );
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

      {isScheduleExists && (
        <>
          <TouchableOpacity 
            style={[styles.setScheduleButton, styles.exceptionButton]} 
            onPress={() => setIsExceptionModalVisible(true)}
          >
            <Text style={styles.setScheduleButtonText}>Add an availability exception</Text>
          </TouchableOpacity>

          {exceptions.length > 0 && (
            <View style={styles.exceptionsContainer}>
              <Text style={styles.exceptionsTitle}>Exceptions:</Text>
              {exceptions.map((exception, index) => (
                <View key={index} style={styles.exceptionItem}>
                  <View style={styles.exceptionInfo}>
                    <Text style={styles.exceptionText}>
                      {formatExceptionDate(exception.start)} - {formatExceptionDate(exception.end)}
                    </Text>
                    <Text style={styles.exceptionSeats}>
                      {exception.seats === 0 ? 'Unavailable' : `${exception.seats} seat${exception.seats !== 1 ? 's' : ''}`}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => handleDeleteException(index)}
                    style={styles.deleteExceptionButton}
                  >
                    <Text style={styles.deleteExceptionText}>🗑</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      <AvailabilityModal
        ref={availabilityModalRef}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        timezone={timezone}
        weekdays={WEEKDAYS}
      />

      <AvailabilityExceptionModal
        visible={isExceptionModalVisible}
        onClose={() => setIsExceptionModalVisible(false)}
        onSave={handleSaveException}
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
    marginBottom: 12,
  },
  exceptionButton: {
    marginTop: 4,
  },
  setScheduleButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '500',
  },
  exceptionsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  exceptionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  exceptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 8,
  },
  exceptionInfo: {
    flex: 1,
  },
  exceptionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  exceptionSeats: {
    fontSize: 12,
    color: '#666',
  },
  deleteExceptionButton: {
    padding: 8,
  },
  deleteExceptionText: {
    fontSize: 18,
  },
});

export default EditListingAvailability;
