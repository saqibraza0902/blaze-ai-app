import {Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../constant/Colors';
import {useAppSelector} from '../../hooks/useRedux';
import Home from '../../screens/home';
import ModalPopover from '../modal';
import DeleteFolder from '../delete-folder';
import ChatScreen from '../../screens/chat';

// Define the props type
interface IProp {
  toggleDrawer: (key: 'left' | 'right' | 'top') => void;

  id: string | undefined;
}

const HomeLayout = ({toggleDrawer, id}: IProp) => {
  return (
    <View>
      {id ? <ChatScreen id={id} /> : <Home toggleDrawer={toggleDrawer} />}
    </View>
  );
};

export default HomeLayout;

const styles = StyleSheet.create({});
