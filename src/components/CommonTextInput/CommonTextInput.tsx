import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CommonText } from '@components/CommonText/CommonText';

interface TextInputFieldProps extends TextInputProps {
  control: any;
  name: string;
  labelKey?: string;
  labelValue?: string;
  isPassword?: boolean;
  style?: StyleProp<ViewStyle>;
  rightIcon?: ImageSourcePropType;
  rightIconStyle?: ImageStyle;
  onRightLabelPress?: () => void;
  inputContainerStyles?: ViewStyle;
  rightLabelKey?: string;
  labelStyle?: TextStyle;
  rightLabelStyle?: TextStyle;
  rightLabelValue?: string;
  onTextChange?: (text: string, cb: (value: string | number) => void) => void;
}

export const CommonTextInput = ({
  control,
  name,
  labelKey,
  labelValue,
  isPassword = false,
  style = {},
  onRightLabelPress = () => {},
  onTextChange,
  inputContainerStyles = {},
  rightLabelKey,
  rightLabelValue,
  labelStyle = {},
  rightLabelStyle = {},
  rightIcon,
  rightIconStyle,
  ...textInputProps
}: TextInputFieldProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const placeholder = textInputProps.placeholder
    ? t(textInputProps.placeholder)
    : undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <View style={[styles.container, style]}>
          {(labelKey || labelValue) && (
            <View style={styles.labelContainer}>
              {(labelKey || labelValue) && (
                <CommonText style={[styles.text, labelStyle]}>
                  {labelKey ? t(labelKey) : labelValue}
                </CommonText>
              )}
              {(rightLabelKey || rightLabelValue) && (
                <TouchableOpacity onPress={onRightLabelPress}>
                  <Text style={[styles.text, rightLabelStyle]}>
                    {rightLabelKey ? t(rightLabelKey) : rightLabelValue}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View
            style={[
              styles.inputContainer,
              inputContainerStyles,
              //   isFocused && { borderColor: colors.marketplaceColor },
              //   multiline && {
              //     height: undefined,
              //     minHeight: (150),
              //     maxHeight: (250),
              //     alignItems: 'flex-start',
              //     paddingVertical: (10),
              //   },
            ]}
          >
            {rightIcon && (
              <Image
                style={[styles.rightIcon, rightIconStyle]}
                source={rightIcon}
              />
            )}
            <TextInput
              value={
                value === undefined || value === null
                  ? ''
                  : typeof value === 'number'
                  ? value.toString()
                  : value
              }
              onChangeText={text => {
                if (onTextChange) {
                  onTextChange(text, onChange);
                } else {
                  if (
                    textInputProps.keyboardType === 'numeric' ||
                    textInputProps.keyboardType == 'phone-pad' ||
                    textInputProps.keyboardType == 'number-pad'
                  ) {
                    onChange(Number(text));
                  } else {
                    onChange(text);
                  }
                }
              }}
              onBlur={() => onBlur()}
              placeholderTextColor={'grey'}
              secureTextEntry={isPassword && !showPassword}
              placeholder={placeholder}
              style={[styles.input]}
              allowFontScaling={false}
              {...textInputProps}
            />
            {isPassword && (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text>icons</Text>
                {/* show eye open or close icons */}
                {/* <Image
                  style={styles.icon}
                  source={showPassword ? eyeOpen : eyeClose}
                /> */}
              </TouchableOpacity>
            )}
          </View>
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  inputContainer: {
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchValueStyle: {
    marginTop: 5,
    alignSelf: 'flex-end',
    color: 'grey',
    marginLeft: 5,
    flexShrink: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    color: 'black',
    fontSize: 16,
  },
  icon: {
    fontSize: 20,
    marginLeft: 16,
  },
  labelContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightIcon: {
    height: 16,
    width: 16,
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12,
  },
});
