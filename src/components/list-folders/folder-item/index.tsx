import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import {IFolder, IConversations} from '../../../utils/types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';
import {useAppSelector} from '../../../hooks/useRedux';
import ConversationItem from '../../list-conversations/conversation-item';
import {Colors} from '../../../constant/Colors';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface IFolderItemProps {
  folder: IFolder;
  accordionOpen: number | null;
  setAccordionOpen: (id: number | null) => void;
  onClose: () => void;
  handleOpenMenu?: () => void;
  handleDelFol: (id: number) => void;
}

const CONVERSATION_ITEM_HEIGHT = 60; // Adjust this based on your ConversationItem height
const EMPTY_STATE_HEIGHT = 50; // Height for "No conversations" text
const MAX_ACCORDION_HEIGHT = Dimensions.get('window').height * 0.6; // Max height (60% of screen)

const FolderItem = ({
  folder,
  accordionOpen,
  setAccordionOpen,
  onClose,
  handleOpenMenu,
  handleDelFol,
}: IFolderItemProps) => {
  const {conversations} = useAppSelector(s => s.convo);
  const [folderMenu, setFolderMenu] = useState(false);
  // const {colors, dark} = useTheme();
  const {theme} = useAppSelector(s => s.theme);
  const [showActions, setShowActions] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const isOpen = accordionOpen === folder.id;
  const filteredConvos = conversations?.filter(
    (convo: IConversations) => convo.folder_id === folder.id,
  );

  // Calculate the height needed based on conversation count
  const calculateContentHeight = () => {
    if (!filteredConvos || filteredConvos.length === 0) {
      return EMPTY_STATE_HEIGHT;
    }
    return Math.min(
      filteredConvos.length * CONVERSATION_ITEM_HEIGHT,
      MAX_ACCORDION_HEIGHT,
    );
  };

  useEffect(() => {
    const height = calculateContentHeight();
    Animated.timing(animation, {
      toValue: isOpen ? height : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen, filteredConvos?.length]);

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAccordionOpen(isOpen ? null : folder.id);
  };
  const colors = Colors[theme];
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.header} onPress={handleToggle}>
        <View style={styles.folderInfo}>
          <View style={[styles.colorDot, {backgroundColor: folder.color}]} />
          <Text style={[styles.folderName, {color: colors.text}]}>
            {folder.name}
          </Text>
        </View>

        <View style={styles.actions}>
          <MaterialIcons
            name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color={colors.text}
          />
          <Modal
            visible={folderMenu}
            transparent
            animationType="fade"
            onRequestClose={() => setFolderMenu(false)}>
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setFolderMenu(false)}>
              <View
                style={[
                  styles.menuContainer,
                  {backgroundColor: colors.popoverbg},
                ]}>
                <View style={styles.modalContentView}>
                  <Text style={{color: '#fff', fontSize: 16}}>Edit Folder</Text>
                  <FontAwesome name="edit" size={18} color="#fff" />
                </View>
                <Pressable
                  onPress={() => {
                    handleDelFol(folder.id), onClose();
                  }}
                  style={styles.modalContentView}>
                  <Text style={{color: '#fff', fontSize: 16}}>
                    Delete Folder
                  </Text>
                  <View style={{height: 20, width: 18}}>
                    <FontAwesome name="trash-o" size={20} color="#fff" />
                  </View>
                </Pressable>
                <View style={styles.modalContentView}>
                  <Text style={{color: '#fff', fontSize: 16}}>
                    Shared Users
                  </Text>
                  <FontAwesome name="share-square-o" size={18} color="#fff" />
                </View>
              </View>
            </Pressable>
          </Modal>
          <Pressable
            onPress={() => setFolderMenu(true)}
            style={styles.menuButton}>
            <MaterialIcons name="more-vert" size={20} color={colors.text} />
          </Pressable>
        </View>
      </TouchableOpacity>

      {/* {showActions && (
        <View style={[styles.actionsMenu, {backgroundColor: colors.card}]}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              onClose?.();
              setShowActions(false);
            }}>
            <Feather name="edit" size={18} color={colors.text} />
            <Text style={[styles.actionText, {color: colors.text}]}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              onClose?.();
              setShowActions(false);
            }}>
            <Feather name="trash-2" size={18} color="#ff4444" />
            <Text style={[styles.actionText, {color: '#ff4444'}]}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              onClose?.();
              setShowActions(false);
            }}>
            <FontAwesome name="share" size={18} color={colors.text} />
            <Text style={[styles.actionText, {color: colors.text}]}>Share</Text>
          </TouchableOpacity>
        </View>
      )} */}

      <Animated.View
        style={[
          styles.accordionContent,
          {
            height: animation,

            borderRadius: 8,
            marginTop: 4,
          },
        ]}>
        {filteredConvos?.length === 0 ? (
          <Text style={[styles.emptyText, {color: colors.text}]}>
            No conversations
          </Text>
        ) : (
          <ScrollView style={styles.conversationList} nestedScrollEnabled>
            {filteredConvos?.map((convo: IConversations) => (
              <ConversationItem
                key={convo.conversation_id}
                props={{convo: convo, id: convo.conversation_id}}
              />
            ))}
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '500',
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginLeft: 8,
  },
  actionsMenu: {
    position: 'absolute',
    right: 16,
    top: 50,
    zIndex: 10,
    paddingVertical: 8,
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  actionText: {
    fontSize: 14,
  },
  accordionContent: {
    overflow: 'hidden',
  },
  conversationList: {
    paddingHorizontal: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    padding: 20, // Optional: Add some padding around the modal
  },
  menuContainer: {
    borderRadius: 16,
    width: '80%',
    padding: 16,
    gap: 25,
    zIndex: 40,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  modalContentView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default FolderItem;
