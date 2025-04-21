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
import {useAppSelector} from '../../hooks/useRedux';
import {Colors} from '../../constant/Colors';
const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = {
  visible: boolean;
  onClose?: () => void;
};

export const RightDrawer = ({visible, onClose}: Props) => {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const {theme} = useAppSelector(s => s.theme);
  const colors = Colors[theme];
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
          backgroundColor: colors.drawerbg,
        },
      ]}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignContent: 'flex-end',
          alignItems: 'flex-end',
        }}>
        <Pressable onPress={onClose} style={styles.close}>
          <AntDesign
            name="close"
            size={24}
            color={theme === 'dark' ? '#fff' : '#000'}
          />
        </Pressable>
      </View>

      <View style={{marginTop: -45}}>
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

    zIndex: 100,
  },
  close: {
    padding: 16,
    width: 60,

    zIndex: 100,
  },
});
