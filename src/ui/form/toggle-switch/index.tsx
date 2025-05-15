import React, {useState, useEffect} from 'react';
import {View, Switch, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {AppColors} from '../../../constant/Colors';

interface IProp extends React.ComponentProps<typeof Switch> {
  trackColor?: {
    false: string;
    true: string;
  };
  thumbColorFalse?: string;
  thumbColorTrue?: string;
  iosBackgroundColor?: string;
}

const ToggleSwitch = ({
  value,
  onValueChange,
  trackColor = {false: '#767577', true: AppColors.light_blue_300},
  thumbColorFalse = '#f4f3f4',
  thumbColorTrue = '#f4f3f4',
  iosBackgroundColor = '#3e3e3e',
}: IProp) => {
  return (
    <View style={styles.container}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={trackColor}
        thumbColor={value === true ? thumbColorTrue : thumbColorFalse}
        ios_backgroundColor={iosBackgroundColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 100,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});

export default ToggleSwitch;
