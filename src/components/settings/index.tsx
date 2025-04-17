import React, { useEffect, useState } from "react";
import { TouchableOpacity, Image } from "react-native";
import {
  Popover,
  Box,
  Button,
  Text,
  VStack,
  HStack,
  useTheme,
  useToast,
  Avatar,
  useColorMode,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
// import { IoSettingsOutline } from "react-icons/io5"; // Replace this with a proper RN icon if needed
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setConvoNull, setLogout } from "@/redux/slices/conversation";
import { setModal, setTokenNull } from "@/redux/slices/modal";
import { setUser } from "@/redux/slices/user";
// import { memberstack } from "@/utils/memberstack";
import { get_feedback } from "@/utils/functions";
import { handleApiError } from "@/utils/error";
import { ThemedText } from "../ThemedText";
import { View } from "react-native";

interface IProp {
  handleToggle: () => void;
  openFeedback: () => void;
}

export const Settings = ({ handleToggle, openFeedback }: IProp) => {
  const { user } = useAppSelector((s) => s.user);
  const { token } = useAppSelector((s) => s.modal);
  const { colorMode, toggleColorMode } = useColorMode();

  const [feedbackData, setFeedbackData] = useState({
    feedback_count: 0,
    conversation_count: 0,
    message_count: 0,
  });

  const toast = useToast();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(setConvoNull());
    dispatch(setLogout());
    dispatch(setTokenNull());
    dispatch(setUser(null));
  };

  const clickhere = async () => {
    try {
    } catch (error) {
      const err = handleApiError(error);
      toast.show({ description: err });
    }
  };

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await get_feedback(token);
        setFeedbackData({
          feedback_count: res?.data?.feedback_count,
          conversation_count: res?.data?.stats?.conversation_count,
          message_count: res?.data?.stats?.message_count,
        });
      } catch (error) {
        const err = handleApiError(error);
        toast.show({ description: err });
      }
    };
    getStats();
  }, [token]);

  const shouldShowFeedback =
    (feedbackData.conversation_count > 5 &&
      feedbackData.message_count > 10 &&
      feedbackData.feedback_count < 1) ||
    (feedbackData.conversation_count > 20 &&
      feedbackData.message_count > 50 &&
      feedbackData.feedback_count < 2);

  const baseOptions = [
    { text: "Switch Theme", action: toggleColorMode },
    {
      text: "Profile Settings",
      action: () => console.log(""), // You may replace this with external link
    },
    { text: "Billing Information", action: clickhere },
    { text: "Instructions", action: handleToggle },
    { text: "Logout", action: handleLogout },
  ];

  const feedbackOption = { text: "Feedback", action: openFeedback };
  const upgradedOption = {
    text: "Upgrade to Blaze Max",
    action: () => console.log("object"),
  };

  const NORMAL_OPTIONS = shouldShowFeedback
    ? [...baseOptions.slice(0, 4), feedbackOption, baseOptions[4]]
    : baseOptions;

  const UPGRADED_OPTIONS = shouldShowFeedback
    ? [upgradedOption, ...NORMAL_OPTIONS]
    : [upgradedOption, ...baseOptions];

  const OPTIONS =
    user?.planConnections[0].type === "FREE"
      ? UPGRADED_OPTIONS
      : NORMAL_OPTIONS;

  return (
    <Popover
      trigger={(triggerProps) => {
        return (
          <TouchableOpacity {...triggerProps} style={{ width: "100%" }}>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              space={2}
              w="100%"
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Avatar
                  source={{
                    uri:
                      user?.profileImage ??
                      "https://your-default-avatar-url.com/default.jpg",
                  }}
                />
                <ThemedText>Test User</ThemedText>
              </View>
              <Text fontSize="3xl">⚙️</Text>
            </HStack>
          </TouchableOpacity>
        );
      }}
    >
      <Popover.Content
        w="100%" // ✅ Make it full width
        maxWidth="100%" // ✅ Ensure no internal max limit
        style={{ alignSelf: "stretch" }} // ✅ RN-style fallback
      >
        <Popover.Body>
          <VStack space={2} w="xs">
            {OPTIONS.map((item, i) => (
              <TouchableOpacity key={i}>
                <Box px={4} py={2} w="100%">
                  <Text>{item.text}</Text>
                </Box>
              </TouchableOpacity>
            ))}
          </VStack>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
};
