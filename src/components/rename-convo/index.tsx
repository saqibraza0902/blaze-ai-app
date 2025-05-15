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
import {list_conversations, rename_conversation} from '../../utils/functions';
import {setConversation} from '../../redux/slices/conversation';
import {handleApiError} from '../../utils/error';
import ModalPopover from '../modal';
// import {token} from '../../mock';
import {STATIC_COLORS} from '../../constant/Colors';
import Toast from 'react-native-simple-toast';

interface IProp {
  id: string;
  handleClose: () => void;
}

const RenameConvo = ({id, handleClose}: IProp) => {
  const {token} = useAppSelector(s => s.user);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = await rename_conversation(token, id, name);

      Toast.show('Rename Successfully', Toast.LONG);

      const res = await list_conversations(token);
      dispatch(setConversation(res?.conversations));
      handleClose();
    } catch (error) {
      const err = handleApiError(error);
      Toast.show(`There is Some Issue: ${err}`, Toast.LONG);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
        style={styles.input}
        placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size={20} color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Rename</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: 'white',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: 'transparent',
    color: 'white',
  },
  button: {
    height: 48,
    backgroundColor: STATIC_COLORS.blue_300, // brand_gray-200 equivalent

    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RenameConvo;
