import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
  ScrollView,
  TextInput,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ToggleSwitch from '../../ui/form/toggle-switch';
import KnowledgeBased from '../../ui/icons/knowledge-based-icon';
import {AppColors} from '../../constant/Colors';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import Toast from 'react-native-simple-toast';
import {ChatModels} from '../../utils/enums';
import {setModel, setFocus, setFocusNull} from '../../redux/slices/model';
import FocusModeIcon from '../../ui/icons/focus-mode';
import {FOCUS_MODES} from '../../mock';
import {
  setConvoSettings,
  setImageDimensions,
} from '../../redux/slices/conversation';

interface SwitchBarProps {
  justify?: 'space-between' | 'center' | 'flex-start' | 'flex-end';
  file: any;
  vectorOpen: () => void;
  openTopDrawer?: () => void;
  id?: string;
}

const BottomActions = ({
  justify = 'space-between',
  file,
  vectorOpen,
  openTopDrawer,
  id,
}: SwitchBarProps) => {
  const {conversation_setting, image} = useAppSelector(s => s.convo);
  const {model, focus} = useAppSelector(state => state.model);
  const {user, token} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const mode = conversation_setting?.mode;
  const [showmenu, setShowMenu] = useState(false);
  const {theme} = useAppSelector(s => s.theme);
  const {width} = Dimensions.get('window');
  const isLoggedIn = !!token;
  const freeuser = user?.planConnections[0]?.type === 'FREE';
  const isImgVid =
    focus === 'generate_video' || focus === 'image_generation' ? true : false;
  const isImage = focus === 'image_generation' ? true : false;
  const handleToggle = () => {
    if (isLoggedIn && !freeuser) {
      const mymodal =
        model === ChatModels.BlazeMax ? ChatModels.Blaze : ChatModels.BlazeMax;
      dispatch(setConvoSettings({key: 'mode', value: 'normal'}));
      dispatch(setModel(mymodal));

      if (mymodal === ChatModels.Blaze) {
        dispatch(setFocusNull());
      }
    } else {
      Toast.show('Please update your plan', Toast.LONG);
    }
  };

  const SelectedItemHandle = (itm: any) => {
    dispatch(setFocus(itm.value));
  };

  const handleKnowledgeBase = () => {
    if (isLoggedIn && !freeuser) {
      if (model === ChatModels.BlazeMax) {
        openTopDrawer && openTopDrawer();
      } else {
        Toast.show('Please turn on Blaze Max', Toast.LONG);
      }
    } else {
      // toast.show({ type: "error", text1: "Please update your plan" });
      Toast.show('Please update your plan', Toast.LONG);
    }
  };
  const Show_Focus_Model = () => {
    if (model === ChatModels.BlazeMax) {
      setShowMenu(true);
    }
  };
  const FocusMenu = () => {
    const focusPoint = FOCUS_MODES.find((itm: any) => itm.value === focus);

    return (
      <Pressable onPress={Show_Focus_Model} style={styles.focusMenu}>
        {focusPoint ? (
          <focusPoint.icon
            style={{width: 25, height: 25}}
            fill={
              model === ChatModels.BlazeMax
                ? '#68BEBF'
                : id && theme === 'dark'
                ? 'white'
                : 'black'
            }
          />
        ) : (
          <FocusModeIcon
            style={{width: 25, height: 25}}
            fill={
              model === ChatModels.BlazeMax
                ? '#68BEBF'
                : id && theme === 'dark'
                ? 'white'
                : 'black'
            }
          />
        )}
        {/* <Text
          style={[
            styles.focusLabel,
            {color: id && theme === 'dark' ? 'white' : 'black'},
          ]}>
          {focusPoint ? focusPoint.Label : 'Focus'}
        </Text> */}
      </Pressable>
    );
  };
  const handleIncrement = () => {
    const newValue = Math.min(image.n + 1, 4); // Limit to max 10 (adjust as needed)
    dispatch(setImageDimensions({type: 'n', n: newValue}));
  };

  const handleDecrement = () => {
    const newValue = Math.max(image.n - 1, 1); // Don't go below 1
    dispatch(setImageDimensions({type: 'n', n: newValue}));
  };
  console.log('image.n', image.n);
  return (
    <View style={styles.container}>
      <View style={[styles.row, {justifyContent: justify}]}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          <View style={[styles.toggleContainer]}>
            <ToggleSwitch
              onValueChange={handleToggle}
              value={model === ChatModels.BlazeMax ? true : false}
            />

            <Text
              style={[
                styles.label,
                {color: id && theme === 'dark' ? 'white' : 'black'},
              ]}>
              Blaze Max
            </Text>
          </View>
          <FocusMenu />
          <Modal
            visible={showmenu}
            transparent
            animationType="fade"
            onRequestClose={() => setShowMenu(false)}>
            <View style={styles.modalOverlay}>
              <Pressable
                onPress={() => setShowMenu(false)}
                style={styles.close}>
                <AntDesign name="close" size={24} color={'white'} />
              </Pressable>
              <View style={[styles.modalContent, {}]}>
                <ScrollView>
                  <View
                    style={{
                      display: 'flex',
                      width: '100%',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 6,
                    }}>
                    {FOCUS_MODES.map((itm, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.focusItem,
                          focus === itm.value && styles.focusItemActive,
                          {width: width / 2 - 38},
                        ]}
                        onPress={() => {
                          SelectedItemHandle(itm);
                          setShowMenu(false);
                        }}>
                        <View>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              gap: 4,
                            }}>
                            <itm.icon
                              style={{width: 25, height: 25}}
                              fill={focus === itm.value ? '#000' : '#fff'}
                            />

                            <Text
                              style={[
                                styles.focusText,
                                focus === itm.value && styles.focusTextActive,
                              ]}>
                              {itm.Label}
                            </Text>
                          </View>
                          <Text
                            style={{
                              color: focus === itm.value ? '#000' : '#fff',
                              fontSize: 12,
                              marginTop: 6,
                            }}>
                            {itm.des}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>

        {/* Right Section */}
        {!isImgVid && (
          <TouchableOpacity
            onPress={handleKnowledgeBase}
            style={styles.kbContainer}>
            <KnowledgeBased
              style={{width: 30, height: 30}}
              fill={model === ChatModels.BlazeMax ? '#68BEBF' : 'white'}
            />
          </TouchableOpacity>
        )}
        {isImage && (
          <View style={styles.ImageIncrement}>
            <TouchableOpacity
              style={styles.incrementButtons}
              onPress={handleIncrement}>
              <Text>+</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.inputStyle}
              readOnly
              value={String(image.n)}
            />
            <TouchableOpacity
              style={styles.incrementButtons}
              onPress={handleDecrement}>
              <Text>-</Text>
            </TouchableOpacity>
          </View>
        )}
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
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // optional for dim effect
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  modalContent: {
    backgroundColor: '#121212',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    height: '90%',
  },
  close: {
    padding: 16,
    width: 60,

    zIndex: 100,
  },
  ImageIncrement: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    height: 35,
  },
  incrementButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    width: 30,
    borderRadius: 10,
    backgroundColor: '#D8D8D9',
  },
  inputStyle: {
    width: 30,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 5,
    textAlign: 'center',
    fontSize: 12,
    color: 'black',
    marginBottom: -3,
  },
});
