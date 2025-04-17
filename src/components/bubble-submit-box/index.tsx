import React from "react";
import { View } from "react-native";
import Form from "../form-layout";
import BottomActions from "../chat-bottom-actions";

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
}: IProp) => {
  return (
    <View style={{ marginBottom: -15 }}>
      <Form
        InputMaxheight="100"
        handleFileChange={handleFileChange}
        onSubmit={onSubmit}
        clearFile={clearFile}
        onChange={onChange}
        inputValue={inputValue}
        file={file}
        loading={loading}
      />

      <View>
        <BottomActions
          openTopDrawer={openTopDrawer}
          vectorOpen={vectorOpen}
          file={file}
        />
      </View>
    </View>
  );
};

export default BubbleSubmitBox;
