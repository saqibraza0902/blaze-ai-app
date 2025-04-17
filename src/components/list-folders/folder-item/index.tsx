import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { IFolder, IConversations } from "@/utils/types";
// import { FaAngleUp, FaAngleDown, FaRegShareFromSquare } from "react-icons/fa";
// import { FiEdit } from "react-icons/fi";
// import { BsThreeDotsVertical, BsTrash } from "react-icons/bs";
// import Popover from "@/components/popover"; // Ensure this is RN-compatible
// import ConversationItem from "./conversation-item";
import { useTheme } from "@react-navigation/native";
import { useAppSelector } from "@/hooks/useRedux";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FolderItem = ({ props }: any) => {
  const {
    folder,
    accordionOpen,
    setAccordionOpen,
    editOpen,
    folderDelDialouge,
    sharedUsers,
    id,
    ...c3
  } = props;

  const { conversations } = useAppSelector((s) => s.convo);
  const { colors, dark } = useTheme();

  const isOpen = accordionOpen === folder.id;

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAccordionOpen(isOpen ? null : folder.id);
  };

  const filteredConvos = conversations?.filter(
    (convo: IConversations) => convo.folder_id === folder.id
  );

  return (
    <View key={folder.id} style={styles.wrapper}>
      <TouchableOpacity onPress={handleToggle} style={styles.header}>
        <View style={styles.folderInfo}>
          <View style={[styles.colorDot, { backgroundColor: folder.color }]} />
          <Text style={[styles.folderName, { color: colors.text }]}>
            {folder.name}
          </Text>
        </View>

        <View style={styles.actions}>
          <Text>
            {/* {isOpen ? (
              <FaAngleUp color={dark ? "#fff" : "#000"} />
            ) : (
              <FaAngleDown color={dark ? "#fff" : "#000"} />
            )} */}
          </Text>

          {/* <Popover
            buttonContent={
              <BsThreeDotsVertical color={dark ? "#fff" : "#000"} />
            }
          >
            <View style={styles.popover}>
              <TouchableOpacity
                onPress={(e) => {
                  editOpen(folder);
                }}
                style={styles.popoverItem}
              >
                <Text style={styles.popoverText}>Edit Folder</Text>
                <FiEdit color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => folderDelDialouge(folder.id)}
                style={styles.popoverItem}
              >
                <Text style={styles.popoverText}>Delete Folder</Text>
                <BsTrash color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => sharedUsers(folder, null)}
                style={styles.popoverItem}
              >
                <Text style={styles.popoverText}>Shared Users</Text>
                <FaRegShareFromSquare color="#fff" />
              </TouchableOpacity>
            </View>
          </Popover> */}
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.accordionContent}>
          {filteredConvos?.length === 0 ? (
            <Text style={styles.emptyText}>No conversations</Text>
          ) : (
            filteredConvos.map((convo: IConversations, i: number) => {
              const folderId = folder.id;
              const Propsitem = { convo, id, folderId, ...c3 };
              return <Text>HEllo</Text>;
            })
          )}
        </View>
      )}
    </View>
  );
};

export default FolderItem;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  folderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  folderName: {
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  popover: {
    backgroundColor: "#2f2f2f",
    padding: 8,
    borderRadius: 8,
    gap: 10,
  },
  popoverItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  popoverText: {
    color: "#fff",
    marginRight: 10,
  },
  accordionContent: {
    marginTop: 10,
    gap: 10,
  },
  emptyText: {
    color: "#888",
    fontSize: 13,
    marginVertical: 10,
  },
});
