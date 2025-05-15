import {Modal, StyleSheet, Text, View} from 'react-native';
import React, {Children, useEffect, useState} from 'react';
import {RightDrawer} from '../../components/right-drawer';
import {TopDrawer} from '../../components/top-drawer';
import {LeftDrawer} from '../../components/left-drawer';
import HomeLayout from '../../components/logged-screens-layout';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../constant/Colors';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {IConversations, IFolder} from '../../utils/types';
import ModalPopover from '../../components/modal';
import EditFolder from '../../components/edit-folder';
import SharedUsers from '../../components/shared-users';
import uuid from 'react-native-uuid';
import DeleteFolder from '../../components/delete-folder';

import {PickedFile, pickSingleFile} from '../../utils/functions';
import Toast from 'react-native-simple-toast';
import MoveConversation from '../../components/move-conversation';
import RenameConvo from '../../components/rename-convo';
import DeleteConversation from '../../components/delete-conversation';
import {socket} from '../../socket';
import {updateChat} from '../../redux/slices/conversation';
import {useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import {fileToByteArray} from '../../utils/blob-converter';
import SocketProvider from '../socket-provider';
import CreateFolder from '../../components/create-folder';
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
interface IMoveConvo {
  convo: IConversations | null;
  folder?: IFolder | null;
  open: boolean;
}
interface IDelConvo {
  open: boolean;
  id: string | null;
}
const DrawerProvider = (params: any) => {
  const id = params?.route?.params?.id;

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
  const [moveConvo, setMoveConvo] = useState<IMoveConvo>({
    convo: null,
    folder: null,
    open: false,
  });
  const [renameConvo, setRenameConvo] = useState({
    id: '',
    open: false,
  });
  const [delConvo, setDelConvo] = useState<IDelConvo>({
    id: null,
    open: false,
  });

  const [fileupload, setFileupload] = useState<any>();
  const colors = Colors[theme];
  const [file, setFile] = useState<null>(null);
  const [isCreateOpen, setIscreateOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const {user} = useAppSelector(s => s.user);
  const {conversation_setting, image} = useAppSelector(s => s.convo);
  const {model, focus, ratio} = useAppSelector(s => s.model);
  // Single function to toggle any drawer
  const nav: any = useNavigation();

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

  /* ___Upload File ___ */
  const uploadFile = async () => {
    const file = await pickSingleFile({maxSizeMB: 1});
    if (file) {
      setFileupload(file);
      Toast.show('File Uploaded', Toast.LONG);
    } else {
      console.log('No file picked or operation cancelled.');
    }
  };
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) {
      return console.log('No socket');
    }
    const initializeSocket = async () => {
      socket?.off('new_message');

      socket?.on('new_message', messageData => {
        console.log('New message received:', messageData);

        if (messageData.message.sender.id === 'assistant') {
          const transformObj = {
            conversation_id: messageData.conversation_id,
            messages: {
              loading: messageData.message.loading,
              content: messageData.message.content,
              image: messageData.message.image,
              video: messageData.message.video,
              sender: messageData.message.sender,
              citations: messageData.message.citations,
              timestamp: messageData.message.timestamp,
              model_used: messageData.message.model_used,
              summary: messageData?.message?.summary || '',
            },
          };
          return dispatch(updateChat(transformObj));
        } else if (messageData.message.sender.id !== 'assistant') {
          const questionObj = {
            conversation_id: messageData.conversation_id,
            messages: {
              content: messageData.message.content,
              sender: messageData.message.sender,
              pdf: messageData.message.pdf,
              image: messageData.message.image,
              citations: [],
              loading: messageData.message.loading,
              timestamp: messageData.message.timestamp,
            },
          };
          return dispatch(updateChat(questionObj));
        }
      });

      socket?.on('cascade_stopped', data => {
        Toast.show('Cascade Stopped', 500);
      });
      socket?.on('conversation_created', resp => {
        console.log('conversation_created =>', resp);
      });
      socket?.on('connect_error', async err => {
        if (
          err.message === 'unauthorized' ||
          /Authentication failed/i.test(err.message)
        ) {
          //  router.push('/login');
          //  memberstack?.logout();
          //  dispatch(setConvoNull());
          //  dispatch(setLogout());
          //  dispatch(setTokenNull());
          //  localStorage.removeItem('focus');
          //  localStorage.removeItem('token');
          //  localStorage.removeItem('modal');
        }
      });

      socket?.on('error', errData => {
        Toast.show(errData.message, 500);
      });
    };
    initializeSocket();
  }, [socket]);

  // utils/blob-converter.ts
  const fileToChunks = async (
    uri: string,
    chunkSize = 1024 * 100, // 100KB chunks
  ): Promise<ArrayBuffer[]> => {
    const fileInfo = await RNFS.stat(uri);
    const fileSize = fileInfo.size;
    const chunks: ArrayBuffer[] = [];
    let offset = 0;

    while (offset < fileSize) {
      const chunkEnd = Math.min(offset + chunkSize, fileSize);
      const base64Chunk = await RNFS.read(uri, chunkSize, offset, 'base64');

      // Convert base64 chunk to ArrayBuffer
      const binaryString = atob(base64Chunk);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      chunks.push(bytes.buffer);
      offset = chunkEnd;
    }

    return chunks;
  };

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64); // Decode base64 to binary string
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    console.log('object', bytes);
    return bytes; // Return ArrayBuffer
  };
  const handleSend = async () => {
    try {
      const payload: any = {
        message: inputValue.trim(),
        model_preference: model,
        plan_id: user?.planConnections[0]?.planId,
        temp_id: uuid.v4(),
        focus_mode: focus || null,
      };
      if (focus === 'generate_video' && ratio !== '') {
        payload.vid_ratio = ratio;
      }
      if (focus === 'image_generation' && image.size !== '') {
        payload.img_size = image.size;
        payload.img_n = image.n;
      }
      if (!socket?.connected) {
        console.log('Socket not connected');
      }

      if (id) {
        payload.conversation_id = id;
        if (fileupload) {
          const base64Data = await RNFS.readFile(fileupload.uri, 'base64');

          // Convert to ArrayBuffer
          // const arrayBuffer = base64ToArrayBuffer(base64Data);
          const resfile = await fileToByteArray(fileupload.uri, 'array');
          payload.filename = fileupload?.name;
          // payload.fileData = arrayBuffer;
          console.log('Emitting file payload:', payload);
          socket?.emit('send_message', {...payload, fileData: resfile});
          console.log('Working here', payload, socket);
          setInputValue('');
          setFileupload(null);
        } else {
          console.log('else Working here', payload, socket);
          socket?.emit('send_message', payload);
          setInputValue('');
        }
      } else {
        let dataToSend = {
          conversation_type: conversation_setting.mode,
          models_present: conversation_setting.models,
          max_cascade:
            conversation_setting.cascade === 0
              ? 3
              : conversation_setting.cascade,
          delay_seconds:
            conversation_setting.delay === 0 ? 0 : conversation_setting.delay,
        };
        console.log('Data to send', dataToSend);
        socket?.emit('create_conversation', dataToSend);
        console.log('Working here', payload, socket);

        socket?.once('conversation_created', async data => {
          nav.navigate('Home', {id: data.conversation_id});
          if (data && data.conversation_id) {
            payload.conversation_id = data.conversation_id;

            if (fileupload) {
              const resfile = await fileToByteArray(fileupload.uri, 'array');
              payload.filename = fileupload?.name;
              payload.fileData = resfile;
              setInputValue('');
              setFileupload(null);
            } else {
              socket?.emit('send_message', payload);
              setInputValue('');
            }
          } else {
            console.log('Server did not provide a conversation_id!', 'system');
          }
        });
      }
    } catch (error: any) {
      console.error('Error in handleSend:', error);
      Toast.show(error, 500);
    }
  };
  return (
    <SocketProvider>
      <SafeAreaProvider>
        <SafeAreaView
          edges={['right', 'left', 'top', 'bottom']}
          style={{flex: 1, backgroundColor: colors.screenbg}}>
          <LeftDrawer
            id={id}
            handleDelFol={id => setDelFolder({id: id.toString(), open: true})}
            editOpen={(f: IFolder) => setIsEditFolder({folder: f, open: true})}
            sharedUsers={(f, c) =>
              setShareFolder({open: true, folder: f, conversation: c})
            }
            moveConvo={(convo, f) =>
              setMoveConvo({convo: convo, folder: f, open: true})
            }
            visible={drawers.left}
            onClose={closeAllDrawers}
            toggleDelete={id => setDelConvo({id: id, open: true})}
            renameConvo={id => setRenameConvo({id: id, open: true})}
            createFolderOpen={() => setIscreateOpen(true)}
          />
          <RightDrawer
            id={id}
            visible={drawers.right}
            onClose={closeAllDrawers}
          />
          <TopDrawer visible={drawers.top} onClose={closeAllDrawers} />

          <View>
            <HomeLayout
              id={id}
              toggleDrawer={key => toggleDrawer(key)}
              uploadFile={uploadFile}
              ClearFile={() => setFileupload(undefined)}
              file={fileupload}
              onChangeText={(text: any) => setInputValue(text)}
              inputValue={inputValue}
              renameConvo={id => setRenameConvo({id: id, open: true})}
              sharedUsers={(f, c) =>
                setShareFolder({open: true, folder: f, conversation: c})
              }
              handleSend={handleSend}
            />

            <ModalPopover
              backgroundColor="#000"
              onClose={() => setDelFolder({id: '', open: false})}
              open={delFolder.open}>
              <DeleteFolder
                handleClose={() => setDelFolder({id: '', open: false})}
                id={delFolder.id ? Number(delFolder.id) : null}
              />
            </ModalPopover>
            <ModalPopover
              backgroundColor="#1e1e1e"
              onClose={() => setIscreateOpen(false)}
              open={isCreateOpen}>
              <CreateFolder
                blazeMaxOpen={() => console.log('object')}
                handleClose={() => setIscreateOpen(false)}
              />
            </ModalPopover>
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
                  setShareFolder({
                    folder: null,
                    open: false,
                    conversation: null,
                  })
                }
              />
            </ModalPopover>
            <ModalPopover
              backgroundColor="#000"
              onClose={() => setMoveConvo({convo: null, open: false})}
              open={moveConvo.open}>
              <MoveConversation
                folder={moveConvo.folder}
                convo={moveConvo.convo}
                handleClose={() => setMoveConvo({convo: null, open: false})}
              />
            </ModalPopover>
            <ModalPopover
              ContainerStyle={{width: '100%'}}
              onClose={() => setRenameConvo({id: '', open: false})}
              open={renameConvo.open}>
              <RenameConvo
                handleClose={() => setRenameConvo({id: '', open: false})}
                id={renameConvo.id}
              />
            </ModalPopover>
            <ModalPopover
              backgroundColor="#000"
              open={delConvo.open}
              onClose={() => setDelConvo({id: null, open: false})}>
              <DeleteConversation
                handleClose={() => setDelConvo({id: null, open: false})}
                id={delConvo.id}
              />
            </ModalPopover>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </SocketProvider>
  );
};

export default DrawerProvider;

const styles = StyleSheet.create({});
