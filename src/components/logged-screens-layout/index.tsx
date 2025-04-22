import {Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../constant/Colors';
import {useAppSelector} from '../../hooks/useRedux';
import Home from '../../screens/home';
import ModalPopover from '../modal';
import DeleteFolder from '../delete-folder';

import ChatScreen from '../../screens/chat';

import {PickedFile} from '../../utils/functions';


// Define the props type
interface IProp {
  toggleDrawer: (key: 'left' | 'right' | 'top') => void;
   uploadFile: () => void;
  ClearFile: any;
  file: any;
  id: string | undefined;
}

const HomeLayout = ({toggleDrawer, id}: IProp) => {
  return (
    <View>
      {id ? <ChatScreen id={id} /> : <Home   ClearFile={ClearFile}
        uploadFile={uploadFile}
        file={file } toggleDrawer={toggleDrawer} />}
    </View>
  );
};

export default HomeLayout;

const styles = StyleSheet.create({});
