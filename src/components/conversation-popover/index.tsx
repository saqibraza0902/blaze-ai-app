import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useAppSelector} from '../../hooks/useRedux';
import {Colors} from '../../constant/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MoveConversationIcon from '../../ui/icons/move-conversation-icon';
import GroupChatIcon from '../../ui/icons/group-chat-icon';
import {IConversations, IFolder} from '../../utils/types';
interface IProp {
  moveConvo: (convo: IConversations, folder?: IFolder | null) => void;
  item: IConversations;
  onClose: () => void;
  toggleDelete: (id: string) => void;
  renameConvo: (id: string) => void;
  sharedUsers: (f: IFolder | null, c: IConversations | null) => void;
}
const ConversationPopover = ({
  moveConvo,
  item,
  onClose,
  toggleDelete,
  renameConvo,
  sharedUsers,
}: IProp) => {
  const {theme} = useAppSelector(s => s.theme);
  const colors = Colors[theme];
  return (
    <View style={[styles.menuContainer, {backgroundColor: colors.popoverbg}]}>
      <Pressable
        style={styles.modalContentView}
        onPress={() => {
          moveConvo(item, null), onClose();
        }}>
        <Text style={{color: '#fff', fontSize: 16}}>Move Conversation</Text>
        <MoveConversationIcon height={24} width={24} fill="#fff" />
      </Pressable>
      <Pressable
        onPress={() => {
          sharedUsers(null, item), onClose();
        }}
        style={styles.modalContentView}>
        <Text style={{color: '#fff', fontSize: 16}}>Group Chat</Text>
        <View style={{height: 20, width: 20}}>
          <GroupChatIcon height={24} width={24} fill="#fff" />
        </View>
      </Pressable>
      <Pressable
        onPress={() => {
          renameConvo(item.conversation_id), onClose();
        }}
        style={styles.modalContentView}>
        <Text style={{color: '#fff', fontSize: 16}}>Rename Conversation</Text>
        <FontAwesome name="edit" size={22} color="#fff" />
      </Pressable>
      <Pressable
        onPress={() => {
          toggleDelete(item.conversation_id), onClose();
        }}
        style={styles.modalContentView}>
        <Text style={{color: '#fff', fontSize: 16}}>Delete Conversation</Text>
        <FontAwesome name="trash-o" size={22} color="#fff" />
      </Pressable>
    </View>
  );
};

export default ConversationPopover;

const styles = StyleSheet.create({
  menuContainer: {
    borderRadius: 16,
    width: '100%',
    // padding: 16,
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
