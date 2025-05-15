import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {IConversations, IFolder} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {
  get_folders,
  list_conversations,
  move_convo_folder,
} from '../../utils/functions';
import Toast from 'react-native-simple-toast';
import {setConversation, setFolders} from '../../redux/slices/conversation';
// import {token} from '../../mock';
import {handleApiError} from '../../utils/error';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FolderSelect from '../../ui/form/select/folder-select';
import {STATIC_COLORS} from '../../constant/Colors';
// import {useAppDispatch, useAppSelector} from '@/hooks/Hooks';
// import {setConversation, setFolders} from '@/redux/slices/conversation';

// import {handleApiError} from '@/utils/handleApiErrors';
// import {IConversations, IFolder} from '@/utils/types';
// import {RxCross1} from 'react-icons/rx';
// import {toast} from 'react-toastify';
// import Loader from 'react-dots-loader';

interface IProp {
  handleClose: () => void;
  convo: IConversations | null;
  folder?: IFolder | null;
}

interface IMyFolder {
  id: number | null;
  name: string;
  color: string;
}

const MoveConversation = ({handleClose, convo, folder}: IProp) => {
  const fId = folder?.id || convo?.folder_id;
  const fname = folder?.name || convo?.folder_name;
  const {folders} = useAppSelector(s => s.convo);
  const {token} = useAppSelector(s => s.user);
  const dispatch = useAppDispatch();
  const {theme} = useAppSelector(s => s.theme);
  const [loading, setloading] = useState(false);
  const [myfolder, setMyfolder] = useState<IMyFolder>({
    id: fId ? fId : null,
    name: fname ? fname : '',
    color: '',
  });
  const convoId = convo?.conversation_id;

  const handleSubmit = async () => {
    setloading(true);
    if (!myfolder.id) {
      setloading(false);
      return Toast.show('Please select a folder', 500);
    }
    try {
      const data = await move_convo_folder(
        token,
        myfolder.id,
        convoId ? convoId : '',
      );
      const convo = await list_conversations(token);

      dispatch(setConversation(convo?.conversations));
      const res = await get_folders(token);
      dispatch(setFolders(res.folders));
      handleClose();
      Toast.show(data.status, 500);
    } catch (error) {
      const err = handleApiError(error);
      Toast.show(err, 500);
    } finally {
      setloading(false);
    }
  };

  if (folder) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Move your conversation to {folder.name}
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <AntDesign
              name="close"
              size={24}
              color={theme === 'dark' ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleClose}
            disabled={loading}
            style={[styles.button, styles.cancelButton]}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={[styles.button, styles.moveButton]}>
            {loading ? (
              <ActivityIndicator size={10} />
            ) : (
              <Text style={styles.buttonText}>Move</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  } else if (folder === undefined) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Move your conversation</Text>
        <TouchableOpacity onPress={handleClose}>
          <AntDesign
            name="close"
            size={24}
            color={theme === 'dark' ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>
      {folders.length === 0 ? (
        <Text style={styles.noFoldersText}>
          Please create a folder to continue
        </Text>
      ) : (
        <View style={styles.folderContainer}>
          <Text style={styles.label}>Folder</Text>
          <FolderSelect
            data={folders}
            folderData={myfolder}
            defaultButtonText="Select a folder"
            setFolderData={setMyfolder}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={[styles.button, styles.moveButton]}>
            {loading ? (
              <ActivityIndicator size={10} />
            ) : (
              <Text style={styles.buttonText}>Move</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  folderContainer: {
    gap: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    // flex: 1,
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  moveButton: {
    backgroundColor: STATIC_COLORS.salate_300,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  label: {
    color: 'white',
    fontSize: 14,
  },
  noFoldersText: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default MoveConversation;
