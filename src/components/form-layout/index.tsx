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
interface IProp {
  onChange?: (e: any) => void;
  clearFile?: (e: any) => void;
  onSubmit?: (e: React.ChangeEvent<HTMLFormElement>) => void;
  inputValue?: string;
  file?: any;
  handleFileChange?: any;
  loading?: boolean;
  InputMaxheight?: string;
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
}: IProp) => {
  //   const { convo_users } = useAppSelector((s) => s.convo);

  return (
    <View style={styles.container}>
      {/* File Display */}
      {file && (
        <View style={styles.fileContainer}>
          <Text style={styles.fileText}>
            {/* {truncateFileName(file.name, 10)} */}
            <TouchableOpacity onPress={clearFile}>
              <Text style={styles.clearIcon}>✖</Text>
            </TouchableOpacity>
          </Text>
        </View>
      )}

      <View style={styles.form}>
        <Pressable>
          <IoniconsIcon name="attach" size={28} color="black" />
        </Pressable>
        <TextInput
          style={[
            styles.input,
            {maxHeight: InputMaxheight ? Number(InputMaxheight) : undefined},
          ]}
          value={inputValue}
          onChangeText={onChange}
          placeholder="Send a Message to Blaze"
          //   placeholder={
          //     convo_users.length < 2
          //       ? "Send a Message to Blaze"
          //       : "Write @Blaze to get a response."
          //   }
        />
        <TouchableOpacity
          //   disabled={loading || (!inputValue.trim() && !file)}
          //   onPress={onSubmit}
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
  },
  fileContainer: {
    position: 'absolute',
    top: -24,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A8A', // Example background color
    padding: 4,
    borderRadius: 8,
  },
  fileText: {
    color: '#fff',
    fontSize: 12,
    flex: 1,
    marginRight: 4,
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
