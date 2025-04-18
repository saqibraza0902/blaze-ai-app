import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

interface CustomPickerProps<T> {
  data: T[];
  onSelect: (selectedItem: T, index: number) => void;
  buttonTextAfterSelection?: (selectedItem: T) => string;
  rowTextForSelection: (item: T) => string;
  buttonStyle?: object;
  buttonTextStyle?: object;
  dropdownStyle?: object;
  defaultButtonText?: string;
}

const CustomPicker = <T,>({
  data,
  onSelect,
  buttonTextAfterSelection,
  rowTextForSelection,
  buttonStyle,
  buttonTextStyle,
  dropdownStyle,
  defaultButtonText,
}: CustomPickerProps<T>) => {
  return (
    <SelectDropdown
      data={data}
      onSelect={onSelect}
      //@ts-ignore
      buttonTextAfterSelection={buttonTextAfterSelection}
      rowTextForSelection={rowTextForSelection}
      renderButton={(selectedItem, isOpened) => (
        <View style={[styles.dropdownButtonStyle, buttonStyle]}>
          <Text style={styles.dropdownButtonTxtStyle}>
            {(selectedItem && buttonTextAfterSelection?.(selectedItem)) ||
              defaultButtonText}
          </Text>
        </View>
      )}
      renderItem={(item, index, isSelected) => (
        <View
          style={{
            ...styles.dropdownItemStyle,
            ...(isSelected && {backgroundColor: '#68BEBF'}),
          }}>
          <Text style={styles.dropdownItemTxtStyle}>
            {rowTextForSelection(item)}
          </Text>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      dropdownStyle={dropdownStyle}
      rowStyle={styles.dropdownItemStyle}
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
    fontWeight: '500',
    color: 'white',
  },
  dropdownItemStyle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#1E1E1E',
  },
  dropdownItemTxtStyle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
});

export default CustomPicker;
