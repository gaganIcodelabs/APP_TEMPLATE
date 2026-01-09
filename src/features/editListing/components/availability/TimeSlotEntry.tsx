import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AvailabilityPlan, AvailabilityPlanEntry } from '../../types/editListingForm.type';
import { CommonSelect } from '@components/index';
import { generateTimeOptions, getTimeOptionsAfter } from '../../utils/timeUtils';

const TIME_OPTIONS = generateTimeOptions(true);

interface TimeSlotEntryProps {
  dayOfWeek: string;
  entryIndex: number;
  entry: AvailabilityPlanEntry;
  localPlan: AvailabilityPlan;
  setLocalPlan: (plan: AvailabilityPlan) => void;
}

export const TimeSlotEntry: React.FC<TimeSlotEntryProps> = ({ 
  entryIndex, 
  entry,
  localPlan,
  setLocalPlan,
}) => {
  const entries = localPlan.entries || [];

  const handleUpdateEntry = (field: keyof AvailabilityPlanEntry, value: string | number) => {
    const newEntries = [...entries];
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
    
    setLocalPlan({
      ...localPlan,
      entries: newEntries,
    });
  };

  const handleDelete = () => {
    const newEntries = entries.filter((_, index) => index !== entryIndex);
    setLocalPlan({
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
          <CommonSelect
            value={entry.startTime}
            onChange={(value: string) => handleUpdateEntry('startTime', value)}
            options={TIME_OPTIONS.slice(0, -1)}
            placeholder="Start"
          />
        </View>

        <Text style={styles.dash}>–</Text>

        <View style={styles.selectWrapper}>
          <CommonSelect
            value={entry.endTime}
            onChange={(value: string) => handleUpdateEntry('endTime', value)}
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
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectWrapper: {
    flex: 1,
  },
  dash: {
    marginHorizontal: 8,
    fontSize: 16,
    color: '#666',
  },
  nextDayLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  seatsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginRight: 12,
    width: 60,
  },
  seatsInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  deleteText: {
    color: '#f44336',
    fontSize: 14,
    fontWeight: '500',
  },
});
