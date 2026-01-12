import { EditListingForm, AvailabilityPlan } from "@features/editListing/types/editListingForm.type";
import { useFormContext, FormProvider, useForm } from "react-hook-form";
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TimeZoneSelector } from "./TimeZoneSelector";
import { DayScheduleEntry } from "./DayScheduleEntry";
import { useEffect } from "react";

/**
 * Modal for editing availability schedule
 */
interface AvailabilityModalProps {
  visible: boolean;
  onClose: () => void;
  timezone: string;
  weekdays: readonly { key: string; label: string }[];
}

type LocalFormData = {
  localPlan: AvailabilityPlan;
};

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  visible,
  onClose,
  timezone,
  weekdays,
}) => {
  const { setValue, getValues } = useFormContext<EditListingForm>();
  
  // Get default timezone - use provided timezone or fallback to user's timezone
  const getDefaultTimezone = () => {
    if (timezone) return timezone;
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };
  
  // Create a local form for the modal
  const localFormMethods = useForm<LocalFormData>({
    defaultValues: {
      localPlan: {
        type: 'availability-plan/time',
        timezone: getDefaultTimezone(),
        entries: [],
        exceptions: [],
      }
    }
  });

  // Initialize local form when modal opens
  useEffect(() => {
    if (visible) {
      const currentPlan = getValues('availabilityPlan');
      const defaultTimezone = getDefaultTimezone();
      
      // If there's an existing plan, use it; otherwise create new with default timezone
      const planToUse = currentPlan && currentPlan.timezone 
        ? currentPlan 
        : {
            type: 'availability-plan/time' as const,
            timezone: defaultTimezone,
            entries: currentPlan?.entries || [],
            exceptions: currentPlan?.exceptions || [],
          };
      
      localFormMethods.reset({
        localPlan: planToUse
      });
    }
  }, [visible, timezone, getValues, localFormMethods]);

  const handleSaveSchedule = () => {
    // Save local changes to parent form context
    const localPlan = localFormMethods.getValues('localPlan');
    setValue('availabilityPlan', localPlan);
    onClose();
  };

  const handleCancel = () => {
    // Discard changes by not saving
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={handleCancel}
    >
      <FormProvider {...localFormMethods}>
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
            <TimeZoneSelector />

            <Text style={styles.sectionHeading}>Weekly default schedule</Text>

            {weekdays.map(({ key, label }) => (
              <DayScheduleEntry
                key={key}
                dayOfWeek={key}
                dayLabel={label}
              />
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveSchedule}>
              <Text style={styles.saveButtonText}>Save schedule</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </FormProvider>
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
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#6b7280',
  },
  modalContent: {
    flex: 1,
  },
  modalContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 32,
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  saveButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
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
