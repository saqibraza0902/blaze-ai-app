import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Modal} from 'react-native';
import {Colors} from '../../constant/Colors';
import {useAppSelector} from '../../hooks/useRedux';

interface IProp {
  open?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}
const ModalPopover = ({children, onClose, open}: IProp) => {
  const {theme} = useAppSelector(s => s.theme);
  const colors = Colors[theme];
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View
          style={[styles.menuContainer, {backgroundColor: colors.popoverbg}]}>
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
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    padding: 20, // Optional: Add some padding around the modal
  },
  menuContainer: {
    borderRadius: 16,
    width: '80%',
    padding: 16,
    gap: 25,
    zIndex: 40,
    height: 400,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  modalContentView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
