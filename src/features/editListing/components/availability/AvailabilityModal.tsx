import { EditListingForm, AvailabilityPlan } from "@features/editListing/types/editListingForm.type";
import { useFormContext } from "react-hook-form";
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TimeZoneSelector } from "./TimeZoneSelector";
import { DayScheduleEntry } from "./DayScheduleEntry";
import { useState, useEffect } from "react";

/**
 * Modal for editing availability schedule
 */
interface AvailabilityModalProps {
  visible: boolean;
  onClose: () => void;
  timezone: string;
  weekdays: readonly { key: string; label: string }[];
}

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  visible,
  onClose,
  timezone,
  weekdays,
}) => {
  const { setValue, getValues } = useFormContext<EditListingForm>();
  
  // Local state to hold changes until save
  const [localPlan, setLocalPlan] = useState<AvailabilityPlan | null>(null);

  // Initialize local state when modal opens
  useEffect(() => {
    if (visible) {
      const currentPlan = getValues('availabilityPlan');
      // If no plan exists, create a default one for local editing
      setLocalPlan(currentPlan || {
        type: 'availability-plan/time',
        timezone,
        entries: [],
        exceptions: [],
      });
    }
  }, [visible, timezone, getValues]);

  const handleTimezoneChange = (newTimezone: string) => {
    if (localPlan) {
      setLocalPlan({
        ...localPlan,
        timezone: newTimezone,
      });
    }
  };

  const handleSaveSchedule = () => {
    // Save local changes to form context
    if (localPlan) {
      setValue('availabilityPlan', localPlan);
    }
    onClose();
  };

  const handleCancel = () => {
    // Discard changes by not saving
    setLocalPlan(null);
    onClose();
  };

  if (!localPlan) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={styles.modalSafeArea} edges={['top']}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Edit default schedule</Text>
          <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.modalContent} 
          contentContainerStyle={styles.modalContentContainer}
          showsVerticalScrollIndicator={true}
        >
          <TimeZoneSelector
            value={localPlan.timezone}
            onChange={handleTimezoneChange}
          />

          <Text style={styles.sectionHeading}>Weekly default schedule</Text>

          {weekdays.map(({ key, label }) => (
            <DayScheduleEntry
              key={key}
              dayOfWeek={key}
              dayLabel={label}
              localPlan={localPlan}
              setLocalPlan={setLocalPlan}
            />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveSchedule}>
            <Text style={styles.saveButtonText}>Save schedule</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
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
    paddingBottom: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  saveButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});