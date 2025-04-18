import React from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import ToggleSwitch from '../../ui/form/toggle-switch';
import KnowledgeBased from '../../ui/icons/knowledge-based-icon';
import {AppColors} from '../../constant/Colors';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {Modals} from '../../utils/enums';
import {
  setConvoSettings,
  setFocus,
  setFocusNull,
  setModal,
} from '../../redux/slices/modal';
import FocusModeIcon from '../../ui/icons/focus-mode';
import {FOCUS_MODES} from '../../mock';
import {background} from 'native-base/lib/typescript/theme/styled-system';

// import { useAppDispatch, useAppSelector } from "@/hooks/Hooks";
// import {
//   setFocus,
//   setFocusNull,
//   setModal,
//   setConvoSettings,
// } from "@/redux/slices/modal";
// import { Modals } from "@/utils/enums";
// import { toast } from "react-native-toast-message";
// import { FOCUS_MODES } from "@/mock";
// import FocusModeIcon from "@/ui/icons/focus-mode-icon";
// import KnowledgeBaseIcon from "@/ui/icons/knowledge-base-i  con";

interface SwitchBarProps {
  justify?: 'space-between' | 'center' | 'flex-start' | 'flex-end';
  file: any;
  vectorOpen: () => void;
  openTopDrawer?: () => void;
}

const BottomActions = ({
  justify = 'space-between',
  file,
  vectorOpen,
  openTopDrawer,
}: SwitchBarProps) => {
  const {modal, focus, conversation_setting, token} = useAppSelector(
    (state: any) => state.modal,
  );
  const {user} = useAppSelector((state: any) => state.user);
  const dispatch = useAppDispatch();
  const mode = conversation_setting?.mode;

  // const isLoggedIn = !!token;
  // const freeuser = user?.planConnections[0]?.type === 'FREE';
  let isLoggedIn = true;
  let freeuser = false;
  const handleToggle = () => {
    if (isLoggedIn && !freeuser) {
      const setModel =
        modal === Modals.BlazeMax ? Modals.Blaze : Modals.BlazeMax;
      dispatch(setConvoSettings({key: 'mode', value: 'normal'}));
      dispatch(setModal(setModel));

      if (setModel === Modals.Blaze) {
        dispatch(setFocusNull());
      }
    } else {
      // toast.show({ type: "error", text1: "Please update your plan" });
      console.log('Please update your plan');
    }
  };

  const SelectedItemHandle = (itm: any) => {
    dispatch(setFocus(itm.value));
  };

  const handleKnowledgeBase = () => {
    if (isLoggedIn && !freeuser) {
      if (modal === Modals.BlazeMax) {
        vectorOpen();
      } else {
        // toast.show({ type: "error", text1: "Please turn on Blaze Max" });

        console.log('Please turn on Blaze Max');
      }
    } else {
      // toast.show({ type: "error", text1: "Please update your plan" });
      console.log('Please update your plan');
    }
  };

  const FocusMenu = () => {
    const focusPoint = FOCUS_MODES.find((itm: any) => itm.value === focus);

    return (
      <View style={styles.focusMenu}>
        {focusPoint ? (
          <focusPoint.icon
            // style={{width: 25, height: 25}}
            fill={modal === Modals.BlazeMax ? '#68BEBF' : '#000'}
          />
        ) : (
          <FocusModeIcon
            style={{width: 25, height: 25}}
            fill={modal === Modals.BlazeMax ? '#68BEBF' : '#000'}
          />
        )}
        <Text style={styles.focusLabel}>
          {focusPoint ? focusPoint.Label : 'Focus'}
        </Text>
      </View>
    );
  };
  console.log('modal', modal);
  return (
    <View style={styles.container}>
      <View style={[styles.row, {justifyContent: justify}]}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          <View style={[styles.toggleContainer]}>
            <ToggleSwitch
              onToggle={handleToggle}
              initialValue={modal === Modals.BlazeMax ? true : false}
            />
            <Text style={styles.label}>Blaze Max</Text>
          </View>
          <FocusMenu />
        </View>

        {/* Right Section */}
        <TouchableOpacity
          onPress={handleKnowledgeBase}
          style={styles.kbContainer}
          //   onPress={handleKnowledgeBase}
        >
          {/* <KnowledgeBaseIcon
            height={40}
            width={40}
            color={modal === Modals.BlazeMax ? "#68BEBF" : "#000"}
          /> */}
          <KnowledgeBased
            style={{width: 30, height: 30}}
            fill={modal === Modals.BlazeMax ? '#68BEBF' : 'white'}
          />
          {/* <Text style={styles.kbLabel}>Knowledge Base</Text> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomActions;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
  },
  focusScroll: {
    flexDirection: 'row',
  },
  focusItem: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  focusItemActive: {
    backgroundColor: '#d3d3d3',
  },
  focusText: {
    color: 'white',
    marginTop: 4,
    fontSize: 12,
  },
  focusTextActive: {
    color: 'black',
  },
  focusMenu: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusLabel: {
    marginLeft: 3,
    fontSize: 12,
    color: '#000',
  },
  kbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.gray_700,
    paddingHorizontal: 5,
    borderRadius: 8,
  },
  kbLabel: {
    fontSize: 12,
    color: '#000',
  },
});
