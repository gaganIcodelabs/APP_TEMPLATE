import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

export const CommonText: React.FC<TextProps> = props => {
  return (
    <Text {...props} allowFontScaling={false}>
      {props.children}
    </Text>
  );
};
