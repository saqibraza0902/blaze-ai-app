import {StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from './src/screens/login';
import Home from './src/screens/home';
import ReduxProvider from './src/provider/redux-provider';
import {get, save} from './src/utils/theme-storage';
import ThemeProvider from './src/provider/theme-provider';

const App = () => {
  const Stack = createNativeStackNavigator();
  const StackNavigator = () => {
    return (
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="login" component={LoginScreen} />
      </Stack.Navigator>
    );
  };

  return (
    <ReduxProvider>
      <ThemeProvider>
        <NavigationContainer>
          <StackNavigator />
          <StatusBar barStyle={'default'} />
        </NavigationContainer>
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
