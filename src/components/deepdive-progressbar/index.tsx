import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Animated, StyleSheet} from 'react-native';

interface IProp {
  duration?: number; // in milliseconds
  label?: string;
  loading: boolean;
}

const DeepDiveProgressBar = ({
  duration = 300000, // 5 minutes
  label = 'Deep Dive in Progress...',
  loading,
}: IProp) => {
  const animation = useRef(new Animated.Value(0)).current;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 100,
      duration,
      useNativeDriver: false,
    }).start();

    const listener = animation.addListener(({value}) => {
      setProgress(value);
    });

    return () => {
      animation.removeListener(listener);
    };
  }, [animation, duration]);

  return (
    <View
      style={[
        styles.container,
        loading ? {display: 'flex'} : {display: 'none'},
      ]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.bar,
            {
              width: animation.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.percent}>{Math.round(progress)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginVertical: 10},
  label: {color: '#ccc', marginBottom: 4},
  track: {
    height: 10,
    backgroundColor: '#444',
    borderRadius: 5,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#68BEBF',
  },
  percent: {
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },
});

export default DeepDiveProgressBar;
