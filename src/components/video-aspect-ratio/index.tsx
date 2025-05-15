import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {setRatio} from '../../redux/slices/model';

const aspectRatios = [
  {label: '16 : 9', value: 16 / 9, val: '16:9'},
  {label: '9 : 16', value: 9 / 16, val: '9:16'},
  {label: '1 : 1', value: 1, val: '1:1'},
  {label: '4 : 3', value: 4 / 3, val: '4:3'},
  {label: '2.35 : 1', value: 2.35, val: '2.35:1'},
];

const VideoAspectRatio = () => {
  const {ratio: reduxRatio} = useAppSelector(s => s.model);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const {focus} = useAppSelector(s => s.model);
  const dispatch = useAppDispatch();

  if (focus !== 'generate_video') {
    return null;
  }
  const {ratio} = useAppSelector(s => s.model);

  return (
    <View style={styles.container}>
      {aspectRatios.map(ratio => {
        const isSelected = reduxRatio === ratio.val;

        return (
          <TouchableOpacity
            key={ratio.label}
            style={[styles.ratioButton, isSelected && styles.selectedButton]}
            onPress={() => dispatch(setRatio(ratio.val))}
            onPressIn={() => setTooltip(ratio.label)}
            onPressOut={() => setTooltip(null)}
            activeOpacity={0.7}>
            <View style={[styles.ratioPreview, {height: 20 / ratio.value}]} />

            {/* Always visible label */}
            <Text style={styles.label}>{ratio.label}</Text>

            {/* Tooltip for small screens (shown on press) */}
            {/* {tooltip === ratio.label && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>{ratio.label}</Text>
              </View>
            )} */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',

    zIndex: 0,
  },
  ratioButton: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'white',
    borderColor: 'transparent',
  },
  selectedButton: {
    borderColor: '#000',
  },
  ratioPreview: {
    width: 20,
    backgroundColor: 'black',
    borderRadius: 4,
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: 'black',
    fontWeight: '500',
  },
  tooltip: {
    position: 'absolute',
    top: -24,
    alignSelf: 'center',
    backgroundColor: '#1f2937',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tooltipText: {
    color: 'white',
    fontSize: 10,
  },
});

export default VideoAspectRatio;
