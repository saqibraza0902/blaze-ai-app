import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {PREDEFINED_COLORS, STATIC_COLORS} from '../../constant/Colors';
import ColorDropdown from '../../ui/form/colors-select';
import CustomPicker from '../custom-picker';
import ColorSelect from '../../ui/form/colors-select';
// import { IFolder } from '../../utils/types';
interface IFolder {
  id: number | null;
  name: string;
  color: string;
}
interface EditFolderProps {
  folder: IFolder | null;
  handleClose: () => void;
}

const EditFolder = ({folder, handleClose}: EditFolderProps) => {
  const [folderData, setFolderData] = useState<IFolder | null>({
    id: folder?.id || null,
    name: folder?.name || '',
    color: folder?.color || '',
  });
  const [loading, setloading] = useState(false);
  useEffect(() => {
    if (folder) {
      setFolderData(folder);
    }
  }, [folder]);
  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.title}>Edit your folder</Text>
        <TouchableOpacity onPress={handleClose}>
          {/* For React Native, you might use a different icon component */}
          <Text style={styles.closeIcon}>×</Text>
          {/* Or use an icon from react-native-vector-icons */}
          {/* <Icon name="close" size={24} color="white" /> */}
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Enter Folder name"
          value={folderData?.name}
          onChangeText={text =>
            folderData && setFolderData({...folderData, name: text})
          }
          style={styles.input}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Color</Text>
        <ColorSelect
          data={PREDEFINED_COLORS}
          defaultButtonText={folderData?.color}
          onSelect={(clr: string) => {
            if (folderData) {
              setFolderData({...folderData, color: clr});
            }
          }}
          rowTextForSelection={(item: {name: 'Colors'}) => item.name}
        />
        {/* {folderData && (
          <ColorDropdown
            colors={PREDEFINED_COLORS}
            setFolderData={data => {
              setFolderData({...folderData, ...data});
            }}
            folderData={folderData}
          />
        )} */}

        <TouchableOpacity
          disabled={loading}
          onPress={() => console.log('object')}
          style={[
            styles.button,
            {backgroundColor: STATIC_COLORS.blue_300},
            loading && styles.disabledButton,
          ]}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  closeIcon: {
    fontSize: 24,
    color: 'white',
  },
  formContainer: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent',
    height: 48,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EditFolder;
