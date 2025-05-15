import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
  Platform,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {useNavigation} from '@react-navigation/native';
import {api, list_conversations} from '../../utils/functions';
// import {token} from '../../mock';
import {setConversation, setNull} from '../../redux/slices/conversation';
import {handleApiError} from '../../utils/error';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import {useAppDispatch, useAppSelector} from '@/hooks/Hooks';
// import {setConversation, setNull} from '@/redux/slices/conversation';
// import {list_conversations} from '@/utils/functions';
// import {useRouter} from 'expo-router'; // or 'next/navigation' if SSR
// import {handleApiError} from '@/utils/handleApiErrors';
// import {api} from '@/api';
// import {Ionicons} from '@expo/vector-icons'; // Or any icon lib

interface IProp {
  handleClose: () => void;
  id: string | null;
}

const DeleteConversation = ({handleClose, id}: IProp) => {
  const {token} = useAppSelector(s => s.user);
  const dispatch = useAppDispatch();
  const {theme} = useAppSelector(s => s.theme);
  const [loading, setLoading] = useState(false);
  const router = useNavigation();

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${api}/api/delete_chat`, {
        method: 'DELETE',
        body: JSON.stringify({conversation_id: id}),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        const mydata = await list_conversations(token);
        dispatch(setConversation(mydata.conversations));
        dispatch(setNull());
        showToast(data.message);
        handleClose();
        // @ts-ignore
        router.navigate('Home');
      }
    } catch (error) {
      const err = handleApiError(error);
      showToast(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // Handle iOS or use a custom toast component
      console.log('Toast:', message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Are you sure you want to delete this conversation?
        </Text>
        <TouchableOpacity style={{width: '10%'}} onPress={handleClose}>
          <AntDesign
            name="close"
            size={24}
            color={theme === 'dark' ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Delete</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    gap: 15,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    width: '5%',
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    backgroundColor: 'gray',
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: 'red',
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default DeleteConversation;
