import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useFormContext, useWatch } from 'react-hook-form';
import { AvailabilityPlan, AvailabilityPlanEntry, EditListingForm } from '../../types/editListingForm.type';
import { ModalSelect } from '@components/index';
import { generateTimeOptions } from '@util/timeUtils';
import { getTimeOptionsAfter } from '@util/timeUtils';

const TIME_OPTIONS = generateTimeOptions(true);

interface TimeSlotEntryProps {
  entryIndex: number;
}

export const TimeSlotEntry: React.FC<TimeSlotEntryProps> = ({ 
  entryIndex,
}) => {
  const { control, setValue, getValues } = useFormContext<{ localPlan: AvailabilityPlan }>();


  const entry = useWatch({
      control,
      name: 'localPlan',
      compute: (data: EditListingForm['availabilityPlan'])=>{
        return data?.entries[entryIndex];
      }
    }) as AvailabilityPlanEntry;

  if (!entry) return null;

  const handleUpdateEntry = (field: keyof AvailabilityPlanEntry, value: string | number) => {
    const localPlan = getValues('localPlan');

    const newEntries = [...localPlan.entries];
    newEntries[entryIndex] = {
      ...newEntries[entryIndex],
      [field]: value,
    };
    
    // If updating start time, clear end time if it's now invalid
    if (field === 'startTime' && typeof value === 'string') {
      const currentEndTime = newEntries[entryIndex].endTime;
      if (currentEndTime && currentEndTime <= value) {
        newEntries[entryIndex].endTime = '';
      }
    }
    
    setValue('localPlan', {
      ...localPlan,
      entries: newEntries,
    });
  };

  const handleDelete = () => {
    const localPlan = getValues('localPlan');
    const newEntries = localPlan.entries.filter((_, index) => index !== entryIndex);
    setValue('localPlan', {
      ...localPlan,
      entries: newEntries,
    });
  };

  // Filter end time options based on start time
  const endTimeOptions = getTimeOptionsAfter(entry.startTime, TIME_OPTIONS);

  return (
    <View style={styles.container}>
      <View style={styles.timeRow}>
        <View style={styles.selectWrapper}>
          <ModalSelect
            control={control}
            name={`localPlan.entries.${entryIndex}.startTime`}
            options={TIME_OPTIONS.slice(0, -1)}
            placeholder="Start"
            onValueChange={(value) => {
              // Clear end time if it becomes invalid
              const currentEndTime = entry.endTime;
              if (currentEndTime && currentEndTime <= value) {
                setValue(`localPlan.entries.${entryIndex}.endTime`, '');
              }
            }}
          />
        </View>

        <Text style={styles.dash}>–</Text>

        <View style={styles.selectWrapper}>
          <ModalSelect
            control={control}
            name={`localPlan.entries.${entryIndex}.endTime`}
            options={endTimeOptions}
            placeholder="End"
          />
        </View>
      </View>

      {entry.endTime === '24:00' && (
        <Text style={styles.nextDayLabel}>+1 day</Text>
      )}

      <View style={styles.seatsRow}>
        <Text style={styles.seatsLabel}>Seats</Text>
        <TextInput
          style={styles.seatsInput}
          value={entry.seats?.toString() || '1'}
          onChangeText={(text) => {
            const seats = parseInt(text, 10) || 1;
            handleUpdateEntry('seats', seats);
          }}
          keyboardType="numeric"
          placeholder="1"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>🗑 Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  selectWrapper: {
    flex: 1,
  },
  dash: {
    marginHorizontal: 12,
    fontSize: 18,
    color: '#6b7280',
    marginTop: 14,
  },
  nextDayLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
    fontStyle: 'italic',
    paddingLeft: 4,
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  seatsLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginRight: 12,
    width: 60,
  },
  seatsInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#111827',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
  },
});
