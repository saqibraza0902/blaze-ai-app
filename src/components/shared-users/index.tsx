import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {IConversations, IFolder, IParticipant} from '../../utils/types';
import {useAppSelector} from '../../hooks/useRedux';
import Toast from 'react-native-simple-toast';
import {
  assign_convo_admin,
  assign_folder_admin,
  convo_participants,
  folder_participants,
  remove_convo_user,
  remove_folder_user,
  send_invite,
} from '../../utils/functions';
import {token} from '../../mock';
import {handleApiError} from '../../utils/error';
import MakeAdminIcon from '../../ui/icons/make-admin-icon';
import RemoveUserIcon from '../../ui/icons/remove-user-icon';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomSelect from '../../ui/form/custom-select';
import {useNavigation} from '@react-navigation/native';

interface IProp {
  folder: IFolder | null;
  conversation: IConversations | null;
  handleClose: () => void;
  newsOpen: () => void;
}
const SharedUsers = ({conversation, folder, handleClose, newsOpen}: IProp) => {
  const [participants, setParticipants] = useState([]);
  const [add, setAdd] = useState(false);

  const [showInvite, setShowInvite] = useState(false);
  const folder_id = folder?.id;
  const conversation_id = conversation?.conversation_id;
  const {user} = useAppSelector(s => s.user);

  const [showInvitation, setShowinvitation] = useState<boolean>(false);

  const loggedInUserParticipant = participants.find(
    (el: IParticipant) => el.id === user?.id,
  ) as IParticipant | undefined;
  useEffect(() => {
    const get_data = async () => {
      try {
        if (folder_id) {
          const data = await folder_participants(token, folder_id);

          setParticipants(data.participants);
        } else if (conversation_id) {
          const data = await convo_participants(token, conversation_id);

          setParticipants(data.participants);
        }
      } catch (error) {
        const err = handleApiError(error);
        //    toast.error(err);
      }
    };
    get_data();
  }, [conversation, folder, conversation_id, folder_id, token]);

  const handleRemoveUser = async (id: string) => {
    try {
      if (conversation_id) {
        removeConvoUser(token, id);
      } else if (folder_id) {
        removeFolderUser(token, id);
      }
    } catch (error) {
      Toast.show('Error', 500);
    }
  };
  const RandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleAssignAdmin = async (id: string) => {
    try {
      if (conversation_id) {
        assignConvoAdmin(token, id);
      } else if (folder_id) {
        assignFolderAdmin(token, id);
      }
    } catch (error) {
      Toast.show('Error', 500);
    } finally {
      handleClose();
    }
  };

  const removeConvoUser = async (token: string, uid: string) => {
    const id = conversation_id;
    if (!id) {
      return Toast.show('Conversation id required', 500);
    }
    try {
      const data = await remove_convo_user({id, token, uid});
      Toast.show(data.message, 500);
      const update = participants.filter((el: IParticipant) => el.id !== uid);
      setParticipants(update);
    } catch (error) {
      const err = handleApiError(error);
      Toast.show(err, 500);
    }
  };
  const removeFolderUser = async (token: string, uid: string) => {
    const id = folder_id;
    if (!id) {
      return Toast.show('Folder id required', 500);
    }
    try {
      const data = await remove_folder_user({id, token, uid});
      Toast.show(data.message, 500);
      const update = participants.filter((el: IParticipant) => el.id !== uid);
      setParticipants(update);
    } catch (error) {
      const err = handleApiError(error);
      Toast.show(err, 500);
    }
  };

  const assignConvoAdmin = async (token: string, uid: string) => {
    const id = conversation_id;
    if (!id) {
      return Toast.show('Conversation id required', 500);
    }
    try {
      const data = await assign_convo_admin({id, token, uid});
      Toast.show(data.message, 500);
    } catch (error) {
      const err = handleApiError(error);
      Toast.show(err, 500);
    }
  };
  const assignFolderAdmin = async (token: string, uid: string) => {
    const id = folder_id;
    if (!id) {
      return Toast.show('Folder id required', 500);
    }
    try {
      const data = await assign_folder_admin({id, token, uid});
      Toast.show(data.message, 500);
    } catch (error) {
      const err = handleApiError(error);
      Toast.show(err, 500);
    }
  };
  const MySharedUsers = () => {
    return (
      <View style={sharestyles.container}>
        <View>
          <Text style={sharestyles.memberCount}>
            {participants.length} Members
          </Text>
        </View>

        <ScrollView style={sharestyles.participantsContainer}>
          {participants.map((el: any, index) => (
            <View key={el.id} style={sharestyles.participantItem}>
              <View style={sharestyles.avatarContainer}>
                <View
                  style={[
                    sharestyles.avatar,
                    {backgroundColor: RandomColor()},
                  ]}>
                  <Text style={sharestyles.avatarText}>
                    {el.email.charAt(0).toUpperCase()}
                  </Text>
                  {el.is_admin && <View style={sharestyles.adminBadge} />}
                </View>
              </View>

              <View
                style={[
                  sharestyles.participantInfo,
                  index !== participants.length - 1 && sharestyles.borderBottom,
                ]}>
                <View style={sharestyles.emailContainer}>
                  <Text style={sharestyles.emailText}>{el.email}</Text>
                </View>

                <View style={sharestyles.actionsContainer}>
                  {!el.is_admin ? (
                    <TouchableOpacity
                      onPress={() => {
                        if (loggedInUserParticipant?.is_admin) {
                          handleAssignAdmin(el.id);
                        } else {
                          newsOpen();
                        }
                      }}>
                      <MakeAdminIcon height={25} width={25} color="white" />
                    </TouchableOpacity>
                  ) : (
                    <Text style={sharestyles.adminText}>Admin</Text>
                  )}

                  {index !== participants.length - 1 && (
                    <TouchableOpacity
                      onPress={() => {
                        if (loggedInUserParticipant?.is_admin) {
                          handleRemoveUser(el.id);
                        } else {
                          newsOpen();
                        }
                      }}
                      style={sharestyles.removeButton}>
                      <RemoveUserIcon height={25} width={25} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };
  return (
    <View
    //   style={styles.container}
    //   contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Group Chat Overview</Text>
        </View>

        <MySharedUsers />

        <View style={styles.divider} />

        <View style={styles.arrowContainer}>
          <TouchableOpacity onPress={() => setShowinvitation(!showInvitation)}>
            <Animated.View
              style={{
                transform: [{rotate: showInvitation ? '180deg' : '0deg'}],
              }}>
              <AntDesign name="arrowdown" size={35} color="white" />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={{maxHeight: showInvitation ? 400 : 0, overflow: 'hidden'}}>
          <InviteUser
            conversation_id={conversation_id}
            folder_id={folder_id}
            handleClose={handleClose}
          />
        </View>

        {/* Uncomment if you need these sections */}
        {/* {add && (
          <>
            <View style={styles.sectionDivider} />
            <Share
              conversation_id={conversation_id}
              folder_id={folder_id}
              handleClose={handleClose}
            />
          </>
        )} */}

        {/* {showInvite && conversation_id && (
          <>
            <View style={styles.sectionDivider} />
            <CreateInviteLink
              conversation_id={conversation_id}
              folder_id={folder_id}
              handleClose={handleClose}
            />
          </>
        )} */}
      </View>
    </View>
  );
};

export default SharedUsers;

interface LinkGenerate {
  folder_id: number | undefined;
  conversation_id: string | undefined;
  handleClose: () => void;
}

const ExpireDays = [
  {value: '', label: 'never'},
  {value: '1', label: '1 hour'},
  {value: '6', label: '6 hours'},
  {value: '12', label: '12 hours'},
  {value: '24', label: '1 day'},
  {value: '168', label: '7 days'},
];

const MaxUsage = [
  {value: '', label: 'no limit'},
  {value: '1', label: '1 use'},
  {value: '5', label: '5 uses'},
  {value: '10', label: '10 uses'},
  {value: '15', label: '15 uses'},
];

const InviteUser = ({
  folder_id,
  conversation_id,
  handleClose,
}: LinkGenerate) => {
  const [formField, setFormfield] = useState({
    expirydate: '',
    maxuser: '',
  });
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectChange = (field: string, value: string) => {
    setFormfield(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let body: any = folder_id
        ? {
            folder_id: folder_id,
            usage_limit: formField.maxuser,
            expires_in_hours: Number(formField.expirydate),
          }
        : {
            conversation_id: conversation_id,
          };

      if (formField.maxuser !== '') {
        body.usage_limit = formField.maxuser;
      }
      if (formField.expirydate !== '') {
        body.expires_in_hours = Number(formField.expirydate);
      }
      const data = await send_invite(JSON.stringify(token), body);

      setLink(data?.invite_link);
      Toast.show('Success', 500);
    } catch (error) {
      const err = handleApiError(error);
      Toast.show(err, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    // if (Platform.OS === 'web') {
    //   await navigator.clipboard.writeText(link);
    // } else {
    //   // For mobile, you might use a clipboard library like @react-native-clipboard/clipboard
    //   // Clipboard.setString(link);
    // }
    // Toast.show({
    //   type: 'success',
    //   text1: 'Link copied to the clipboard',
    // });
  };

  const handleSubmitEmail = async () => {
    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    if (!email || !validateEmail(email)) {
      Toast.show('Please enter a valid email', 500);
      return;
    }

    try {
      const body = folder_id
        ? {folder_id: folder_id, email: email}
        : {conversation_id: conversation_id, email: email};

      const data = await send_invite(token, body);
      Toast.show(data.status, 500);
      handleClose();
    } catch (error) {
      const err = handleApiError(error);
      Toast.show(err, 500);
    }
  };

  return (
    <View style={invitestyles.container}>
      <View style={invitestyles.section}>
        <Text style={invitestyles.title}>Invite a Member Via E-Mail</Text>
        <View style={invitestyles.emailInputContainer}>
          <TextInput
            onChangeText={setEmail}
            style={invitestyles.emailInput}
            placeholder="Write Email to Invite"
            placeholderTextColor="#999"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={invitestyles.addButton}
            onPress={handleSubmitEmail}>
            <AntDesign name="plus" color="white" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Generate Invite Link Section */}
      <View style={invitestyles.section}>
        <Text style={invitestyles.title}>Or, create an invite Link</Text>

        <View style={invitestyles.selectContainer}>
          <CustomSelect
            // label="Expire after"
            data={ExpireDays}
            onSelect={(value: string) =>
              handleSelectChange('expirydate', value)
            }
            defaultButtonText={ExpireDays[0].label}
          />
        </View>

        <View style={[invitestyles.selectContainer, {marginTop: 16}]}>
          <CustomSelect
            // label="Max number of uses"
            data={MaxUsage}
            onSelect={(value: string) => handleSelectChange('maxuser', value)}
            defaultButtonText={MaxUsage[0].label}
            // placeholder="no limit"
          />
        </View>

        <TouchableOpacity
          onPress={link ? handleCopy : handleSubmit}
          style={[
            invitestyles.generateButton,
            loading && invitestyles.loadingButton,
          ]}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size={10} />
          ) : (
            <View style={invitestyles.buttonContent}>
              {link ? (
                <>
                  <Text
                    style={invitestyles.linkText}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {link}
                  </Text>
                  <MaterialIcons name="content-copy" color="white" size={20} />
                </>
              ) : (
                <Text style={invitestyles.buttonText}>
                  Generate Invite Link
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const sharestyles = StyleSheet.create({
  container: {
    backgroundColor: '#272727',
    padding: 8,
    borderRadius: 8,
  },
  memberCount: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  participantsContainer: {
    marginTop: 12,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  adminBadge: {
    position: 'absolute',
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'pink',
    top: 0,
    left: 0,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 8,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  emailContainer: {
    flex: 1,
  },
  emailText: {
    color: 'white',
    paddingHorizontal: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 12,
  },
  adminText: {
    fontSize: 12,
    color: '#BCBCBC',
  },
  removeButton: {
    marginLeft: 8,
  },
});
const invitestyles = StyleSheet.create({
  container: {
    backgroundColor: '#272727',
    padding: 8,
    borderRadius: 8,
  },
  section: {
    marginVertical: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  emailInputContainer: {
    backgroundColor: '#121212',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  emailInput: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    padding: 8,
  },
  addButton: {
    backgroundColor: '#68BEBF',
    borderRadius: 20,
    padding: 4,
    marginLeft: 8,
  },
  selectContainer: {
    marginBottom: 8,
  },
  generateButton: {
    backgroundColor: '#68BEBF',
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    marginTop: 8,
  },
  loadingButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  linkText: {
    color: 'white',
    flex: 1,
    marginRight: 16,
  },
  buttonText: {
    color: 'white',
    width: '100%',
    textAlign: 'center',
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  mainContainer: {
    width: '100%',
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'white',
    marginVertical: 16,
  },
  sectionDivider: {
    height: 1,
    width: '100%',
    backgroundColor: '#94a3b8',
    marginVertical: 20,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
});
