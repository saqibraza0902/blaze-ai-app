import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ChatModels, Models} from '../../../utils/enums';

interface IProp {
  focus: string;
  model: ChatModels;
}
const initialState = {
  focus: '',
  model: ChatModels.Blaze,
  ratio: '',
};

export const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    setModel: (state, action) => {
      state.model = action.payload;
    },
    setFocus: (state, action) => {
      state.focus = action.payload;
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
    setRatio: (state, action) => {
      state.ratio = action.payload;
    },
   
  },
});

export const {
  setModel,
  setFocus,
  setFocusNull,
  
  setRatio,
  setResearchNull,
} = modelSlice.actions;

export default modelSlice.reducer;
