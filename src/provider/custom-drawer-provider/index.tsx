import {StyleSheet, Text, View} from 'react-native';
import React, {Children} from 'react';
import {RightDrawer} from '../../components/right-drawer';
import {TopDrawer} from '../../components/top-drawer';
import {LeftDrawer} from '../../components/left-drawer';

interface DrawerProviderProps {
  children: React.ReactNode;
  visible: boolean;
  onClose?: () => void;
  topvisible?: boolean;
  toponClose?: () => void;
  leftvisible?: boolean;
  leftonClose?: () => void;
}
const DrawerProvider: React.FC<DrawerProviderProps> = ({
  children,
  onClose,
  visible,
  toponClose,
  topvisible,
  leftvisible,
  leftonClose,
}) => {
  return (
    <View>
      <RightDrawer visible={visible} onClose={onClose} />
      <TopDrawer visible={topvisible} onClose={onClose} />
      <LeftDrawer visible={leftvisible} onClose={leftonClose} />
      <View>{children}</View>
    </View>
  );
};

export default DrawerProvider;

const styles = StyleSheet.create({});
