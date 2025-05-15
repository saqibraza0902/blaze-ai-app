import {useEffect} from 'react';
import {socket} from '../../socket';
import {useAppSelector} from '../../hooks/useRedux';

const SocketProvider = ({children}: {children: React.ReactNode}) => {
  const {token} = useAppSelector(s => s.user);

  useEffect(() => {
    if (!token || !socket) return;

    const handleConnect = () => {
      console.log('Connected to socket successfully');
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected. Attempting to reconnect...');
      (socket?.auth as {token: string}).token = token;
      socket?.connect();
    };

    if (socket.auth) {
      (socket.auth as {token: string}).token = token;
    }

    // if (socket.connected) {
    //   socket.disconnect();
    // }

    // console.log("Attemptin/g to connect socket...");
    socket.connect();
    // console.log("Socket connected:", socket.connected);

    // Attach event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket?.off('connect', handleConnect);
      socket?.off('disconnect', handleDisconnect);
    };
  }, [token]);

  return <>{children}</>;
};
export default SocketProvider;
