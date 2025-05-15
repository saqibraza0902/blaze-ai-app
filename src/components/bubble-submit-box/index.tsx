import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Form from '../form-layout';
import BottomActions from '../chat-bottom-actions';
import {useAppSelector} from '../../hooks/useRedux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import InteruptIcon from '../../ui/icons/interupt-icon';
import DeepresearchIcon from '../../ui/icons/deep-search-icon';
interface IProp {
  handleFileChange: () => void;
  onSubmit: () => void;
  clearFile: () => void;
  onChange: () => void;
  inputValue: string;
  file: any;
  vectorOpen: () => void;
  loading: boolean;
  openTopDrawer?: () => void;
  id?: string;
}
const BubbleSubmitBox = ({
  handleFileChange,
  onSubmit,
  clearFile,
  onChange,
  inputValue,
  file,
  loading,
  openTopDrawer,
  vectorOpen,
  id,
}: IProp) => {
  const {conversation_setting} = useAppSelector(s => s.convo);
  return (
    <View style={[id ? styles.ChatBox : null]}>
      <View style={{width: '100%'}}>
        <Form
          InputMaxheight="75"
          handleFileChange={handleFileChange}
          onSubmit={onSubmit}
          clearFile={clearFile}
          onChange={onChange}
          inputValue={inputValue}
          file={file}
          loading={loading}
          id={id}
        />
      </View>

      <View>
        {id ? (
          <View>
            {conversation_setting.mode === 'normal' && (
              <BottomActions
                openTopDrawer={openTopDrawer}
                vectorOpen={vectorOpen}
                file={file}
                id={id}
              />
            )}
            {conversation_setting.mode === 'deep_dive' && (
              <View style={styles.deepdiveBox}>
                <AntDesign name="search1" size={20} />
                <Text style={{fontWeight: '500'}}>Deep Dive</Text>
              </View>
            )}
            {conversation_setting.mode === 'deep_research' && (
              <View style={styles.ideahubBox}>
                <View style={styles.stopFlowBox}>
                  <Text style={styles.stopFlow}>Stop flow</Text>
                  <InteruptIcon height={30} width={30} />
                </View>
                <View style={styles.deepRBox}>
                  <DeepresearchIcon height={30} width={30} />
                  <Text>I.D.E.A Hub</Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <BottomActions
            openTopDrawer={openTopDrawer}
            vectorOpen={vectorOpen}
            file={file}
            id={id}
          />
        )}
      </View>
    </View>
  );
};

export default BubbleSubmitBox;
const styles = StyleSheet.create({
  ChatBox: {marginBottom: 0},
  deepdiveBox: {
    height: 40,
    justifyContent: 'center',
    flexDirection: 'row',
    width: 120,
    alignSelf: 'flex-end',
    borderRadius: 50,
    paddingHorizontal: 10,
    gap: 10,
    marginTop: 20,
    backgroundColor: '#BCBCBC',
    alignItems: 'center',
  },
  ideahubBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
    marginTop: 10,
  },
  stopFlowBox: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#DC2626',
  },
  stopFlow: {
    fontWeight: '500',
    color: '#fff',
  },
  deepRBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#BCBCBC',
  },
});
