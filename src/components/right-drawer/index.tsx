import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IdeaHubSetting from '../idea-hub-setting';
const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = {
  visible: boolean;
  onClose?: () => void;
};

export const RightDrawer = ({visible, onClose}: Props) => {
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
          transform: [{translateX}],
        },
      ]}>
      <Pressable onPress={onClose} style={styles.close}>
        <AntDesign name="close" size={24} color="#fff" />
      </Pressable>

      <View>
        <IdeaHubSetting />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: SCREEN_WIDTH,
    backgroundColor: '#000000',
    zIndex: 100,
  },
  close: {
    padding: 16,
    alignItems: 'flex-end',
  },
});
