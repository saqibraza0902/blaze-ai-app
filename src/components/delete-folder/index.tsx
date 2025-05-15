import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {STATIC_COLORS} from '../../constant/Colors';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {delete_folder, get_folders} from '../../utils/functions';
import {setFolders} from '../../redux/slices/conversation';
import {handleApiError} from '../../utils/error';
import Toast from 'react-native-simple-toast';
interface IProp {
  handleClose: () => void;
  id: number | null;
}
const DeleteFolder: React.FC<IProp> = ({handleClose, id}) => {
  const [loading, setloading] = useState(false);
  const {token} = useAppSelector(s => s.user);
  const dispatch = useAppDispatch();
  const handleDelete = async () => {
    try {
      setloading(true);
      const data = await delete_folder(token, Number(id));
      const res = await get_folders(token);
      dispatch(setFolders(res.folders));
      handleClose();
      Toast.show('Folder deleted successfully', Toast.LONG);

      // toast.success(data.message);
    } catch (error) {
      const err = handleApiError(error);
      // toast.error(err);
      console.log('Error deleting folder', err);
    } finally {
      setloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.delText}>Do you want to delete this folder</Text>
      <View style={styles.btnContainer}>
        <Pressable
          onPress={handleClose}
          style={[styles.btnBox, {backgroundColor: STATIC_COLORS.salate_300}]}>
          <Text style={styles.text}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleDelete}
          style={[styles.btnBox, {backgroundColor: STATIC_COLORS.red}]}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.text}>Delete</Text>
          )}
          {/* <Text style={styles.text}>Delete</Text> */}
        </Pressable>
      </View>
    </View>
  );
};

export default DeleteFolder;

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  delText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  btnContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  btnBox: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    padding: 10,
  },
  text: {
    color: '#fff',
    fontWeight: '500',
  },
});
