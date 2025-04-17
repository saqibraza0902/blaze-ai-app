import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
} from "react-native";
import React, { useEffect, useRef } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;

type Props = {
  visible: boolean;
  onClose?: () => void;
};

export const RightDrawer = ({ visible, onClose }: Props) => {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.drawer,
        {
          transform: [{ translateX }],
        },
      ]}
    >
      <Pressable onPress={onClose} style={styles.close}>
        <Text style={{ color: "#fff" }}>Close</Text>
      </Pressable>
      <View style={{ padding: 20 }}>
        <Text style={{ color: "#fff", fontSize: 20 }}>
          Right Drawer Content
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: SCREEN_WIDTH,
    backgroundColor: "#333",
    zIndex: 100,
  },
  close: {
    padding: 16,
    alignItems: "flex-end",
  },
});
