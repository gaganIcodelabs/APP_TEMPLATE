import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AvailabilityPlan, AvailabilityPlanEntry } from '../../types/editListingForm.type';
import { TimeSlotEntry } from './index';

interface DayScheduleEntryProps {
  dayOfWeek: string;
  dayLabel: string;
  localPlan: AvailabilityPlan;
  setLocalPlan: (plan: AvailabilityPlan) => void;
}

export const DayScheduleEntry: React.FC<DayScheduleEntryProps> = ({ 
  dayOfWeek, 
  dayLabel,
  localPlan,
  setLocalPlan,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const entries = localPlan.entries || [];
  const dayEntries = entries.filter((e: AvailabilityPlanEntry) => e.dayOfWeek === dayOfWeek);
  const hasEntries = dayEntries.length > 0;

  // Auto-expand when day has entries
  React.useEffect(() => {
    if (hasEntries) {
      setIsExpanded(true);
    }
  }, [hasEntries]);

  const handleToggleDay = () => {
    if (hasEntries) {
      // Remove all entries for this day
      const newEntries = entries.filter((e: AvailabilityPlanEntry) => e.dayOfWeek !== dayOfWeek);
      setLocalPlan({
        ...localPlan,
        entries: newEntries,
      });
      setIsExpanded(false);
    } else {
      // Add first entry for this day
      const newEntry: AvailabilityPlanEntry = {
        dayOfWeek: dayOfWeek as any,
        startTime: '',
        endTime: '',
        seats: 1,
      };
      setLocalPlan({
        ...localPlan,
        entries: [...entries, newEntry],
      });
      setIsExpanded(true);
    }
  };

  const handleAddAnother = () => {
    const newEntry: AvailabilityPlanEntry = {
      dayOfWeek: dayOfWeek as any,
      startTime: '',
      endTime: '',
      seats: 1,
    };
    setLocalPlan({
      ...localPlan,
      entries: [...entries, newEntry],
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dayHeader}
        onPress={handleToggleDay}
        activeOpacity={0.7}
      >
        <View style={styles.checkboxContainer}>
          <View style={[styles.checkbox, hasEntries && styles.checkboxChecked]}>
            {hasEntries && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.dayLabel}>{dayLabel}</Text>
        </View>
      </TouchableOpacity>

      {hasEntries && isExpanded && (
        <View style={styles.entriesContainer}>
          <Text style={styles.selectTimeLabel}>Select time</Text>
          {dayEntries.map((entry, index) => {
            const entryIndex = entries.findIndex(
              (e: AvailabilityPlanEntry) =>
                e.dayOfWeek === dayOfWeek &&
                e.startTime === entry.startTime &&
                e.endTime === entry.endTime &&
                entries.indexOf(e) === entries.indexOf(entry)
            );
            return (
              <TimeSlotEntry
                key={`${dayOfWeek}-${index}`}
                dayOfWeek={dayOfWeek}
                entryIndex={entryIndex}
                entry={entry}
                localPlan={localPlan}
                setLocalPlan={setLocalPlan}
              />
            );
          })}
          <TouchableOpacity style={styles.addAnotherButton} onPress={handleAddAnother}>
            <Text style={styles.addAnotherText}>+ Add another</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 16,
  },
  dayHeader: {
    paddingVertical: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  entriesContainer: {
    marginTop: 12,
    marginLeft: 32,
  },
  selectTimeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  addAnotherButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  addAnotherText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '500',
  },
});

