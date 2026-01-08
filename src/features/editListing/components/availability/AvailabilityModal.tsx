import { EditListingForm } from "@features/editListing/types/editListingForm.type";
import { useFormContext } from "react-hook-form";
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TimeZoneSelector } from "./TimeZoneSelector";
import { DayScheduleEntry } from "./DayScheduleEntry";

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

  const handleTimezoneChange = (newTimezone: string) => {
    const availabilityPlan = getValues('availabilityPlan')
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