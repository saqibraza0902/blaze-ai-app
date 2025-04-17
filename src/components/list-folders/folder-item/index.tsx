import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
} from 'react-native';
import {IFolder, IConversations} from '../../../utils/types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';
import {useAppSelector} from '../../../hooks/useRedux';
import ConversationItem from '../../list-conversations/conversation-item';

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
  onClose?: () => void;
}

const FolderItem = ({
  folder,
  accordionOpen,
  setAccordionOpen,
  onClose,
}: IFolderItemProps) => {
  const {conversations} = useAppSelector(s => s.convo);
  const {colors, dark} = useTheme();
  const [showActions, setShowActions] = useState(false);

  const isOpen = accordionOpen === folder.id;

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAccordionOpen(isOpen ? null : folder.id);
  };

  const filteredConvos = conversations?.filter(
    (convo: IConversations) => convo.folder_id === folder.id,
  );

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggle}
        activeOpacity={0.7}>
        <View style={styles.folderInfo}>
          <View style={[styles.colorDot, {backgroundColor: folder.color}]} />
          <Text style={[styles.folderName, {color: colors.text}]}>
            {folder.name}
          </Text>
          <Text style={[styles.countText, {color: colors.text}]}>
            ({filteredConvos?.length || 0})
          </Text>
        </View>

        <View style={styles.actions}>
          <MaterialIcons
            name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color={colors.text}
          />

          <TouchableOpacity
            onPress={() => setShowActions(!showActions)}
            style={styles.menuButton}>
            <MaterialIcons name="more-vert" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {showActions && (
        <View style={[styles.actionsMenu, {backgroundColor: colors.card}]}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              // editOpen(folder);
              onClose?.();
              setShowActions(false);
            }}>
            <Feather name="edit" size={18} color={colors.text} />
            <Text style={[styles.actionText, {color: colors.text}]}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              // folderDelDialouge(folder.id);
              onClose?.();
              setShowActions(false);
            }}>
            <Feather name="trash-2" size={18} color="#ff4444" />
            <Text style={[styles.actionText, {color: '#ff4444'}]}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              // sharedUsers(folder, null);
              onClose?.();
              setShowActions(false);
            }}>
            <FontAwesome name="share" size={18} color={colors.text} />
            <Text style={[styles.actionText, {color: colors.text}]}>Share</Text>
          </TouchableOpacity>
        </View>
      )}

      {isOpen && (
        <View style={styles.accordionContent}>
          {filteredConvos?.length === 0 ? (
            <Text style={[styles.emptyText, {color: colors.text}]}>
              No conversations in this folder
            </Text>
          ) : (
            <ScrollView style={styles.conversationList} nestedScrollEnabled>
              {filteredConvos?.map((convo: IConversations) => (
                <ConversationItem
                  key={convo.conversation_id}
                  props={{convo: convo, id: convo.conversation_id}}
                  // onClose={onClose}
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
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
  countText: {
    fontSize: 14,
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuButton: {
    padding: 4,
  },
  actionsMenu: {
    paddingVertical: 8,
    borderRadius: 4,
    elevation: 2,
    marginHorizontal: 8,
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
    marginTop: 4,
    maxHeight: 300,
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
});

export default FolderItem;
