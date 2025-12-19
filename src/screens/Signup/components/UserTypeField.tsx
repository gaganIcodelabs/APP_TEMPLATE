import { AppConfig } from '@redux/slices/hostedAssets.slice';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type UserTypeOption = AppConfig['user']['userTypes'][number];

type Props = {
  hasExistingUserType: boolean;
  userTypes: UserTypeOption[];
  onUserTypeChange?: (userType: string) => void;
  value?: string;
};

export const UserTypeField: React.FC<Props> = ({
  hasExistingUserType,
  userTypes,
  onUserTypeChange,
  value,
}) => {
  const hasMultipleUserTypes = userTypes.length > 1;

  return !hasExistingUserType && hasMultipleUserTypes ? (
    <>
      <Text style={styles.label}>I want to be</Text>
      <View style={styles.userTypeContainer}>
        {userTypes.map(type => (
          <TouchableOpacity
            key={type.userType}
            style={[
              styles.userTypeOption,
              value === type.userType && styles.userTypeOptionSelected,
            ]}
            onPress={() => {
              onUserTypeChange?.(type.userType);
            }}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.radio,
                value === type.userType && styles.radioSelected,
              ]}
            >
              {value === type.userType && <View style={styles.radioDot} />}
            </View>
            <Text
              style={[
                styles.userTypeLabel,
                value === type.userType && styles.userTypeLabelSelected,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  ) : (
    <View style={styles.hidden} />
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#333',
  },
  userTypeContainer: {
    marginBottom: 16,
  },
  userTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  userTypeOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F7FF',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#007AFF',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  userTypeLabel: {
    fontSize: 16,
    color: '#333',
  },
  userTypeLabelSelected: {
    color: '#007AFF',
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12,
  },
  hidden: {
    display: 'none',
  },
});
