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
  selected?: boolean; // Add selected flag
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
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          {/* Header */}
          {(title || subTitle || headerLeftIcon || headerRightIcon) && (
            <View style={styles.header}>
              {headerLeftIcon && <Image source={headerLeftIcon} style={styles.headerIcon} />}
              <View style={styles.headerTextContainer}>
                {title && <Text style={styles.title}>{title}</Text>}
                {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
              </View>
              {headerRightIcon && <Image source={headerRightIcon} style={styles.headerIcon} />}
            </View>
          )}

          {/* Options List */}
          <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
            {options.map((option, index) =>
              'OptionComponent' in option ? (
                <View key={index}>{option.OptionComponent}</View>
              ) : 'name' in option ? (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    option.containerStyle,
                  ]}
                  onPress={() => {
                    option.onPress?.();
                    setModalVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    {option.leftIcon && (
                      <Image source={option.leftIcon} style={styles.optionLeftIcon} />
                    )}
                    <Text style={[styles.optionText, option.textStyle]}>{option.name}</Text>
                  </View>
                  {option.rightIcon ? (
                    <Image source={option.rightIcon} style={styles.optionRightIcon} />
                  ) : option.selected ? (
                    <Text style={styles.checkmark}>✓</Text>
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
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  headerTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionLeftIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  optionRightIcon: {
    width: 20,
    height: 20,
    marginLeft: 12,
  },
  checkmark: {
    fontSize: 20,
    color: '#1e40af',
    fontWeight: 'bold',
    marginLeft: 12,
  },
});
