import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {get_folders, single_conversation} from '../../utils/functions';
// import {token} from '../../mock';
import {handleApiError} from '../../utils/error';
import {
  resetConvoSettings,
  setChat,
  setFolders,
  setNull,
  setResetConvoUser,
} from '../../redux/slices/conversation';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import Toast from 'react-native-simple-toast';
import {IConversations, IFolder, IMessages} from '../../utils/types';
import ChatMessages from '../../components/chat-messages';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import NewChatIcon from '../../ui/icons/new-chat-icon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {resetConvoSettings} from '../../redux/slices/model';
import {useNavigation} from '@react-navigation/native';
import BubbleSubmitBox from '../../components/bubble-submit-box';
import {Colors} from '../../constant/Colors';
import GroupChatIcon from '../../ui/icons/group-chat-icon';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {socket} from '../../socket';
import VideoAspectRatio from '../../components/video-aspect-ratio';
import ImageAspectRatio from '../../components/img-aspect-ratio';
import {he} from 'date-fns/locale';
interface IProp {
  id: string;
  toggleDrawer: (key: 'left' | 'right' | 'top') => void;
  uploadFile: () => void;
  ClearFile: any;
  file: any;
  onChangeText: any;
  inputValue: any;
  renameConvo: (id: string) => void;
  sharedUsers: (f: IFolder | null, c: IConversations | null) => void;
  handleSend: () => void;
}
const ChatScreen = ({
  id,
  toggleDrawer,
  ClearFile,
  file,
  inputValue,
  onChangeText,
  uploadFile,
  renameConvo,
  sharedUsers,
  handleSend,
}: IProp) => {
  const dispatch = useAppDispatch();
  const {chats, conversation_setting} = useAppSelector(s => s.convo);
  const {theme} = useAppSelector(s => s.theme);
  const {token, user} = useAppSelector(s => s.user);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const {focus} = useAppSelector(s => s.model);
  const themeColor = Colors[theme];
  const {height} = Dimensions.get('window');
  const nav = useNavigation();
  const {conversations} = useAppSelector(S => S.convo);
  const currentChat = conversations?.find(itm => itm.conversation_id === id);
  const heightAnim = useRef(new Animated.Value(0)).current;

  const isImgVid =
    focus === 'generate_video' || focus === 'image_generation' ? true : false;
  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isImgVid ? 100 : 0, // Adjust 100 to your desired expanded height
      duration: 300,
      useNativeDriver: false, // Height animation doesn't support native driver
    }).start();
  }, [isImgVid, heightAnim]);

  useEffect(() => {
    const getData = async () => {
      try {
        if (id) {
          const res = await single_conversation(token, id as string);
          // console.log(res);
          socket?.emit('join_conversation', {
            conversation_id: id,
          });
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
  const handleNewChat = () => {
    dispatch(setNull());
    dispatch(resetConvoSettings());
    dispatch(setResetConvoUser());
    // @ts-ignore
    nav.navigate('Home');
  };
  // const currentChat = conversations?.find(item => item.conversation_id === id);

  return (
    <View style={{flex: 1}}>
      {/* Top Navbar */}
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          // backgroundColor: 'white', // optional
        }}>
        <View style={{flexDirection: 'row', gap: 30, alignItems: 'center'}}>
          <Pressable onPress={() => toggleDrawer('left')}>
            <FontAwesome6Icon
              name="bars-staggered"
              size={24}
              color={theme === 'dark' ? 'white' : 'black'}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              if (currentChat) {
                sharedUsers(null, currentChat);
              }
            }}>
            <GroupChatIcon
              height={28}
              width={28}
              fill={theme === 'dark' ? '#fff' : '#000'}
            />
          </Pressable>
        </View>

        <TouchableOpacity onPress={() => renameConvo(id)}>
          <Text style={{color: themeColor.text}}>
            {currentChat ? currentChat?.conversation_name : ''}
          </Text>
        </TouchableOpacity>

        <Pressable onPress={() => handleNewChat()}>
          <NewChatIcon
            height={32}
            width={32}
            fill={theme === 'dark' ? '#fff' : '#000'}
          />
        </Pressable>
      </View>
      {id && conversation_setting.mode === 'deep_research' && (
        <Pressable
          style={{position: 'absolute', zIndex: 50, top: '45%', right: 0}}
          onPress={() => {
            console.log('Clicking'), toggleDrawer('right');
          }}>
          <MaterialIcons
            name="arrow-back-ios-new"
            color={theme === 'dark' ? '#fff' : '#000'}
            size={40}
          />
        </Pressable>
      )}
      {/* Scrollable Chat Area */}
      <FlatList
        // @ts-ignore
        ref={scrollViewRef}
        data={chats?.messages || []}
        renderItem={({item, index}) => <ChatMessages e={item} i={index} />}
        keyExtractor={(_, index) => index.toString()}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({animated: true})
        }
      />

      {/* Bottom Chat Box */}
      <View style={{display: 'flex', alignItems: 'center'}}>
        <Animated.View
          style={[
            styles.aspectRatiocontainer,
            {
              height: heightAnim,
              backgroundColor: theme === 'dark' ? '#404040' : '#D9D9D9',
              overflow: 'hidden',
            },
          ]}>
          {focus === 'generate_video' ? (
            <VideoAspectRatio />
          ) : (
            <ImageAspectRatio />
          )}
        </Animated.View>
      </View>
      <View
        style={[
          styles.ChatBox,
          {backgroundColor: theme === 'dark' ? '#404040' : '#D9D9D9'},
        ]}>
        <BubbleSubmitBox
          clearFile={ClearFile}
          file={file}
          handleFileChange={uploadFile}
          inputValue={inputValue}
          loading={false}
          onChange={onChangeText}
          onSubmit={() => handleSend()}
          vectorOpen={() => {}}
          openTopDrawer={() => toggleDrawer('top')}
          id={id}
        />
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  ChatBox: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    // marginHorizontal: 10,
    paddingTop: 20,
    paddingHorizontal: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 30,
  },
  aspectRatiocontainer: {
    flexDirection: 'row',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 96, // h-24 ≈ 96 (24 * 4)
    width: '90%',
    marginBottom: -10,
  },
  aspectRatioexpanded: {
    maxHeight: 96,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: '#68BEBF', // Replace with actual color code
  },
  aspectRatiocollapsed: {
    maxHeight: 0,
    borderWidth: 0,
  },
});
