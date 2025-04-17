import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { useTheme } from "@react-navigation/native";
import FolderItem from "./folder-item";
import { IFolder } from "@/utils/types";

const ListFolders = () => {
  // import { IFolder, IConversations } from "@/utils/types";
  // import FolderItem from "./folder-item";
  // import AddFolderIcon from "@/ui/icons/add-folder-icon"; // ensure it's RN compatible
  // import { useTheme } from "@react-navigation/native";
  const { folders } = useAppSelector((s) => s.convo);
  const { colors, dark } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: colors.text }]}>Folders</Text>
        <TouchableOpacity style={styles.iconWrap}>
          {/* <AddFolderIcon
            height="25"
            width="25"
            focus={dark ? "#fff" : "#000"}
          /> */}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {folders?.map((folder: IFolder) => {
          const folderItemProps = {
            folder,
          };
          return <FolderItem key={folder.id} props={folderItemProps} />;
        })}
      </ScrollView>
    </View>
  );
};

export default ListFolders;
const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  iconWrap: {
    padding: 6,
    borderRadius: 8,
  },
  scrollContainer: {
    maxHeight: "100%", // Adjust as needed
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
