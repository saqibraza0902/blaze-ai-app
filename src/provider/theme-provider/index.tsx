import React, {ReactNode, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setTheme} from '../../redux/slices/theme';
// import {setTheme} from '../store/themeSlice';

const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        console.log('Log is running here');
        const savedTheme = await AsyncStorage.getItem('Theme');
        const mytheme = JSON.parse(savedTheme || '');
        console.log('This is saved theme', mytheme);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          dispatch(setTheme(savedTheme));
        }else{
          const savedTheme = "light"
          dispatch(setTheme(savedTheme));
        }
      } catch (error) {
        console.error('Failed to load theme', error);
      }
    };

    loadTheme();
  }, [dispatch]);

  return <>{children}</>;
};
export default ThemeProvider;
