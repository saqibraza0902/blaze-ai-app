import {createSlice} from '@reduxjs/toolkit';
import {IUser} from '../../../utils/types';

interface IState {
  user: IUser | null;
  token: string;
}

const initialState: IState = {
  user: null,
  token: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const {setUser, setToken} = userSlice.actions;

export default userSlice.reducer;
