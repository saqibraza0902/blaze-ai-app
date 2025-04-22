import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ModalPopover from '../modal';
import {token} from '../../mock';
import {delete_file} from '../../utils/functions';
import Toast from 'react-native-simple-toast';
interface DeletePropos {
  open: boolean;
  onClose: () => void;
  fileId: any;
  FileName: string;
}
const DeletePdfFile: React.FC<DeletePropos> = ({
  open,
  onClose,
  FileName,
  fileId,
}) => {
  const [loading, setloading] = useState(false);
  const onDeleteFile = async (id: string) => {
    try {
      setloading(true);
      const res = await delete_file(token, id);
      //  console.log(data);
      //  const newData = data.filter((item: any) => item.id !== id);
      //  setData(newData);
      Toast.show('Delete Successfully', Toast.LONG);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
      onClose();
    }
  };
  return (
    <ModalPopover
      open={open}
      onClose={onClose}
      ContainerStyle={{width: '100%', height: 'auto'}}>
      <View>
        <View>
          <Text style={styles.TextStyle}>Are you sure you want to delete</Text>
          <Text style={styles.TextStyle}>" {FileName} "</Text>
          <Text style={styles.TextStyle}>from the knowledge base?</Text>
        </View>
        <View style={styles.ButtonWraper}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.ButtonStyle, {backgroundColor: '#6B7280'}]}>
            <Text style={styles.ButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDeleteFile(fileId)}
            style={[styles.ButtonStyle, {backgroundColor: '#EF4444'}]}>
            {loading ? (
              <>
                <ActivityIndicator size={'small'} color={'white'} />
              </>
            ) : (
              <>
                <Text style={styles.ButtonText}>Delete</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ModalPopover>
  );
};

export default DeletePdfFile;

const styles = StyleSheet.create({
  TextStyle: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
  },
  ButtonWraper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 15,
  },
  ButtonText: {fontSize: 14, color: 'white', textAlign: 'center'},
  ButtonStyle: {padding: 13, borderRadius: 15, flex: 1},
});
