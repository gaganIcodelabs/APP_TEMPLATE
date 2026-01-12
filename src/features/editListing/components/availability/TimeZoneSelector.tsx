import React from 'react';
import { ModalSelect } from '@components/index';
import { useFormContext } from 'react-hook-form';

// Common timezones
const COMMON_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Madrid',
  'Europe/Rome',
  'Europe/Amsterdam',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Singapore',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland',
  'America/Toronto',
  'America/Vancouver',
  'America/Mexico_City',
  'America/Sao_Paulo',
  'Africa/Cairo',
  'Africa/Johannesburg',
];

/**
 * TimeZoneSelector Component
 * Uses form control to select timezone
 */
export const TimeZoneSelector: React.FC = () => {
  const { control } = useFormContext();

  const options = COMMON_TIMEZONES.map(tz => ({ label: tz, value: tz }));
  return (
    <ModalSelect
      control={control}
      name="localPlan.timezone"
      options={options}
      placeholder="Pick a timezone..."
      labelValue="Select a time zone"
    />
  );
};
