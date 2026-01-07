import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';

export interface SessionLengthPickerProps {
  /**
   * Current value in minutes
   */
  value?: number;
  
  /**
   * Callback when value changes
   */
  onChange?: (minutes: number) => void;
  
  /**
   * Label to display above the picker
   */
  label?: string;
  
  /**
   * Whether the field is disabled
   */
  disabled?: boolean;
  
  /**
   * Error message to display
   */
  error?: string;
}

const MAX_HOURS = 12;
const MINUTE_OPTIONS = [0, 15, 30, 45];

const getDurationFactors = (durationInMinutes: number = 60): [number, number] => {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  return [hours, minutes];
};

const getDurationInMinutes = (hours: number, minutes: number): number => {
  if (hours === 0 && minutes === 0) {
    return 0;
  }
  return hours * 60 + minutes;
};

export const SessionLengthPicker: React.FC<SessionLengthPickerProps> = ({
  value = 60,
  onChange,
  label = 'Session length',
  disabled = false,
  error,
}) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [showHoursPicker, setShowHoursPicker] = useState(false);
  const [showMinutesPicker, setShowMinutesPicker] = useState(false);

  // Initialize from value
  useEffect(() => {
    const [h, m] = getDurationFactors(value);
    setHours(h);
    setMinutes(m);
  }, [value]);

  const handleHoursChange = (newHours: number) => {
    setHours(newHours);
    const newDuration = getDurationInMinutes(newHours, minutes);
    onChange?.(newDuration);
    setShowHoursPicker(false);
  };

  const handleMinutesChange = (newMinutes: number) => {
    setMinutes(newMinutes);
    const newDuration = getDurationInMinutes(hours, newMinutes);
    onChange?.(newDuration);
    setShowMinutesPicker(false);
  };

  const hourOptions = Array.from({ length: MAX_HOURS + 1 }, (_, i) => i);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.pickersContainer}>
        {/* Hours Picker */}
        <View style={styles.pickerWrapper}>
          <TouchableOpacity
            style={[styles.pickerButton, error && styles.pickerError]}
            onPress={() => !disabled && setShowHoursPicker(true)}
            disabled={disabled}
          >
            <Text style={styles.pickerButtonText}>
              {hours} {hours === 1 ? 'hour' : 'hours'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Minutes Picker */}
        <View style={styles.pickerWrapper}>
          <TouchableOpacity
            style={[styles.pickerButton, error && styles.pickerError]}
            onPress={() => !disabled && setShowMinutesPicker(true)}
            disabled={disabled}
          >
            <Text style={styles.pickerButtonText}>
              {minutes} {minutes === 1 ? 'minute' : 'minutes'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Hours Modal */}
      <Modal
        visible={showHoursPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHoursPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowHoursPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Hours</Text>
              <TouchableOpacity onPress={() => setShowHoursPicker(false)}>
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsList}>
              {hourOptions.map(h => (
                <TouchableOpacity
                  key={h}
                  style={[
                    styles.optionItem,
                    hours === h && styles.optionItemSelected,
                  ]}
                  onPress={() => handleHoursChange(h)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      hours === h && styles.optionTextSelected,
                    ]}
                  >
                    {h} {h === 1 ? 'hour' : 'hours'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Minutes Modal */}
      <Modal
        visible={showMinutesPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMinutesPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMinutesPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Minutes</Text>
              <TouchableOpacity onPress={() => setShowMinutesPicker(false)}>
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsList}>
              {MINUTE_OPTIONS.map(m => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.optionItem,
                    minutes === m && styles.optionItemSelected,
                  ]}
                  onPress={() => handleMinutesChange(m)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      minutes === m && styles.optionTextSelected,
                    ]}
                  >
                    {m} {m === 1 ? 'minute' : 'minutes'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#333',
  },
  pickersContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  pickerWrapper: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  pickerError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalClose: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionItemSelected: {
    backgroundColor: '#F0F7FF',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#007AFF',
    fontWeight: '500',
  },
});
