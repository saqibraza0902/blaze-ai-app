import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IConversationItem, IConversations } from "@/utils/types";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AppColors } from "@/constants/Colors";

interface IConversationItemProp {
  props: {
    convo: IConversations;
    id: string;
  };
}

const ConversationItem = ({ props }: any) => {
  const { convo, id } = props;

  const isSelected = convo.conversation_id === id;

  return (
    <ThemedView
      style={{
        padding: 5,
        borderWidth: 1,
        borderColor: AppColors.gray_200,
        marginVertical: 10,
      }}
    >
      <ThemedText numberOfLines={1}>{convo?.conversation_name}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff000",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    opacity: 1,
  },
  selected: {
    backgroundColor: "#E0E0E0", // Equivalent to brand_gray-200
  },
  default: {
    // Optional hover styles (for web), or leave empty for mobile
  },
  text: {
    flex: 1,
    color: "#000", // Default text color
  },
});

export default ConversationItem;
