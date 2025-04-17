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
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import DrawerProvider from '../../provider/custom-drawer-provider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import BubbleSubmitBox from '../../components/bubble-submit-box';
import {AppColors} from '../../constant/Colors';
import BlueBubbleIcon from '../../ui/icons/blue-bubble-icon/BlueBubbleIcon';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import DeepresearchIcon from '../../ui/icons/deep-search-icon';
import {
  resetConvoSettings,
  setConvoSettings,
  setModal,
} from '../../redux/slices/modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Models} from '../../utils/enums';
import {
  get_folders,
  get_member,
  list_conversations,
} from '../../utils/functions';
import {token} from '../../mock';
import {setConversation, setFolders} from '../../redux/slices/conversation';
import {setUser} from '../../redux/slices/user';

// import { FaChevronLeft } from "react-icons/fa"; // Replace with react-native-vector-icons
// import { IoIosSearch } from "react-icons/io"; // Replace with react-native-vector-icons

const {width: WIDTH} = Dimensions.get('window');

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [topDrawerVisible, setTopDrawerVisible] = useState(false);
  const [leftdrawer, setLeftDrawer] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const dispatch = useAppDispatch();
  const {conversation_setting} = useAppSelector(s => s.modal);
  const {models, mode} = conversation_setting;
  let freeuser = false;
  let isLoggedIn = true;

  console.log('mode', mode);

  useEffect(() => {
    const get_data = async () => {
      try {
        const res = await list_conversations(token);
        const data = await get_folders(token);
        const member = await get_member('mem_cm2n7w5nx009k0strh2nuetp3');
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

  const toggleHeight = () => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: expanded ? 0 : 90,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateValue, {
        toValue: expanded ? 0 : 1, // toggle between 0 and 1
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setExpanded(!expanded);
  };

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'], // rotate 180 degrees
  });

  const openRightDrawer = () => {
    setVisible(true);
    setTopDrawerVisible(false); // Close top drawer when opening right drawer
  };

  const openTopDrawer = () => {
    setTopDrawerVisible(true);
    setVisible(false); // Close right drawer when opening top drawer
  };

  const handleClose = () => {
    setVisible(false);
    setTopDrawerVisible(false); // Close both drawers when closing
  };

  const openLeftDrawer = () => {
    setLeftDrawer(prevState => !prevState);
  };

  const handleResearchToggle = () => {
    if (isLoggedIn && !freeuser) {
      if (mode === 'deep_research') {
        dispatch(setModal(Models.CLAUDE3_7SONNET));
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

        dispatch(setModal(Models.CLAUDE3_7SONNET));
        dispatch(setConvoSettings({key: 'mode', value: 'normal'}));
      } else {
        dispatch(setModal(Models.SONARPROREASONING));
        const setmode = 'deep_dive';
        AsyncStorage.setItem('mode', JSON.stringify(setmode));
        dispatch(resetConvoSettings());
        dispatch(setConvoSettings({key: 'mode', value: setmode}));
      }
    } else {
      // toast.error("Please Update your Plan");
      console.log('Please Update your Plan');
    }
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: AppColors.gray_700}}>
        <DrawerProvider
          visible={visible}
          onClose={handleClose}
          topvisible={topDrawerVisible}
          toponClose={handleClose}
          leftvisible={leftdrawer}
          leftonClose={openLeftDrawer}>
          <View>
            <View style={{padding: 10, position: 'absolute', top: 0}}>
              <Pressable onPress={openLeftDrawer}>
                <FontAwesome6 name="bars-staggered" size={24} color="white" />
              </Pressable>
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
                        {/* {isLoggedIn && (
                <Text> Pen Di siri</Text>
                )} */}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Gray Bubble */}
              <View style={styles.grayBubble}>
                <View style={styles.inputRow}>
                  <View style={styles.inputBox}>
                    <BubbleSubmitBox
                      clearFile={() => {}}
                      file={null}
                      handleFileChange={() => {}}
                      inputValue=""
                      loading={false}
                      onChange={() => {}}
                      onSubmit={() => {}}
                      vectorOpen={() => {}}
                      openTopDrawer={openTopDrawer}
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
                      source={{
                        uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEFlCxAfL-D3y4JVh8rnRPUoQ5pMsbf6cjAg&s',
                      }}
                      style={styles.userImage}
                    />
                  </View>
                </View>

                {/* Toggle Options */}
                <View style={styles.toggleWrapper}>
                  <View>
                    <Animated.View
                      style={{
                        width: 250,
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
                        height: animatedHeight,
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
                          mode === 'deep_dive'
                            ? styles.filledGray
                            : styles.outlined,
                        ]}
                        onPress={handleDeepDiveToggle}>
                        <AntDesign name="search1" size={20} color={'black'} />
                        {/* <EvilIcons name="search" size={24} color="black" /> */}
                        <Text style={styles.toggleText}>Deep Dive</Text>
                      </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity
                      onPress={toggleHeight}
                      style={styles.toggleButton}>
                      <Animated.View style={{transform: [{rotate}]}}>
                        {/* <FaChevronLeft width={30} height={30} fill="white" /> */}
                        <Icon
                          name="keyboard-arrow-down"
                          size={60}
                          color="white"
                        />
                      </Animated.View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </DrawerProvider>
      </SafeAreaView>
    </SafeAreaProvider>
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
});
