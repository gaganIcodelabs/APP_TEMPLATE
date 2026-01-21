import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { ModalSelect } from '@components/index';
import { CommonTextInput } from '@components/index';
import { AvailabilityException } from '../../types/editListingForm.type';
import { CalendarPickerModal } from './CalendarPickerModal';
import { generateTimeOptions } from '@util/timeUtils';
import { getTimeOptionsAfter } from '@util/timeUtils';
import { isSameDate } from '@util/dateHelpers';
import { showErrorAlert } from '@util/alertHelpers';
import { formatDateDisplay } from '@util/dateHelpers';
import { getTodayDateString } from '@util/dateHelpers';

const TIME_OPTIONS = generateTimeOptions(false);

interface AvailabilityExceptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (exception: AvailabilityException) => void;
}

type ExceptionFormData = {
  localException: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    seats: string;
  }
};

export const AvailabilityExceptionModal: React.FC<AvailabilityExceptionModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [showStartCalendar, setShowStartCalendar] = React.useState(false);
  const [showEndCalendar, setShowEndCalendar] = React.useState(false);

  const localForm = useForm<ExceptionFormData>({
    defaultValues: {
      localException: {
        startDate: '',
        startTime: '00:00',
        endDate: '',
        endTime: '00:00',
        seats: '0',
      }
    }
  });

  const { control, reset, getValues, setValue } = localForm;

  // Watch form values
  const {startDate, startTime, endDate, endTime} = useWatch({
    control,
    name: 'localException',
    compute: (data: ExceptionFormData['localException'])=>{
      return {
        startDate: data.startDate,
        startTime: data.startTime,
        endDate: data.endDate,
        endTime: data.endTime,
      }
    }
  })

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      reset({
        localException: {
          startDate: '',
          startTime: '00:00',
          endDate: '',
          endTime: '00:00',
          seats: '0',
        }
      });
    }
  }, [visible, reset]);

  // Filter end time options based on start time when dates are the same
  const getEndTimeOptions = () => {
    if (!startDate || !endDate || !isSameDate(startDate, endDate)) {
      return TIME_OPTIONS;
    }
    return getTimeOptionsAfter(startTime, TIME_OPTIONS);
  };

  const endTimeOptions = getEndTimeOptions();

  // Clear end time if it becomes invalid when start time or dates change
  useEffect(() => {
    if (startDate && endDate && isSameDate(startDate, endDate)) {
      if (endTime && endTime <= startTime) {
        setValue('localException.endTime', '');
      }
    }
  }, [startTime, startDate, endDate, endTime, setValue]);
  const handleStartDateChange = (dateString: string) => {
    setValue('localException.startDate', dateString);  

    // If end date is before new start date, clear it
    if (endDate && dateString > endDate) {
      setValue('localException.endDate', '');
      setValue('localException.endTime', '00:00');
    }
  };

  const handleEndDateChange = (dateString: string) => {
    setValue('localException.endDate', dateString);
  };

  const handleSave = () => {
    const values = getValues('localException');
    
    if (!values.startDate || !values.endDate) {
      showErrorAlert('Validation Error', 'Please select both start and end dates');
      return;
    }

    // Create ISO date strings
    const startDateTime = new Date(`${values.startDate}T${values.startTime}:00`);
    const endDateTime = new Date(`${values.endDate}T${values.endTime}:00`);

    if (endDateTime <= startDateTime) {
      showErrorAlert('Validation Error', 'End date/time must be after start date/time');
      return;
    }

    const exception: AvailabilityException = {
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      seats: parseInt(values.seats, 10) || 0,
    };

    onSave(exception);
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
        onRequestClose={onClose}
      >
        <FormProvider {...localForm}>
          <SafeAreaView style={styles.modalSafeArea} edges={['top']}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add an availability exception</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalContent}
              contentContainerStyle={styles.modalContentContainer}
            >
              {/* Start Date and Time */}
              <View style={styles.section}>
                <Text style={styles.label}>Starts</Text>
                <View style={styles.dateTimeRow}>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => setShowStartCalendar(true)}
                  >
                    <Text style={styles.dateButtonText}>
                      📅 {formatDateDisplay(startDate)}
                    </Text>
                  </TouchableOpacity>
                  
                  <View style={styles.timeSelect}>
                    <ModalSelect
                      control={control}
                      name="localException.startTime"
                      options={TIME_OPTIONS}
                      placeholder="Time"
                    />
                  </View>
                </View>
              </View>

              {/* End Date and Time */}
              <View style={styles.section}>
                <Text style={styles.label}>Ends</Text>
                <View style={styles.dateTimeRow}>
                  <TouchableOpacity 
                    style={[styles.dateButton, !startDate && styles.disabledButton]}
                    onPress={() => startDate && setShowEndCalendar(true)}
                    disabled={!startDate}
                  >
                    <Text style={[styles.dateButtonText, !startDate && styles.disabledText]}>
                      📅 {formatDateDisplay(endDate)}
                    </Text>
                  </TouchableOpacity>
                  
                  <View style={[styles.timeSelect, !startDate && styles.disabledSelect]}>
                    <ModalSelect
                      control={control}
                      name="localException.endTime"
                      options={endTimeOptions}
                      placeholder="Time"
                      disabled={!startDate}
                    />
                  </View>
                </View>
              </View>

              {/* Seats */}
              <View style={styles.section}>
                <Text style={styles.label}>Seats</Text>
                <Text style={styles.helperText}>
                  Enter 0 to mark as unavailable, or number of available seats
                </Text>
                <CommonTextInput
                  control={control}
                  name="localException.seats"
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save exception</Text>
              </TouchableOpacity>
            </View>
            {/* Reusable Calendar Modals */}
            <CalendarPickerModal
              visible={showStartCalendar}
              onClose={() => setShowStartCalendar(false)}
              onSelectDate={handleStartDateChange}
              selectedDate={startDate}
              minDate={getTodayDateString()}
              title="Select Start Date"
            />

            <CalendarPickerModal
              visible={showEndCalendar}
              onClose={() => setShowEndCalendar(false)}
              onSelectDate={handleEndDateChange}
              selectedDate={endDate}
              minDate={startDate || getTodayDateString()}
              title="Select End Date"
            />
          </SafeAreaView>
        </FormProvider>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6b7280',
    fontWeight: '300',
  },
  modalContent: {
    flex: 1,
  },
  modalContentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  helperText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
    minHeight: 48,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#111827',
  },
  disabledButton: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  disabledText: {
    color: '#9ca3af',
  },
  disabledSelect: {
    opacity: 0.5,
  },
  timeSelect: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  saveButton: {
    paddingVertical: 16,
    backgroundColor: '#10b981',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
