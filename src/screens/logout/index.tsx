import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ActivityIndicator, View, StyleSheet, Text} from 'react-native';
import WebView from 'react-native-webview';
import {STATIC_COLORS} from '../../constant/Colors';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {setToken, setUser} from '../../redux/slices/user';

const LogOut = () => {
  const navigation: any = useNavigation();

  const logOutUrl = `https://blaze-ai-chi.vercel.app/login?platform=mobile&logout=true`;

  const handleNavigationStateChange = (event: any) => {
    const {url} = event;
    console.log(url);

    setTimeout(() => {
      if (url !== logOutUrl) {
        navigation.push('login');
      }
    }, 2000);
  };
  return (
    <View style={styles.container}>
      <WebView
        style={{display: 'none', height: 0}}
        source={{uri: logOutUrl}}
        javaScriptEnabled={true}
        onNavigationStateChange={handleNavigationStateChange}
      />
      <View
        style={{
          height: '100%',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
        }}>
        <ActivityIndicator size={60} color={STATIC_COLORS.blue_300} />
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
          }}>
          Logging Out
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LogOut;
