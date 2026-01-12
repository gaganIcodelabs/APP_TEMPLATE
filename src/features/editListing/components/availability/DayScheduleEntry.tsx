import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFormContext, useWatch } from 'react-hook-form';
import { AvailabilityPlan, AvailabilityPlanEntry, EditListingForm } from '../../types/editListingForm.type';
import { TimeSlotEntry } from './index';

interface DayScheduleEntryProps {
  dayOfWeek: string;
  dayLabel: string;
}

export const DayScheduleEntry: React.FC<DayScheduleEntryProps> = ({ 
  dayOfWeek, 
  dayLabel,
}) => {
  const { control, setValue, getValues } = useFormContext<{ localPlan: AvailabilityPlan }>();
  const [isExpanded, setIsExpanded] = useState(false);

  const entries = useWatch({
    control,
    name: 'localPlan',
    compute: (data: EditListingForm['availabilityPlan'])=>{
      return data?.entries;
    }
  }) as AvailabilityPlanEntry[];

  const dayEntries = entries.filter((e: AvailabilityPlanEntry) => e.dayOfWeek === dayOfWeek);
  const hasEntries = dayEntries.length > 0;

  // Auto-expand when day has entries
  React.useEffect(() => {
    if (hasEntries) {
      setIsExpanded(true);
    }
  }, [hasEntries]);

  const handleToggleDay = () => {
    const localPlan = getValues('localPlan');
    if (hasEntries) {
      // Remove all entries for this day
      const newEntries = entries.filter((e: AvailabilityPlanEntry) => e.dayOfWeek !== dayOfWeek);
      setValue('localPlan', {
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
      setValue('localPlan', {
        ...localPlan,
        entries: [...entries, newEntry],
      });
      setIsExpanded(true);
    }
  };

  const handleAddAnother = () => {
    const localPlan = getValues('localPlan');
    const newEntry: AvailabilityPlanEntry = {
      dayOfWeek: dayOfWeek as any,
      startTime: '',
      endTime: '',
      seats: 1,
    };
    setValue('localPlan', {
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
                entryIndex={entryIndex}
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
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 20,
  },
  dayHeader: {
    paddingVertical: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  entriesContainer: {
    marginTop: 16,
    marginLeft: 36,
  },
  selectTimeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addAnotherButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  addAnotherText: {
    color: '#3b82f6',
    fontSize: 15,
    fontWeight: '600',
  },
});
