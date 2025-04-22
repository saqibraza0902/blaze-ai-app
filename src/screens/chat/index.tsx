import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {get_folders, single_conversation} from '../../utils/functions';
import {token} from '../../mock';
import {handleApiError} from '../../utils/error';
import {setChat, setFolders} from '../../redux/slices/conversation';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import Toast from 'react-native-simple-toast';
import {IMessages} from '../../utils/types';
import ChatMessages from '../../components/chat-messages';
interface IProp {
  id: string;
  // toggleDrawer: (key: 'left' | 'right' | 'top') => void;
}
const ChatScreen = ({id}: IProp) => {
  const dispatch = useAppDispatch();
  const {chats} = useAppSelector(s => s.convo);
  useEffect(() => {
    const getData = async () => {
      try {
        if (id) {
          const res = await single_conversation(token, id as string);
          console.log(res);
          // socket?.emit('join_conversation', {
          //   conversation_id: id,
          // });
          // const member = memberstack?.getCurrentMember();
          // const abc = await member?.then(el => el.data);
          // console.log('Member', abc);
          const newdata = {
            conversation_id: res.conversation_id,
            messages: res.messages,
          };
          if (res?.messages.length > 0) {
            dispatch(setChat(newdata));
          }
        }
        const data = await get_folders(token);
        dispatch(setFolders(data.folders));
      } catch (error) {
        const err = handleApiError(error);
        Toast.show(err, 500);
      }
    };

    if (token) {
      getData();
    }
  }, [id]);
  return (
    <View>
      {/* <Text onPress={() => toggleDrawer('left')}>Open</Text> */}
      <Text style={{color: '#fff'}}>ChatScreen</Text>
      <ScrollView>
        {chats?.messages?.map((e: IMessages, i: number) => {
          return <ChatMessages e={e} i={i} />;
        })}
      </ScrollView>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
