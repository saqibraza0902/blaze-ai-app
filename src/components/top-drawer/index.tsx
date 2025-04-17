import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/Entypo'; // or MaterialIcons, FontAwesome, etc.

<Icon name="home" size={30} color="#900" />;

const SCREEN_HEIGHT = Dimensions.get('window').height;

type Props = {
  visible?: boolean;
  onClose?: () => void;
};

export const TopDrawer = ({visible, onClose}: Props) => {
  const translateY = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.drawer,
        {
          transform: [{translateY}],
        },
      ]}>
      <Pressable onPress={onClose} style={styles.close}>
        <Icon name="cross" size={30} color="white" />
      </Pressable>
      <View style={{padding: 20}}>
        <Text style={{color: '#fff', fontSize: 20}}>Top Drawer Content</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: SCREEN_HEIGHT,
    backgroundColor: '#222',
    zIndex: 100,
  },
  close: {
    padding: 16,
    alignItems: 'flex-end',
  },
});
