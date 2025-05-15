import {io, Socket} from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from './redux/store/store';
export const api = 'https://dev.blazeai.io';

const token = store.getState().user.token;

const socket: Socket = io(api, {
  auth: {
    token: token || '', // fallback if token is undefined
  },
  autoConnect: false, // Prevent auto-connect before manually triggering
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export {socket};
