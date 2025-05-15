// store/themeSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeState = {
  theme: 'light' | 'dark';
};

const initialState: ThemeState = {
  theme: 'light',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      //   AsyncStorage.setItem('appTheme', action.payload);
    },
  },
});

export const {setTheme} = themeSlice.actions;
export default themeSlice.reducer;
