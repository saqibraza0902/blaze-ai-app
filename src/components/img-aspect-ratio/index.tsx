import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {setImageDimensions} from '../../redux/slices/conversation';

// import {setImageDimensions} from '@/redux/slices/modal';

const aspectRatios = [
  {label: '1536 x 1024', width: 1536, height: 1024, val: '1536x1024'},
  {label: '1024 x 1536', width: 1024, height: 1536, val: '1024x1536'},
  {label: '1024 x 1024', width: 1024, height: 1024, val: '1024x1024'},
];

const ImageAspectRatio = () => {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const {focus} = useAppSelector(s => s.model);
  const {image} = useAppSelector(s => s.convo);
  const dispatch = useAppDispatch();

  if (focus !== 'image_generation') {
    return null;
  }
  //   console.log('image', image);
  return (
    <View style={styles.container}>
      {aspectRatios.map(({label, width, height, val}) => {
        const isSelected = image && image.size === val;

        return (
          <TouchableOpacity
            key={label}
            style={[styles.ratioButton, isSelected && styles.selectedButton]}
            onPress={() =>
              dispatch(setImageDimensions({type: 'size', size: val}))
            }
            onPressIn={() => setTooltip(label)}
            onPressOut={() => setTooltip(null)}
            activeOpacity={0.7}>
            <View
              style={[
                styles.ratioPreview,
                {
                  width: width / 50,
                  height: height / 50,
                },
              ]}
            />

            <Text style={styles.label}>{label}</Text>

            {/* {tooltip === label && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>{label}</Text>
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 16,
  },
  ratioButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    height: '66%',
  },
  selectedButton: {
    borderColor: '#000',
  },
  ratioPreview: {
    backgroundColor: 'black',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 4,
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

export default ImageAspectRatio;
