import {Modal, StyleSheet, Text, View} from 'react-native';
import React, {Children, useState} from 'react';
import {RightDrawer} from '../../components/right-drawer';
import {TopDrawer} from '../../components/top-drawer';
import {LeftDrawer} from '../../components/left-drawer';
import HomeLayout from '../../components/logged-screens-layout';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../constant/Colors';
import {useAppSelector} from '../../hooks/useRedux';
import {IConversations, IFolder} from '../../utils/types';
import ModalPopover from '../../components/modal';
import EditFolder from '../../components/edit-folder';
import SharedUsers from '../../components/shared-users';
import {PickedFile, pickSingleFile} from '../../utils/functions';
import Toast from 'react-native-simple-toast';

type DrawerType = 'left' | 'right' | 'top';
interface IEditFolder {
  open: boolean;
  folder: IFolder | null;
}
interface IShare {
  folder: null | IFolder;
  open: boolean;
  conversation: null | IConversations;
}
const DrawerProvider = () => {
  const {theme} = useAppSelector(s => s.theme);
  const [delFolder, setDelFolder] = useState({
    open: false,
    id: '',
  });
  const [isEditfolder, setIsEditFolder] = useState<IEditFolder>({
    open: false,
    folder: null,
  });
  const [drawers, setDrawers] = useState({
    left: false,
    right: false,
    top: false,
  });
  const [shareFolder, setShareFolder] = useState<IShare>({
    open: false,
    folder: null,
    conversation: null,
  });
  const [fileupload, setFileupload] = useState<PickedFile | undefined>();
  // Single function to toggle any drawer
  const toggleDrawer = (drawer: DrawerType) => {
    console.log(drawer);
    setDrawers(prev => ({
      ...prev,
      [drawer]: !prev[drawer],
    }));
  };

  // Function to close all drawers
  const closeAllDrawers = () => {
    setDrawers({
      left: false,
      right: false,
      top: false,
    });
  };
  const colors = Colors[theme];
  /* ___Upload File ___ */
  const uploadFile = async () => {
    const file = await pickSingleFile({maxSizeMB: 10});
    if (file) {
      setFileupload(file);
      Toast.show('File Uploaded', Toast.LONG);
    } else {
      console.log('No file picked or operation cancelled.');
    }
  };
  // console.log('uploadedfile', fileupload);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.screenbg}}>
        <LeftDrawer
          handleDelFol={id => setDelFolder({id: id.toString(), open: true})}
          editOpen={(f: IFolder) => setIsEditFolder({folder: f, open: true})}
          sharedUsers={(f, c) =>
            setShareFolder({open: true, folder: f, conversation: c})
          }
          visible={drawers.left}
          onClose={closeAllDrawers}
        />
        <RightDrawer visible={drawers.right} onClose={closeAllDrawers} />
        <TopDrawer visible={drawers.top} onClose={closeAllDrawers} />

        <View>
          <HomeLayout
            delClose={() => setDelFolder({id: '', open: false})}
            toggleDrawer={key => toggleDrawer(key)}
            delFolder={delFolder}
            uploadFile={uploadFile}
            ClearFile={() => setFileupload(undefined)}
            file={fileupload}
          />
          <ModalPopover
            backgroundColor="#000"
            onClose={() => setIsEditFolder({folder: null, open: false})}
            open={isEditfolder.open}>
            <EditFolder
              folder={isEditfolder.folder}
              handleClose={() => setIsEditFolder({folder: null, open: false})}
            />
          </ModalPopover>
          <ModalPopover
            backgroundColor="#000"
            onClose={() =>
              setShareFolder({folder: null, open: false, conversation: null})
            }
            open={shareFolder.open}>
            <SharedUsers
              conversation={shareFolder.conversation}
              folder={shareFolder.folder}
              newsOpen={() => {}}
              // newsOpen={() => setNews({id: 1, open: true})}
              handleClose={() =>
                setShareFolder({folder: null, open: false, conversation: null})
              }
            />
          </ModalPopover>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default DrawerProvider;

const styles = StyleSheet.create({});
