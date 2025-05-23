import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {AppColors} from '../../constant/Colors';
// import { useAppSelector } from "@/hooks/Hooks";
// import { truncateFileName } from "@/utils/truncate-file-name";
// import { RxCross1 } from "react-icons/rx";
//@ts-ignore
import Icon from 'react-native-vector-icons/AntDesign';
//@ts-ignore
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {useAppSelector} from '../../hooks/useRedux';
import {ChatModels} from '../../utils/enums';
interface IProp {
  onChange?: (e: any) => void;
  clearFile?: (e: any) => void;
  onSubmit: () => void;
  inputValue?: string;
  file?: any;
  handleFileChange?: any;
  loading?: boolean;
  InputMaxheight?: string;
  id?: string;
}

const Form = ({
  onSubmit,
  onChange,
  inputValue,
  loading,
  file,
  handleFileChange,
  InputMaxheight,
  clearFile,
  id,
}: IProp) => {
  const {model} = useAppSelector(s => s.model);
  const {theme} = useAppSelector(s => s.theme);
  return (
    <View style={styles.container}>
      {/* File Display */}
      {file && (
        <View style={[styles.fileContainer, {top: id ? -40 : -40}]}>
          <Text style={styles.fileText}>
            {file.name.length > 10
              ? `${file.name.slice(0, 10)}...${file.name.slice(-4)}`
              : file.name}
          </Text>
          <TouchableOpacity onPress={clearFile}>
            <Text style={styles.clearIcon}>✖</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.form}>
        <Pressable onPress={handleFileChange}>
          <IoniconsIcon
            name="attach"
            size={28}
            color={
              model === ChatModels.BlazeMax
                ? id && theme === 'dark'
                  ? 'white'
                  : 'black'
                : 'gray'
            }
          />
        </Pressable>
        <TextInput
          style={[
            styles.input,
            {
              maxHeight: InputMaxheight ? Number(InputMaxheight) : undefined,
              color: id && theme === 'dark' ? 'white' : 'black',
            },
          ]}
          value={inputValue}
          onChangeText={onChange}
          placeholderTextColor={id && theme === 'dark' ? 'white' : 'black'}
          multiline={id ? true : false}
          numberOfLines={4}
          placeholder="Send a Message to Blaze"
          //   placeholder={
          //     convo_users.length < 2
          //       ? "Send a Message to Blaze"
          //       : "Write @Blaze to get a response."
          //   }
        />
        <TouchableOpacity
          //   disabled={loading || (!inputValue.trim() && !file)}
          onPress={() => onSubmit()}
          style={[
            styles.submitButton,
            // loading || (!inputValue.trim() && !file) ? styles.disabled : {},
          ]}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="arrowup" size={24} color={AppColors.gray_200} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  fileContainer: {
    position: 'absolute',

    left: 20,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#0D0D0D', // Example background color
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  fileText: {
    color: '#fff',
    fontSize: 12,
  },
  clearIcon: {
    color: '#fff',
    fontSize: 16,
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -5,
  },
  input: {
    flex: 1,

    borderRadius: 8,
  },
  submitButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.light_blue_300, // Example color
    borderRadius: 50,
  },
  disabled: {
    opacity: 0.5,
  },
  submitIcon: {
    color: '#fff',
    fontSize: 24,
  },
});

export default Form;
