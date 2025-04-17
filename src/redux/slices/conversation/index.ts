// import { messages } from "@/mock";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IConversations, IFolder, IMessages } from "../../../utils/types";

interface IState {
  conversations: IConversations[];
  folders: IFolder[];
  chats: {
    conversation_id: string;
    messages: IMessages[];
  };
  convo_users: {
    email: string;
    id: string;
    is_admin: boolean;
  }[];
}

const initialState: IState = {
  conversations: [],
  folders: [],
  chats: {
    messages: [],
    conversation_id: "",
  },
  convo_users: [],
};

export const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setConversation: (state, action) => {
      state.conversations = action.payload;
    },
    setConvoNull: (state) => {
      state.conversations = [];
    },
    setNull: (state) => {
      (state.chats.conversation_id = ""), (state.chats.messages = []);
    },
    editGroupTitle: (state, action) => {},
    setChat: (state, action) => {
      const { conversation_id, messages } = action.payload;
      if (state.chats.conversation_id === conversation_id) {
        state.chats.messages = messages;
      } else if (messages.loading) {
        state.chats.conversation_id = conversation_id;
        state.chats.messages = messages;
      } else {
        state.chats = action.payload;
      }
    },
    updateChat: (state, action) => {
      const { conversation_id } = action.payload;

      if (state.chats.conversation_id === conversation_id) {
        state?.chats?.messages.push(action.payload.messages);
      } else {
        state.chats.conversation_id = conversation_id;
        state.chats.messages = [
          ...state.chats.messages,
          action.payload.messages,
        ];
      }
    },
    setFolders: (state, action) => {
      state.folders = action.payload;
    },
    updateConversation: (state, action) => {
      const { conversation_id, id, name, color } = action.payload;

      const index = state.conversations.findIndex(
        (conversation) => conversation.conversation_id === conversation_id
      );
      if (index !== -1) {
        state.conversations[index].folder_id = id;
        state.conversations[index].folder_name = name;
        state.conversations[index].folder_color = color;
      }
    },
    setConvoUsers: (state, action) => {
      state.convo_users = action.payload;
    },
    setResetConvoUser: (state) => {
      state.convo_users = [];
    },
    setLogout: (state) => {
      state = initialState;
    },
  },
});

export const {
  setConversation,
  setChat,
  setNull,
  setConvoNull,
  editGroupTitle,
  updateChat,
  setFolders,
  updateConversation,
  setConvoUsers,
  setResetConvoUser,
  setLogout,
} = chatSlice.actions;

export default chatSlice.reducer;
const object = {
  content: "Hi there",
  image_path: null,
  model_used: null,
  sender: {
    first_name: "Unknown (user not found)",
    id: "user",
  },
  timestamp: "2025-01-10T14:11:55",
};
