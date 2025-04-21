import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface ProgressBarProps {
  value: number; // Percentage of storage used
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({value, total}) => {
  const usagePercentage = Math.min(Math.max(value, 0), 100); // Clamp between 0-100
  const textColor = usagePercentage > 30 ? '#FFFFFF' : '#000000';

  return (
    <View style={styles.container}>
      <View style={[styles.progress, {width: `${usagePercentage}%`}]} />
      <View style={styles.textOverlay}>
        <Text style={[styles.text, {color: textColor}]}>
          {value.toFixed(1)} / {total.toFixed(1)} GB
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: '100%',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  progress: {
    height: '100%',
    backgroundColor: '#68BEBF',
    borderRightWidth: 1,
    borderColor: '#68BEBF',
  },
  textOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ProgressBar;
