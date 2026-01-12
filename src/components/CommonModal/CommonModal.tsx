/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Image,
  ImageRequireSource,
  Modal,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

export type CommonModalOption = {
  onPress: () => void;
} & (
  | {
      name?: string | undefined;
      containerStyle?: StyleProp<ViewStyle>;
      textStyle?: StyleProp<TextStyle>;
      rightIcon?: ImageRequireSource;
      leftIcon?: ImageRequireSource;
    }
  | {
      OptionComponent: React.ReactNode;
    }
);

export type CommonModalProps = {
  transparent?: boolean;
  onDismiss?: () => void;
  visible: boolean;
  setModalVisible: (visible: boolean) => void;
  title?: string | undefined;
  subTitle?: string;
  headerRightIcon?: ImageRequireSource;
  showHeaderRightIcon?: boolean;
  headerLeftIcon?: ImageRequireSource;
  showHeaderLeftIcon?: boolean;
  options: Array<CommonModalOption>;
};

const CommonModal: React.FC<CommonModalProps> = ({
  onDismiss,
  visible,
  setModalVisible,
  title,
  subTitle,
  headerRightIcon,
  headerLeftIcon,
  transparent = true,
  options,
}: CommonModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      >
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {headerLeftIcon ? <Image source={headerLeftIcon} /> : null}
            <View>
              {title ? <Text>{title}</Text> : null}
              {subTitle ? <Text>{subTitle}</Text> : null}
            </View>
            {headerRightIcon ? <Image source={headerRightIcon} /> : null}
          </View>
          <ScrollView>
            {options.map((option, index) =>
              'OptionComponent' in option ? (
                option.OptionComponent
              ) : 'name' in option ? (
                <TouchableOpacity
                  key={index}
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    },
                    option.containerStyle,
                  ]}
                  onPress={() => {
                    option.onPress?.();
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {option.leftIcon ? (
                      <Image source={option.leftIcon} />
                    ) : null}
                    <Text style={option.textStyle}>{option.name}</Text>
                  </View>
                  {option.rightIcon ? (
                    <Image source={option.rightIcon} />
                  ) : null}
                </TouchableOpacity>
              ) : null,
            )}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CommonModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
