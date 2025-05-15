import React, {useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';

interface CustomCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  duration?: number;
  style?: ViewStyle;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onToggle,
  size = 30,
  fillColor = 'white',
  borderColor = '#000',
  borderWidth = 2,
  duration = 150,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: checked ? 1 : 0,
      duration,
      useNativeDriver: true,
    }).start();
  }, [checked]);

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
      <View
        style={[
          {
            width: size,
            height: size,
            borderWidth,
            borderColor,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          },
          style,
        ]}>
        <Animated.View
          style={{
            width: size-6,
            height: size-6,
            backgroundColor: fillColor,
            transform: [{scale: scaleAnim}],
            borderRadius: size / 6, // Optional rounded inner box
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default CustomCheckbox;
