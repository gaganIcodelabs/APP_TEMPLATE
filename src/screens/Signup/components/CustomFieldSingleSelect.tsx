import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { CustomUserFieldInputProps } from '@appTypes/config';
import { SignupFormValues } from '../Signup.types';
import { Control, Controller } from 'react-hook-form';
import { getLabel } from './CustomExtendedDataField';

interface CustomFieldSingleSelectProps
  extends Omit<CustomUserFieldInputProps, 'key' | 'defaultRequiredMessage'> {
  control: Control<SignupFormValues>;
}

const CustomFieldSingleSelect = ({
  control,
  fieldConfig,
  name,
}: CustomFieldSingleSelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Get options from config or use default options for testing
  const { enumOptions = [], saveConfig } = fieldConfig || {};
  const { placeholderMessage } = saveConfig || {};
  const placeholder = placeholderMessage || 'Select an option';
  const label = getLabel(fieldConfig);

  // Add default options if none exist (for testing)
  const options =
    enumOptions.length > 0
      ? enumOptions
      : [
          { option: 'option1', label: 'Option 1' },
          { option: 'option2', label: 'Option 2' },
          { option: 'option3', label: 'Option 3' },
        ];

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={styles.container}>
          {label && <Text style={styles.label}>{label}</Text>}

          <TouchableOpacity
            style={[styles.selectField, error && styles.selectFieldError]}
            onPress={openModal}
          >
            <Text style={[styles.selectText, !value && styles.placeholderText]}>
              {value
                ? options.find(option => option.option === value)?.label ||
                  value
                : placeholder}
            </Text>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>{error.message}</Text>}

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={closeModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {label || 'Select Option'}
                  </Text>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.optionsList}>
                  {options.map(item => (
                    <TouchableOpacity
                      key={item.option}
                      style={[
                        styles.optionItem,
                        value === item.option && styles.selectedOption,
                      ]}
                      onPress={() => {
                        onChange(item.option);
                        closeModal();
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          value === item.option && styles.selectedOptionText,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {value === item.option && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={closeModal}
                >
                  <Text style={styles.modalCloseButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
    fontWeight: '500',
  },
  selectField: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  selectFieldError: {
    borderColor: 'red',
  },
  selectText: {
    fontSize: 16,
    color: 'black',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
  },
  optionText: {
    fontSize: 16,
    color: 'black',
    flex: 1,
  },
  selectedOptionText: {
    color: '#1976d2',
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 18,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    margin: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default CustomFieldSingleSelect;
