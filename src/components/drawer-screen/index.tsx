import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // using Ionicons for close icon
import ListConversations from "@/components/list-conversations";
import ListFolders from "../list-folders";
import { useAppSelector } from "@/hooks/useRedux";
import { Settings } from "../settings";
// import ListFolders from "@/components/list-folders";
// import Settings from "./Settings";

const screenWidth = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const ToggleSidebar = () => {
  const theme = useColorScheme();
  const { folders } = useAppSelector((s) => s.convo);
  const [activeId, setActiveId] = useState(null);

  const divide = folders?.length > 3 ? 1.8 : 1;

  return (
    <Animated.View
      style={[
        styles.sidebarContainer,
        { backgroundColor: theme === "dark" ? "#000" : "#fff" },
      ]}
    >
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Folder + Conversation Lists */}
        <View style={styles.contentContainer}>
          <View
            style={{
              height: 50 * folders.length,
              maxHeight: HEIGHT / 2.8,
            }}
          >
            <ListFolders />
          </View>
          <View
            style={{
              height: "100%",
              maxHeight: HEIGHT / divide,
            }}
          >
            <ListConversations
              moveConvo={() => console.log("object")}
              renameConvo={() => console.log("object")}
              id=""
              toggleDelete={() => console.log("object")}
              dragId={""}
              sharedUsers={() => console.log("object")}
            />
          </View>
        </View>

        {/* Footer Settings */}
        <View style={styles.footer}>
          <Settings
            handleToggle={() => console.log("")}
            openFeedback={() => console.log("")}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: screenWidth,

    zIndex: 50,
    elevation: 10,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "flex-end",
    paddingBottom: 10,
  },
  contentContainer: {
    flex: 1,
  },
  footer: {
    paddingTop: 10,
  },
});
export default ToggleSidebar;
