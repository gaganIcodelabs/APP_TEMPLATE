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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  // const selectedOption = options.find(opt => opt.value === value);
  // const displayText = selectedOption ? selectedOption.label : placeholder;
  const isDisabled = disabled || options.length === 0;

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <View style={style}>
            {(labelTranslationKey || labelValue) && (
              <View>
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
                style,
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
              ) : null}
            </TouchableOpacity>
            {error && <Text>{error.message}</Text>}
            <CommonModal
              visible={isOpen}
              setModalVisible={setIsOpen}
              title={labelTranslationKey}
              options={options.map(opt => ({
                name: opt.label,
                value: opt.value,
                onPress: () => {
                  onChange(opt.value);
                  setIsOpen(false);
                },
              }))}
            />
          </View>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  selectButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  selectText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  disabledText: {
    color: '#bbb',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionItemSelected: {
    backgroundColor: '#E3F2FD',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#2196F3',
    fontWeight: '600',
  },
});
