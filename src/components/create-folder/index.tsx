import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {create_folder, get_folders} from '../../utils/functions';
import Toast from 'react-native-simple-toast';
import {setFolders} from '../../redux/slices/conversation';
import {handleApiError} from '../../utils/error';
import {PREDEFINED_COLORS} from '../../constant/Colors';
import ColorSelect from '../../ui/form/colors-select';
import AntDesign from 'react-native-vector-icons/AntDesign';
interface IProp {
  handleClose: () => void;
  blazeMaxOpen: () => void;
}

const CreateFolder = ({handleClose, blazeMaxOpen}: IProp) => {
  // const {token} = useAppSelector(s => s.modal);
  const {user, token} = useAppSelector(s => s.user);
  const [loading, setLoading] = useState(false);
  const [folderData, setFolderData] = useState({
    name: '',
    color: '',
  });
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    setLoading(true);
    if (!folderData.color && !folderData.name) {
      setLoading(false);
      return Toast.show('Color & Name should not be empty', 500);
    }
    try {
      const data = await create_folder(token, folderData);
      const res = await get_folders(token);
      dispatch(setFolders(res.folders));
      handleClose();
      Toast.show(data.status, 500);
    } catch (error) {
      const err = handleApiError(error);
      Toast.show(err, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create a new folder</Text>
        <TouchableOpacity onPress={handleClose}>
          <AntDesign name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Enter Folder name"
          placeholderTextColor="#999"
          value={folderData.name}
          onChangeText={text => setFolderData({...folderData, name: text})}
          style={styles.input}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Color</Text>
        <ColorSelect
          data={PREDEFINED_COLORS}
          defaultButtonText={folderData.color || 'Please select a folder'}
          onSelect={(clr: string) => {
            if (folderData) {
              setFolderData({...folderData, color: clr});
            }
          }}
          rowTextForSelection={(item: {name: 'Colors'}) => item.name}
          // onSelect={setFolderData}
          // folderData={folderData}
        />
      </View>

      <TouchableOpacity
        disabled={loading}
        onPress={() => {
          if (user?.planConnections[0].type === 'FREE') {
            blazeMaxOpen();
          } else {
            handleSubmit();
          }
        }}
        style={styles.button}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e', // Assuming dark theme from your original
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    backgroundColor: 'transparent',
    height: 48,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#333', // brand_gray-200 equivalent
    height: 48,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CreateFolder;
