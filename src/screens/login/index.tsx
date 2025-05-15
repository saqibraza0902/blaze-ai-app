import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import {STATIC_COLORS} from '../../constant/Colors';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {setToken, setUser} from '../../redux/slices/user';

const LoginScreen = () => {
  const navigation: any = useNavigation();
  const dispacth = useAppDispatch();
  const {token, user} = useAppSelector(s => s.user);
  const url = `https://blaze-ai-chi.vercel.app/login?platform=mobile`;

  useFocusEffect(
    React.useCallback(() => {
      if (token && user) {
        navigation.push('Home');
      }
    }, [token, user, navigation]),
  );

  const handleWebMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'LOGIN_SUCCESS') {
        dispacth(setToken(data.Token));
        dispacth(setUser(data.member));
        // console.log('✅ Login success from WebView:', data);
        navigation.push('Home');
      }
    } catch (err) {
      console.warn('Failed to parse message from WebView:', err);
    }
  };
  return (
    <View style={styles.container}>
      <WebView
        source={{uri: url}}
        onMessage={handleWebMessage}
        javaScriptEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LoginScreen;
