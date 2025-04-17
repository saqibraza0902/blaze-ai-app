
import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { AppColors } from "../../../constant/Colors";

interface ToggleSwitchProps {
  label?: string;
  initialValue?: boolean;
  onToggle?: (value: boolean) => void;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  switchStyle?: ViewStyle;
  trackColor?: {
    false: string;
    true: string;
  };
  thumbColorFalse?: string;
  thumbColorTrue?: string;
  iosBackgroundColor?: string;
}

const ToggleSwitch = ({
  label = "Toggle",
  initialValue = false,
  onToggle,
  containerStyle,
  labelStyle,
  switchStyle,
  trackColor = { false: "#767577", true: AppColors.light_blue_300 },
  thumbColorFalse = "#f4f3f4",
  thumbColorTrue = "#f4f3f4",
  iosBackgroundColor = "#3e3e3e",
}: ToggleSwitchProps) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    if (onToggle) onToggle(newValue);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Switch
        value={isEnabled}
        onValueChange={toggleSwitch}
        trackColor={trackColor}
        thumbColor={isEnabled ? thumbColorTrue : thumbColorFalse}
        ios_backgroundColor={iosBackgroundColor}
        style={switchStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "red",
    height: 0,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
});

export default ToggleSwitch;
