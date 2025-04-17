import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from './src/screens/login';
import Home from './src/screens/home';
import ReduxProvider from './src/provider/redux-provider';

const App = () => {
  const Stack = createNativeStackNavigator();
  const StackNavigator = () => {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    );
  };
  return (
    <ReduxProvider>
      <NavigationContainer>
        <StackNavigator />
        <StatusBar barStyle={'default'} />
      </NavigationContainer>
    </ReduxProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
