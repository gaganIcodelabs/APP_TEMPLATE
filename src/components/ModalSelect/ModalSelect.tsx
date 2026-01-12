import CommonModal from '@components/CommonModal/CommonModal';
import { CommonText } from '@components/CommonText/CommonText';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface ModalSelectProps {
  control: any;
  name: string;
  labelTranslationKey?: string;
  labelValue?: string;
  style?: StyleProp<ViewStyle>;
  rightIcon?: ImageSourcePropType;
  rightIconStyle?: StyleProp<ImageStyle>;
  onRightLabelPress?: () => void;
  inputContainerStyle?: ViewStyle;
  rightLabelTranslationKey?: string;
  labelStyle?: StyleProp<TextStyle>;
  rightLabelStyle?: StyleProp<TextStyle>;
  rightLabelValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  options: { label: string; value: string }[];
}

export const ModalSelect: React.FC<ModalSelectProps> = ({
  control,
  name,
  labelTranslationKey,
  labelValue,
  rightIcon,
  rightIconStyle,
  rightLabelValue,
  onRightLabelPress,
  inputContainerStyle,
  rightLabelTranslationKey,
  rightLabelStyle,
  labelStyle,
  placeholder = 'Select...',
  style,
  disabled = false,
  options,
  onValueChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const isDisabled = disabled || options.length === 0;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={style}>
          {(labelTranslationKey || labelValue || rightLabelTranslationKey || rightLabelValue) && (
            <View style={styles.labelContainer}>
              {(labelTranslationKey || labelValue) && (
                <CommonText style={labelStyle}>
                  {labelTranslationKey ? t(labelTranslationKey) : labelValue}
                </CommonText>
              )}
              {(rightLabelTranslationKey || rightLabelValue) && (
                <TouchableOpacity onPress={onRightLabelPress}>
                  <Text style={rightLabelStyle}>
                    {rightLabelTranslationKey
                      ? t(rightLabelTranslationKey)
                      : rightLabelValue}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.selectButton,
              isDisabled && styles.selectButtonDisabled,
              inputContainerStyle,
            ]}
            onPress={() => !isDisabled && setIsOpen(true)}
            disabled={isDisabled}
          >
            <Text
              style={[
                styles.selectText,
                !value && styles.placeholderText,
                isDisabled && styles.disabledText,
              ]}
            >
              {value
                ? options.find(opt => opt.value === value)?.label
                : placeholder}
            </Text>
            {rightIcon ? (
              <Image source={rightIcon} style={rightIconStyle} />
            ) : (
              <Text style={[styles.arrow, isDisabled && styles.disabledText]}>▼</Text>
            )}
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error.message}</Text>}
          <CommonModal
            visible={isOpen}
            setModalVisible={setIsOpen}
            title={labelTranslationKey ? t(labelTranslationKey) : labelValue}
            options={options.map(opt => ({
              name: opt.label,
              value: opt.value,
              selected: opt.value === value,
              containerStyle: opt.value === value ? styles.selectedOption : undefined,
              textStyle: opt.value === value ? styles.selectedOptionText : undefined,
              onPress: () => {
                onChange(opt.value);
                if (onValueChange) {
                  onValueChange(opt.value);
                }
                setIsOpen(false);
              },
            }))}
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
    minHeight: 48,
  },
  selectButtonDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  selectText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  placeholderText: {
    color: '#9ca3af',
  },
  disabledText: {
    color: '#d1d5db',
  },
  arrow: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
    marginLeft: 4,
  },
  selectedOption: {
    backgroundColor: '#dbeafe',
  },
  selectedOptionText: {
    color: '#1e40af',
    fontWeight: '600',
  },
});
