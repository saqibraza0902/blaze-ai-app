import {Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../constant/Colors';
import {useAppSelector} from '../../hooks/useRedux';
import Home from '../../screens/home';
import ModalPopover from '../modal';
import DeleteFolder from '../delete-folder';
import {PickedFile} from '../../utils/functions';

// Define the props type
interface IProp {
  toggleDrawer: (key: 'left' | 'right' | 'top') => void;
  delFolder: {
    open: boolean;
    id: string;
  };
  delClose: () => void;
  uploadFile: () => void;
  ClearFile: any;
  file: any;
}

const HomeLayout = ({
  toggleDrawer,
  delFolder,
  delClose,
  uploadFile,
  ClearFile,
  file,
}: IProp) => {
  console.log('logscree', file);
  return (
    <SafeAreaProvider>
      <Home
        toggleDrawer={toggleDrawer}
        ClearFile={ClearFile}
        uploadFile={uploadFile}
        file={file }
      />
      <ModalPopover
        backgroundColor="#000"
        onClose={delClose}
        open={delFolder.open}>
        <DeleteFolder />
      </ModalPopover>
    </SafeAreaProvider>
  );
};

export default HomeLayout;

const styles = StyleSheet.create({});
