import {Button, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {STATIC_COLORS} from '../../constant/Colors';

const DeleteFolder = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.delText}>Do you want to delete this folder</Text>
      <View style={styles.btnContainer}>
        <Pressable
          style={[styles.btnBox, {backgroundColor: STATIC_COLORS.salate_300}]}>
          <Text style={styles.text}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.btnBox, {backgroundColor: STATIC_COLORS.red}]}>
          <Text style={styles.text}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DeleteFolder;

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  delText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  btnContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  btnBox: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    padding: 10,
  },
  text: {
    color: '#fff',
    fontWeight: '500',
  },
});
