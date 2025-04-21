import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {IConversationItem, IConversations} from '../../../utils/types';
import {ThemedText} from '../../ThemedText';
import {ThemedView} from '../../ThemedView';
import {AppColors, Colors} from '../../../constant/Colors';
import {useAppSelector} from '../../../hooks/useRedux';

interface IConversationItemProp {
  props: {
    convo: IConversations;
    id: string;
  };
}

const ConversationItem = ({props}: IConversationItemProp) => {
  const {convo, id} = props;
  const {theme} = useAppSelector(s => s.theme);
  const isSelected = convo.conversation_id === id;
  const colors = Colors[theme];
  return (
    <View
      style={{
        marginVertical: 5,
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor:
          theme === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.05)',
      }}>
      <Text style={{color: colors.text}} numberOfLines={1}>
        {convo?.conversation_name}
      </Text>
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
});

export default ConversationItem;
