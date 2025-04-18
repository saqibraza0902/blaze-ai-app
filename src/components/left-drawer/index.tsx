import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAppSelector, useAppDispatch} from '../../hooks/useRedux';
import {groupConversationsByTime} from '../../utils/format-date';
import ConversationItem from '../list-conversations/conversation-item';
import FolderItem from '../list-folders/folder-item';
import {IFolder, IConversations} from '../../utils/types';
import {setNull, setResetConvoUser} from '../../redux/slices/conversation';
import {useNavigation} from '@react-navigation/native';
import Settings from '../settings';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH; // 80% of screen width

type Props = {
  visible?: boolean;
  onClose?: () => void;
};

export const LeftDrawer = ({onClose, visible}: Props) => {
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const {conversations, folders} = useAppSelector(s => s.convo);
  const groupedConversations = groupConversationsByTime(conversations);
  const dispatch = useAppDispatch();
  const router = useNavigation(); // Assuming you're using react-navigation

  // State for folder interactions
  const [accordionOpen, setAccordionOpen] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const height = folders.length < 2 ? 60 : folders.length * 30;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // const handleNewMessage = () => {
  //   dispatch(setNull());
  //   dispatch(setResetConvoUser());
  //   router.navigate('Home'); // Adjust based on your navigation structure
  //   onClose?.();
  // };
  const isLoggedIn = true;
  return (
    <Animated.View
      style={[
        styles.drawer,
        {
          transform: [{translateX}],
        },
      ]}>
      {/* Close button */}
      <Pressable onPress={onClose} style={styles.close}>
        <AntDesign name="close" size={24} color="#fff" />
      </Pressable>

      {/* Logo section */}
      <View style={styles.logoContainer}>
        {/* <Image
          source={require('../../assets/blaze-logo.png')}
          style={styles.logo}
        /> */}
        <Text style={styles.logoText}>BlazeAI</Text>
      </View>

      {/* Main content */}
      <View style={styles.contentContainer}>
        {isLoggedIn ? (
          <>
            {/* Folders section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Folders</Text>
                <Pressable style={styles.iconButton}>
                  <MaterialIcons
                    name="create-new-folder"
                    size={24}
                    color="#fff"
                  />
                </Pressable>
              </View>
              <ScrollView
                style={[styles.scrollContent, {maxHeight: height}]}
                nestedScrollEnabled>
                {folders.map((folder: IFolder, idx: number) => (
                  <View key={idx}>
                    <FolderItem
                      accordionOpen={accordionOpen}
                      folder={folder}
                      setAccordionOpen={setAccordionOpen}
                      onClose={onClose}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Conversations section */}
            <View style={[styles.section, styles.flex1]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Chats</Text>
                <Pressable style={styles.iconButton}>
                  <MaterialIcons name="message" size={24} color="#fff" />
                </Pressable>
              </View>
              <ScrollView style={styles.scrollContent} nestedScrollEnabled>
                {Object.keys(groupedConversations).map(groupKey => {
                  const groupConversations = groupedConversations[
                    groupKey as keyof typeof groupedConversations
                  ].filter(convo => convo.folder_id === null);

                  if (groupConversations.length === 0) return null;

                  const groupLabel =
                    groupKey === 'today'
                      ? 'Today'
                      : groupKey === 'yesterday'
                      ? 'Yesterday'
                      : groupKey === 'last7Days'
                      ? 'Last 7 Days'
                      : groupKey === 'thisMonth'
                      ? 'This Month'
                      : 'Older';
                  const convos = groupConversations.sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime(),
                  );

                  return (
                    <View key={groupKey} style={styles.groupContainer}>
                      <Text style={styles.groupTitle}>{groupLabel}</Text>
                      {convos.map((item, idx) => (
                        <View key={idx}>
                          <ConversationItem
                            key={item.conversation_id}
                            props={{convo: item, id: item.conversation_id}}
                            // onClose={onClose}
                          />
                        </View>
                      ))}
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </>
        ) : (
          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>
              Please Login to enjoy the features
            </Text>
          </View>
        )}
      </View>

      {/* Settings section */}
      <View style={styles.settingsContainer}>
        <Settings
          openFeedback={() => console.log('object')}
          toggleInstructionModal={() => console.log('object')}
          onClose={onClose}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: SCREEN_WIDTH,
    backgroundColor: '#444',
    zIndex: 100,
  },
  close: {
    padding: 16,
    alignSelf: 'flex-end',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  section: {
    marginBottom: 15,
  },
  flex1: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 5,
  },
  scrollContent: {
    paddingTop: 10,
  },
  groupContainer: {
    marginBottom: 15,
  },
  groupTitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
  },
  settingsContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  settingsText: {
    color: '#fff',
    fontSize: 16,
  },
});
