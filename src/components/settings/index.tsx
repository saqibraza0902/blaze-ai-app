import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
  Linking,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {useNavigation} from '@react-navigation/native';
import {setConvoNull, setLogout} from '../../redux/slices/conversation';
import {setModal, setTokenNull} from '../../redux/slices/modal';
import {setUser} from '../../redux/slices/user';
import {get, save} from '../../utils/theme-storage';
import {setTheme} from '../../redux/slices/theme';
import {Colors} from '../../constant/Colors';
// import {useAppTheme} from '../../provider/theme-provider';

interface SettingsProps {
  openFeedback: () => void;
  toggleInstructionModal: () => void;
  onClose?: () => void;
}

const Settings = ({
  openFeedback,
  toggleInstructionModal,
  onClose,
}: SettingsProps) => {
  const {user, token} = useAppSelector(s => ({
    user: s.user.user,
    token: s.modal.token,
  }));
  const {theme} = useAppSelector(s => s.theme);
  // const { toggleTheme } = useAppTheme();
  const colors = Colors[theme];

  // const {colors, dark} = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    feedback_count: 0,
    conversation_count: 0,
    message_count: 0,
  });

  const handleLogout = () => {
    dispatch(setConvoNull());
    dispatch(setLogout());
    dispatch(setTokenNull());
    dispatch(setUser(null));
    onClose?.();
  };

  const clickhere = async () => {
    try {
      onClose?.();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const get_stats = async () => {
      try {
        // const res = await get_feedback(token);
        // setFeedbackData({
        //   feedback_count: res?.data?.feedback_count,
        //   conversation_count: res?.data?.stats?.conversation_count,
        //   message_count: res?.data?.stats?.message_count,
        // });
      } catch (error) {
        console.error(error);
      }
    };
    get_stats();
  }, [token]);

  const shouldShowFeedback =
    (feedbackData.conversation_count > 5 &&
      feedbackData.message_count > 10 &&
      feedbackData.feedback_count < 1) ||
    (feedbackData.conversation_count > 20 &&
      feedbackData.message_count > 50 &&
      feedbackData.feedback_count < 2);
  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
  };
  const baseOptions = [
    {
      text: 'Switch Theme',
      icon: 'color-palette',
      action: () => {
        // setTheme(theme === "dark" ? "light" : "dark");
        toggleTheme();
        // onClose?.();
      },
    },
    {
      text: 'Profile Settings',
      icon: 'person',
      action: () => {
        Linking.openURL('https://www.blazeai.io/profile-settings');
        onClose?.();
      },
    },
    {
      text: 'Billing Information',
      icon: 'card',
      action: () => {
        clickhere();
        onClose?.();
      },
    },
    {
      text: 'Instructions',
      icon: 'help-circle',
      action: () => {
        toggleInstructionModal();
        onClose?.();
      },
    },
    {
      text: 'Logout',
      icon: 'log-out',
      action: () => {
        handleLogout();
        onClose?.();
      },
    },
  ];

  const feedbackOption = {
    text: 'Feedback',
    icon: 'chatbox-ellipses',
    action: () => {
      openFeedback();
      onClose?.();
    },
  };

  const NORMAL_OPTIONS = shouldShowFeedback
    ? [...baseOptions.slice(0, 4), feedbackOption, baseOptions[4]]
    : baseOptions;

  const upgradedOption = {
    text: 'Upgrade to Blaze Max',
    icon: 'rocket',
    action: () => {
      // navigation.navigate('Pricing');
      onClose?.();
    },
  };

  const UPGRADED_OPTIONS = shouldShowFeedback
    ? [upgradedOption, ...NORMAL_OPTIONS]
    : [upgradedOption, ...baseOptions];

  const OPTIONS =
    user?.planConnections?.[0]?.type === 'FREE'
      ? UPGRADED_OPTIONS
      : NORMAL_OPTIONS;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => setShowMenu(!showMenu)}>
        <View style={styles.profileInfo}>
          <Image
            source={{uri: user?.profileImage}}
            style={styles.profileImage}
          />
          <Text style={[styles.profileName, {color: colors.text}]}>
            {user?.customFields?.['first-name']}{' '}
            {user?.customFields?.['last-name']}
          </Text>
        </View>
        <Ionicons name="settings-outline" size={24} color={colors.text} />
      </TouchableOpacity>

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}>
          <View
            style={[
              styles.menuContainer,
              {
                backgroundColor: colors.settingscardbg,
                shadowColor: colors.text,
              },
            ]}>
            <ScrollView>
              {OPTIONS.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.menuItem,
                    i === 0 &&
                      user?.planConnections?.[0]?.type === 'FREE' &&
                      styles.upgradeItem,
                  ]}
                  onPress={() => {
                    item.action();
                    setShowMenu(false);
                  }}>
                  <View style={styles.menuItemContent}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={
                        i === 0 && user?.planConnections?.[0]?.type === 'FREE'
                          ? '#fff'
                          : colors.text
                      }
                    />
                    <Text
                      style={[
                        styles.menuItemText,
                        {
                          color:
                            i === 0 &&
                            user?.planConnections?.[0]?.type === 'FREE'
                              ? '#fff'
                              : colors.text,
                        },
                      ]}>
                      {item.text}
                    </Text>
                  </View>
                  {/* {i === 0 && user?.planConnections?.[0]?.type === 'FREE' && (
                    <Image
                      source={require('../../../assets/sprinkles.png')}
                      style={styles.sprinkles}
                    />
                  )} */}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    paddingBottom: 90,
  },
  menuContainer: {
    maxHeight: '60%',
    borderRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  upgradeItem: {
    backgroundColor: '#6a4bed',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  sprinkles: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 30,
    height: 30,
  },
});

export default Settings;
