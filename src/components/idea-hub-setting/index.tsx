import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import CustomPicker from '../custom-picker'; // Adjust the path as needed
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {setConvoSettings} from '../../redux/slices/modal';
import {CasecadeItems} from '../../mock';

const IdeaHubSetting = () => {
  const [cascad, setCascad] = useState(0);
  const dispatch = useAppDispatch();
  const {conversation_setting, token} = useAppSelector(s => s.modal);
  const {cascade, delay, mode, models} = conversation_setting;

  const handleSelect = (selectedItem: any, index: number) => {
    dispatch(
      setConvoSettings({
        key: 'cascade',
        value: selectedItem.value,
      }),
    );
  };
  console.log('cascad', cascade);
  return (
    <View>
      <View>
        <Text style={{fontSize: 25, color: 'white', textAlign: 'center'}}>
          I.D.E.A. Hub
        </Text>
      </View>
      {/* _____________CaseCade____________ */}
      <View style={{paddingHorizontal: 20, marginTop: 10}}>
        <CustomPicker
          data={CasecadeItems}
          onSelect={handleSelect}
          buttonTextAfterSelection={selectedItem =>
            selectedItem ? ` ${selectedItem.label}` : `${cascade}`
          }
          rowTextForSelection={item => item.label}
          defaultButtonText={cascade ? ` ${cascade}` : 'Max messages'}
        />
      </View>
    </View>
  );
};

export default IdeaHubSetting;

const styles = StyleSheet.create({});
