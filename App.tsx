import {StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from './src/screens/login';
import Home from './src/provider/custom-drawer-provider';
import ReduxProvider from './src/provider/redux-provider';
import {get, save} from './src/utils/theme-storage';
import ThemeProvider from './src/provider/theme-provider';
import {MenuProvider} from 'react-native-popup-menu';
import LogOut from './src/screens/logout';

const App = () => {
  const Stack = createNativeStackNavigator();
  const StackNavigator = () => {
    return (
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="login">
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="Logout" component={LogOut} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    );
  };

  return (
    <ReduxProvider>
      <ThemeProvider>
        {/* <MenuProvider> */}
        <NavigationContainer>
          <StackNavigator />
          <StatusBar barStyle={'default'} />
        </NavigationContainer>
        {/* </MenuProvider> */}
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
