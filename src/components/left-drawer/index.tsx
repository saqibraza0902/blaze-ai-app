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
const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = {
  visible?: boolean;
  onClose?: () => void;
};

export const LeftDrawer = ({visible, onClose}: Props) => {
  const translateX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -SCREEN_WIDTH,
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
        <AntDesign name="close" size={30} color="#fff" />
      </Pressable>
      <View style={{padding: 20}}>
        <Text style={{color: '#fff', fontSize: 20}}>Left Drawer Content</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: SCREEN_WIDTH,
    backgroundColor: '#444',
    zIndex: 100,
  },
  close: {
    padding: 16,
    alignItems: 'flex-start',
  },
});
