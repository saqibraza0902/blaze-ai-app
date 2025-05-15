import React, {ReactNode, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setTheme} from '../../redux/slices/theme';
import {socket} from '../../socket';
import {useAppDispatch} from '../../hooks/useRedux';
// import {setTheme} from '../store/themeSlice';

const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        console.log('Log is running here');
        const savedTheme = await AsyncStorage.getItem('Theme');
        const mytheme = JSON.parse(savedTheme || '');
        console.log('This is saved theme', mytheme);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          dispatch(setTheme(savedTheme));
        } else {
          const savedTheme = 'light';
          dispatch(setTheme(savedTheme));
        }
      } catch (error) {
        console.log('Failed to load theme', error);
      }
    };

    loadTheme();
  }, [dispatch]);

  return <>{children}</>;
};
export default ThemeProvider;
