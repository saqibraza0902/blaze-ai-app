import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {Colors} from '../../../constant/Colors';
import {useAppSelector} from '../../../hooks/useRedux';
// import {useAppSelector} from '../../hooks/useRedux';
// import {Colors} from '../../constant/Colors';

interface IProp<T> {
  data: {value: string; label: string}[];

  onSelect: (selectedItem: string) => void;
  buttonTextAfterSelection?: (selectedItem: T) => string;
  rowTextForSelection?: (item: T) => string;
  buttonStyle?: object;
  buttonTextStyle?: object;
  dropdownStyle?: object;
  defaultButtonText?: string;
}

const CustomSelect = <T,>({
  data,
  onSelect,
  buttonTextAfterSelection,
  rowTextForSelection,
  buttonStyle,
  buttonTextStyle,
  dropdownStyle,
  defaultButtonText,
}: IProp<T>) => {
  const {theme} = useAppSelector(s => s.theme);
  const Theme_colors = Colors[theme];
  return (
    <SelectDropdown
      data={data}
      onSelect={onSelect}
      //@ts-ignore

      //   buttonTextAfterSelection={buttonTextAfterSelection}
      rowTextForSelection={rowTextForSelection}
      renderButton={(selectedItem, isOpened) => (
        <View
          style={[
            styles.dropdownButtonStyle,
            buttonStyle,
            {backgroundColor: Theme_colors.dropdownbg},
          ]}>
          <Text style={styles.dropdownButtonTxtStyle}>
            {selectedItem?.label || defaultButtonText}
          </Text>
        </View>
      )}
      renderItem={(item, index, isSelected) => (
        <View
          style={{
            ...styles.dropdownItemStyle,
            ...(isSelected && {backgroundColor: '#68BEBF'}),
          }}>
          <View
            style={{
              height: 15,
              width: 15,
              backgroundColor: item,
              borderRadius: 50,
            }}
          />
          <Text
            style={[styles.dropdownItemTxtStyle, {color: Theme_colors.text}]}>
            {item.label}
          </Text>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      dropdownStyle={{
        backgroundColor: Theme_colors.dropdownbg,
        borderRadius: 15,
      }}
      rowStyle={[styles.dropdownItemStyle]}
      rowTextStyle={styles.dropdownItemTxtStyle}
      buttonStyle={buttonStyle}
      buttonTextStyle={buttonTextStyle}
      dropdownOverlayColor="rgba(0, 0, 0, 0.3)"
    />
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: '100%',
    height: 40,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    fontSize: 14,
    width: '100%',
    color: '#fff',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',

    // justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 10,
    borderRadius: 10,
  },
  dropdownItemTxtStyle: {
    fontSize: 14,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
});

export default CustomSelect;
