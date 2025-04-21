import {Modal, StyleSheet, Text, View} from 'react-native';
import React, {Children, useState} from 'react';
import {RightDrawer} from '../../components/right-drawer';
import {TopDrawer} from '../../components/top-drawer';
import {LeftDrawer} from '../../components/left-drawer';
import HomeLayout from '../../components/logged-screens-layout';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../constant/Colors';
import {useAppSelector} from '../../hooks/useRedux';

type DrawerType = 'left' | 'right' | 'top';

const DrawerProvider = () => {
  const {theme} = useAppSelector(s => s.theme);
  const [delFolder, setDelFolder] = useState({
    open: false,
    id: '',
  });
  const [drawers, setDrawers] = useState({
    left: false,
    right: false,
    top: false,
  });

  // Single function to toggle any drawer
  const toggleDrawer = (drawer: DrawerType) => {
    console.log(drawer);
    setDrawers(prev => ({
      ...prev,
      [drawer]: !prev[drawer],
    }));
  };

  // Function to close all drawers
  const closeAllDrawers = () => {
    setDrawers({
      left: false,
      right: false,
      top: false,
    });
  };
  const colors = Colors[theme];
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.screenbg}}>
        <LeftDrawer
          handleDelFol={id => setDelFolder({id: id.toString(), open: true})}
          visible={drawers.left}
          onClose={closeAllDrawers}
        />
        <RightDrawer visible={drawers.right} onClose={closeAllDrawers} />
        <TopDrawer visible={drawers.top} onClose={closeAllDrawers} />

        <View>
          <HomeLayout
            delClose={() => setDelFolder({id: '', open: false})}
            toggleDrawer={key => toggleDrawer(key)} // Pass the toggle function to children
            delFolder={delFolder}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default DrawerProvider;

const styles = StyleSheet.create({});
