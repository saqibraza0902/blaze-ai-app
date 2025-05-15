import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../constant/Colors';
import {useAppSelector} from '../../hooks/useRedux';
import Home from '../../screens/home';
import ModalPopover from '../modal';
import DeleteFolder from '../delete-folder';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ChatScreen from '../../screens/chat';

import {PickedFile} from '../../utils/functions';
import {IConversations, IFolder} from '../../utils/types';

// Define the props type
interface IProp {
  toggleDrawer: (key: 'left' | 'right' | 'top') => void;
  uploadFile: () => void;
  ClearFile: any;
  file: any;
  id: string | undefined;
  onChangeText: any;
  inputValue: any;
  renameConvo: (id: string) => void;
  sharedUsers: (f: IFolder | null, c: IConversations | null) => void;
  handleSend: () => void;
}

const HomeLayout = ({
  toggleDrawer,
  id,
  ClearFile,
  file,
  uploadFile,
  onChangeText,
  inputValue,
  renameConvo,
  sharedUsers,
  handleSend,
}: IProp) => {
  const {height} = Dimensions.get('window');
  return (
    <KeyboardAvoidingView behavior="position">
      <View style={{height: height}}>
        {id ? (
          <ChatScreen
            id={id}
            toggleDrawer={toggleDrawer}
            uploadFile={uploadFile}
            ClearFile={ClearFile}
            file={file}
            onChangeText={onChangeText}
            inputValue={inputValue}
            renameConvo={renameConvo}
            sharedUsers={sharedUsers}
            handleSend={handleSend}
          />
        ) : (
          <Home
            ClearFile={ClearFile}
            uploadFile={uploadFile}
            file={file}
            toggleDrawer={toggleDrawer}
            onChangeText={onChangeText}
            inputValue={inputValue}
            handleSend={handleSend}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default HomeLayout;

const styles = StyleSheet.create({});
