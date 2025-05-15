import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import {IConversationItem, IConversations, IFolder} from '../../../utils/types';
import {ThemedText} from '../../ThemedText';
import {ThemedView} from '../../ThemedView';
import {AppColors, Colors, STATIC_COLORS} from '../../../constant/Colors';
import {useAppSelector} from '../../../hooks/useRedux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ModalPopover from '../../modal';
import ConversationPopover from '../../conversation-popover';
interface IConversationItemProp {
  convo: IConversations;

  onClose: () => void;
  id: string;
  moveConvo: (convo: IConversations, folder?: IFolder | null) => void;
  toggleDelete: (id: string) => void;
  renameConvo: (id: string) => void;
  sharedUsers: (f: IFolder | null, c: IConversations | null) => void;
}

const ConversationItem = ({
  convo,
  onClose,
  id,
  moveConvo,
  toggleDelete,
  renameConvo,
  sharedUsers,
}: IConversationItemProp) => {
  const {theme} = useAppSelector(s => s.theme);
  const isSelected = convo.conversation_id === id;
  const [open, setOpen] = useState(false);
  const colors = Colors[theme];
  return (
    <View
      style={{
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 8,
        backgroundColor: isSelected
          ? colors.selectedconvoitembg
          : colors.convoitembg,
      }}>
      <Text style={{color: colors.text}} numberOfLines={1}>
        {convo?.conversation_name}
      </Text>

      <Pressable onPress={() => setOpen(true)} style={styles.menuButton}>
        <MaterialIcons name="more-vert" size={20} color={colors.text} />
      </Pressable>

      <ModalPopover open={open} onClose={() => setOpen(false)}>
        <ConversationPopover
          onClose={() => {
            setOpen(false), onClose();
          }}
          toggleDelete={toggleDelete}
          item={convo}
          moveConvo={moveConvo}
          renameConvo={renameConvo}
          sharedUsers={sharedUsers}
        />
      </ModalPopover>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    opacity: 1,
  },
  selected: {
    backgroundColor: '#E0E0E0', // Equivalent to brand_gray-200
  },
  default: {
    // Optional hover styles (for web), or leave empty for mobile
  },
  text: {
    flex: 1,
    color: '#000', // Default text color
  },
  menuButton: {
    marginLeft: 8,
  },
});

export default ConversationItem;
