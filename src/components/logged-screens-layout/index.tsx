import {Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../constant/Colors';
import {useAppSelector} from '../../hooks/useRedux';
import Home from '../../screens/home';
import ModalPopover from '../modal';

// Define the props type
interface IProp {
  toggleDrawer: (key: 'left' | 'right' | 'top') => void;
  delFolder: {
    open: boolean;
    id: string;
  };
  delClose: () => void;
}

const HomeLayout = ({toggleDrawer, delFolder, delClose}: IProp) => {
  return (
    <SafeAreaProvider>
      <Home toggleDrawer={toggleDrawer} />
      <ModalPopover onClose={delClose} open={delFolder.open}>
        <View>
          <Text>Do you want to delete with folder id {delFolder.id}</Text>
        </View>
      </ModalPopover>
    </SafeAreaProvider>
  );
};

export default HomeLayout;

const styles = StyleSheet.create({});
