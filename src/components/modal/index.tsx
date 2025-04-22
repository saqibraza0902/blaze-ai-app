import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {Modal} from 'react-native';
import {Colors} from '../../constant/Colors';
import {useAppSelector} from '../../hooks/useRedux';

interface IProp {
  open?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  ContainerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}
const ModalPopover = ({
  children,
  onClose,
  open,
  ContainerStyle,
  backgroundColor,
}: IProp) => {
  const {theme} = useAppSelector(s => s.theme);
  const colors = Colors[theme];

  // Use the passed backgroundColor if provided, otherwise use the theme color
  const containerBackgroundColor = backgroundColor || colors.popoverbg;

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View
          style={[
            styles.menuContainer,

            {
              backgroundColor: !backgroundColor
                ? colors.popoverbg
                : backgroundColor,
            },
            ContainerStyle,
          ]}>
          {children}
        </View>
      </Pressable>
    </Modal>
  );
};

export default ModalPopover;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuContainer: {
    borderRadius: 16,
    width: '90%',
    padding: 16,
    gap: 25,
    zIndex: 40,
  },
  modalContentView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
