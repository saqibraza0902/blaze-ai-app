import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
  Switch,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import DrawerProvider from '../../provider/custom-drawer-provider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import BubbleSubmitBox from '../../components/bubble-submit-box';
import {AppColors, Colors} from '../../constant/Colors';
import BlueBubbleIcon from '../../ui/icons/blue-bubble-icon/BlueBubbleIcon';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import DeepresearchIcon from '../../ui/icons/deep-search-icon';
import {
  resetConvoSettings,
  setConvoSettings,
} from '../../redux/slices/conversation';
import {setModel} from '../../redux/slices/model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Models} from '../../utils/enums';
import {
  get_folders,
  get_member,
  list_conversations,
  PickedFile,
} from '../../utils/functions';
// import {token} from '../../mock';
import {setConversation, setFolders} from '../../redux/slices/conversation';
import {setUser} from '../../redux/slices/user';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeLayout from '../../components/logged-screens-layout';
import Toast from 'react-native-simple-toast';
import {jwtDecode} from 'jwt-decode';
import ImageAspectRatio from '../../components/img-aspect-ratio';
import ColorSelect from '../../ui/form/colors-select';
import VideoAspectRatio from '../../components/video-aspect-ratio';
const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');
interface IProp {
  toggleDrawer: (key: 'left' | 'right' | 'top') => void;
  uploadFile: () => void;
  ClearFile: any;
  file: any;
  onChangeText: any;
  inputValue: any;
  handleSend: () => void;
}
const Home = ({
  toggleDrawer,
  uploadFile,
  ClearFile,
  file,
  onChangeText,
  inputValue,
  handleSend,
}: IProp) => {
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const iconTranslateAnim = useRef(new Animated.Value(-3)).current;
  const dispatch = useAppDispatch();
  const {conversation_setting} = useAppSelector(s => s.convo);
  const {token, user} = useAppSelector(s => s.user);
  const {theme} = useAppSelector(s => s.theme);
  const {focus} = useAppSelector(s => s.model);
  const {models, mode} = conversation_setting;
  let freeuser = user?.planConnections[0].type === 'FREE' ? true : false;
  let isLoggedIn = !!token;
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
    const get_data = async () => {
      try {
        const res = await list_conversations(token);
        const data = await get_folders(token);
        const currentUser: any = token ? jwtDecode(token) : {};
        const member = await get_member(currentUser.id);
        dispatch(setUser(member?.data));
        dispatch(setFolders(data.folders));
        dispatch(setConversation(res?.conversations));
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    get_data();
  }, []);

  const toggleSlide = () => {
    const toTranslateY = expanded ? -60 : 15;
    const toRotate = expanded ? 0 : 1;
    const toIconTranslate = expanded ? -3 : 2;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: toTranslateY,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateValue, {
        toValue: toRotate,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(iconTranslateAnim, {
        toValue: toIconTranslate,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setExpanded(!expanded);
  };

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const iconTranslateY = iconTranslateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20], // Adjust the value as needed for icon's movement
  });

  const handleResearchToggle = () => {
    if (isLoggedIn && !freeuser) {
      if (mode === 'deep_research') {
        dispatch(setModel(Models.CLAUDE3_7SONNET));
        AsyncStorage.removeItem('mode');
        dispatch(setConvoSettings({key: 'mode', value: 'normal'}));
      } else {
        const setmode = 'deep_research';
        AsyncStorage.setItem('mode', JSON.stringify(setmode));
        dispatch(resetConvoSettings());
        dispatch(setConvoSettings({key: 'mode', value: setmode}));
      }
    } else {
      // toast.error("Please Update your Plan");
      console.log('Please Update your Plan');
    }
  };
  const handleDeepDiveToggle = () => {
    if (isLoggedIn && !freeuser) {
      if (mode === 'deep_dive') {
        AsyncStorage.removeItem('mode');

        dispatch(setModel(Models.CLAUDE3_7SONNET));
        dispatch(setConvoSettings({key: 'mode', value: 'normal'}));
      } else {
        dispatch(setModel(Models.SONARPROREASONING));
        const setmode = 'deep_dive';
        AsyncStorage.setItem('mode', JSON.stringify(setmode));
        dispatch(resetConvoSettings());
        dispatch(setConvoSettings({key: 'mode', value: setmode}));
      }
    } else {
      Toast.show('Please Update your Plan', Toast.LONG);
    }
  };
  /* _______Deep Search Animation_____ */
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mode === 'deep_research') {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [mode]);

  const colors = Colors[theme];

  return (
    <View style={{height: HEIGHT, backgroundColor: colors.screenbg, zIndex: 1}}>
      <View
        style={{
          padding: 10,
          position: 'absolute',
          top: 0,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <Pressable onPress={() => toggleDrawer('left')}>
          <FontAwesome6
            name="bars-staggered"
            size={24}
            color={theme === 'dark' ? 'white' : 'black'}
          />
        </Pressable>
        {mode === 'deep_research' && (
          <Animated.View style={{opacity: fadeAnim}}>
            <Pressable onPress={() => toggleDrawer('right')}>
              <MaterialIcons
                name="arrow-back-ios"
                size={40}
                color={theme === 'dark' ? 'white' : 'black'}
              />
            </Pressable>
          </Animated.View>
        )}
      </View>
      <View style={styles.container}>
        {/* Blue Bubble Background */}
        <View style={styles.blueBubbleWrapper}>
          <View style={styles.blueBubble}>
            <BlueBubbleIcon />
            <View style={styles.overlayContent}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatar}>
                  <Image
                    source={require('../../../assets/images/blaze/blaze-logo.png')}
                    style={styles.avatarImage}
                  />
                </View>
              </View>
              <View style={styles.messageWrapper}>
                <Text style={styles.greetingText}>
                  How can I help you today,
                  {isLoggedIn && (
                    <Text> {user?.customFields['first-name']}</Text>
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Animated.View
          style={[
            styles.aspectRatiocontainer,
            {
              height: heightAnim,

              overflow: 'hidden',
            },
          ]}>
          {focus === 'generate_video' ? (
            <VideoAspectRatio />
          ) : (
            <ImageAspectRatio />
          )}
        </Animated.View>
        {/* Gray Bubble */}
        <View style={styles.grayBubble}>
          <View style={styles.inputRow}>
            <View style={styles.inputBox}>
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
              />
            </View>
            <View style={styles.userImageWrapper}>
              {/* <Image
              style={styles.userImage}
              source={
                isLoggedIn && user?.profileImage
                  ? { uri: user.profileImage }
                  : require("@/assets/usericon.jpg")
              }
            /> */}
              <Image
                source={
                  user?.profileImage
                    ? {uri: user?.profileImage}
                    : require('../../../assets/images/blaze/usericon.jpg')
                }
                style={styles.userImage}
              />
            </View>
          </View>

          {/* Toggle Options */}
          <View style={styles.toggleWrapper}>
            <View>
              <Animated.View
                style={{
                  transform: [{translateY: slideAnim}],
                  width: 250,
                  height: 90,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  gap: 10,
                  backgroundColor: AppColors.gray_200,
                  padding: 10,
                  borderRadius: 20,
                  zIndex: -1,
                  paddingBottom: 10,
                  overflow: 'hidden',
                  borderColor: AppColors.light_blue_300,
                  borderWidth: 2,
                }}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    mode !== 'deep_research'
                      ? styles.outlined
                      : styles.filledGray,
                  ]}
                  onPress={handleResearchToggle}>
                  <DeepresearchIcon height={25} width={25} />
                  <Text style={styles.toggleText}>I.D.E.A Hub</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    mode === 'deep_dive' ? styles.filledGray : styles.outlined,
                  ]}
                  onPress={handleDeepDiveToggle}>
                  <AntDesign name="search1" size={20} color={'black'} />
                  {/* <EvilIcons name="search" size={24} color="black" /> */}
                  <Text style={styles.toggleText}>Deep Dive</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={{
                  transform: [
                    {translateY: iconTranslateY}, // Apply icon's Y translation
                    {rotate: rotate}, // Apply rotation
                  ],
                }}>
                <TouchableOpacity
                  onPress={toggleSlide}
                  style={styles.toggleButton}>
                  <Icon
                    name="keyboard-arrow-down"
                    size={60}
                    color={theme === 'dark' ? 'white' : 'black'}
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  blueBubbleWrapper: {
    width: WIDTH + 5,
    overflow: 'hidden',
    position: 'relative',
  },
  blueBubble: {
    height: 200,
    // backgroundColor: "#000fff",
    width: WIDTH,
  },
  overlayContent: {
    position: 'absolute',
    top: '78%',
    left: 30,
    width: '80%',
    transform: [{translateY: -0.5 * 100}],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrapper: {
    width: WIDTH > 1200 ? '20%' : 'auto',
  },
  avatar: {
    backgroundColor: '#fff',
    borderRadius: 100,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    height: 45,
    width: 45,
    borderRadius: 100,
  },
  messageWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  greetingText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: WIDTH > 768 ? 18 : 14,
  },
  grayBubble: {
    backgroundColor: '#D8D8D9',
    height: WIDTH > 768 ? 140 : 100,
    width: WIDTH > 768 ? 650 : 360,
    borderRadius: 100,
    justifyContent: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputBox: {
    width: '76%',
    marginLeft: 10,
  },
  userImageWrapper: {
    width: '20%',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  userImage: {
    height: WIDTH > 768 ? 96 : 60,
    width: WIDTH > 768 ? 96 : 60,
    borderRadius: 100,
  },
  toggleWrapper: {
    position: 'absolute',
    top: '70%',
    alignSelf: 'center',
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  toggleButton: {
    height: 40,
    minWidth: 100,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    marginTop: 10,
  },
  outlined: {
    borderColor: '#68BEBF',
    borderWidth: 1,
    borderRadius: 10,
  },
  filledGray: {
    backgroundColor: '#BCBCBC',
    borderRadius: 10,
  },
  toggleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
  },
  aspectRatiocontainer: {
    backgroundColor: '#D8D8D9',
    flexDirection: 'row',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 96, // h-24 ≈ 96 (24 * 4)
    width: '80%',
    marginBottom: -30,
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
