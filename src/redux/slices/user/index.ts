
import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../../utils/types";

interface IState {
  user: IUser | null;
}

const initialState: IState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
