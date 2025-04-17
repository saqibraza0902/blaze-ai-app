import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { groupConversationsByTime } from "@/utils/format-date";
import { IConversations, IFolder } from "@/utils/types";
import ConversationItem from "./conversation-item"; // make sure this is RN compatible
// import NewMessageIcon from "@/ui/icons/new-message-icon"; // should be SVG or RN component
import { setNull, setResetConvoUser } from "@/redux/slices/conversation";
import { useRouter } from "expo-router"; // or 'react-navigation'
import { useTheme } from "@react-navigation/native"; // if using react-navigation

interface IProp {
  toggleDelete: (id: string) => void;
  id: string;
  moveConvo: (id: IConversations, folder?: IFolder | null) => void;
  dragId?: string | null;
  sharedUsers: (f: IFolder | null, c: IConversations | null) => void;
  renameConvo: (id: string) => void;
}

const ListConversations = ({
  id,
  toggleDelete,
  moveConvo,
  dragId,
  sharedUsers,
  renameConvo,
}: IProp) => {
  const { conversations } = useAppSelector((s) => s.convo);
  const groupedConversations = groupConversationsByTime(conversations);
  const [hoveredConvo, setHoveredConvo] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { colors } = useTheme();

  const handleIconClick = (convoId: string) => {
    setPopoverOpen((prev) => (prev === convoId ? null : convoId));
  };

  const handleMouseLeave = (convoId: string) => {
    if (popoverOpen !== convoId) {
      setHoveredConvo(null);
    }
  };

  const cp1 = {
    id,
    toggleDelete,
    moveConvo,
    dragId,
    hoveredConvo,
    renameConvo,
  };
  const cp2 = { ...cp1, handleIconClick, handleMouseLeave, setHoveredConvo };
  const cp3 = { ...cp2 };

  const handleNewMessage = () => {
    dispatch(setNull());
    dispatch(setResetConvoUser());
    router.push("/");
  };

  const screenHeight = Dimensions.get("window").height;
  const maxHeight = screenHeight > 700 ? "80%" : "50%";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Chats</Text>
        <TouchableOpacity onPress={handleNewMessage} style={styles.icon}>
          {/* <NewMessageIcon height={25} width={25} focus={colors.text} /> */}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.scrollArea, { maxHeight }]}
        contentContainerStyle={styles.scrollContent}
      >
        {conversations?.length > 0 ? (
          Object.keys(groupedConversations).map((groupKey) => {
            const groupConversations = groupedConversations[
              groupKey as keyof typeof groupedConversations
            ].filter((convo) => convo.folder_id === null);

            if (groupConversations.length === 0) return null;

            const groupLabel =
              groupKey === "today"
                ? "Today"
                : groupKey === "yesterday"
                ? "Yesterday"
                : groupKey === "last7Days"
                ? "Last 7 Days"
                : groupKey === "thisMonth"
                ? "This Month"
                : "Older";

            const convos = groupConversations.sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            );

            return (
              <View key={groupKey}>
                <Text style={[styles.groupLabel, { color: colors.text }]}>
                  {groupLabel}
                </Text>
                {convos.map((item) => {
                  return (
                    <ConversationItem
                      key={item.conversation_id}
                      props={{ convo: item, id: item.conversation_id }}
                    />
                  );
                })}
              </View>
            );
          })
        ) : (
          <Text style={[styles.noConvo, { color: colors.text }]}>
            No conversations
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ListConversations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  header: {
    marginTop: 8,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  icon: {
    padding: 6,
    borderRadius: 8,
  },
  scrollArea: {
    flexGrow: 1,
  },
  scrollContent: {
    // paddingBottom: 100,
  },
  groupLabel: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
  },
  noConvo: {
    padding: 10,
    fontSize: 14,
  },
});
