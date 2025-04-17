import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Models} from '../../../utils/enums';

const initialState = {
  modal: '',
  focus: '',
  token: '',
  research: '',
  models: [Models.Blaze],
  conversation_setting: {
    models: [Models.Blaze],
    mode: 'normal',
    delay: 0,
    cascade: 0,
  },
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModal: (state, action) => {
      state.modal = action.payload;

      AsyncStorage.setItem('modal', JSON.stringify(action.payload));
    },
    setFocus: (state, action) => {
      state.focus = action.payload;

      AsyncStorage.setItem('focus', JSON.stringify(action.payload));
    },
    setConvoSettings: (state, action) => {
      const {key, value} = action.payload;

      if (key === 'mode') {
        state.conversation_setting.mode = value;

        AsyncStorage.setItem('mode', JSON.stringify(value));
      } else if (key === 'models') {
        state.conversation_setting.models = value;
      } else if (key === 'delay') {
        state.conversation_setting.delay = value;
      } else if (key === 'cascade') {
        state.conversation_setting.cascade = value;
      }
    },
    // setResearchMode: (state, action) => {
    //   state.conversation_setting.research = action.payload;
    //   if (typeof window !== "undefined") {
    //     AsyncStorage.setItem("research", JSON.stringify(action.payload));
    //   }
    // },
    setResearchNull: state => {
      state.focus = '';
    },
    setFocusNull: state => {
      state.focus = '';
    },
    // setModels: (state, action) => {
    //   state.conversation_setting.models = action.payload;
    // },
    // setDelaySetting: (state, action) => {
    //   console.log(action.payload);
    //   if (action.payload.delay) {
    //     state.conversation_setting.delay = action.payload.delay;
    //   } else if (action.payload.cascade) {
    //     state.conversation_setting.cascade = action.payload.cascade;
    //   }
    // },
    resetConvoSettings: state => {
      state.conversation_setting = initialState.conversation_setting;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setTokenNull: state => {
      state.token = '';
    },
  },
});

export const {
  setModal,
  setFocus,
  setFocusNull,
  setToken,
  setTokenNull,

  setResearchNull,
  setConvoSettings,
  resetConvoSettings,
} = modalSlice.actions;

export default modalSlice.reducer;
