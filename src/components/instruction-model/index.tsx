import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import ModalPopover from '../modal';

const TABS = {
  tab1: 'Behavior & Instructions',
  tab2: 'Business info',
};
interface InstProps {
  Open: boolean;
  onClose: () => void;
}
interface ICustomFields {
  behaviour: string | undefined;
  personal: string | undefined;
  'business-description': string | undefined;
  Company: string | undefined;
}

const InstructionModel: React.FC<InstProps> = ({onClose, Open}) => {
  const {user} = useAppSelector(s => s.user);
  const {token} = useAppSelector(s => s.modal);
  const dispatch = useAppDispatch();

  const [selectedTab, setSelectedTab] = useState('tab1');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ICustomFields>({
    behaviour: '',
    personal: '',
    'business-description': '',
    Company: '',
  });

  useEffect(() => {
    setData({
      'business-description': user?.customFields['business-description'],
      personal: user?.customFields.personal,
      behaviour: user?.customFields.behaviour,
      Company: user?.customFields.company,
    });
  }, [user]);

  //   useEffect(() => {
  //     const userData = async () => {
  //       const currentUser: any = token ? jwtDecode(token) : {};
  //       try {
  //         if (currentUser.id) {
  //           const {data} = await get_members(currentUser.id);

  //           const modal =
  //             data.planConnections[0].type === 'FREE'
  //               ? Modals.Blaze
  //               : Modals.Blaze;

  //           if (data) {
  //             if (!localStorage.getItem('modal')) {
  //               localStorage.setItem('modal', JSON.stringify(modal));
  //               dispatch(setModal(modal));
  //             }
  //             dispatch(setUser(data));
  //           }
  //         }
  //       } catch (error) {
  //         const err = handleApiError(error);
  //         toast.error(err);
  //       }
  //     };
  //     userData();
  //   }, [dispatch, token]);

  //   const updateFields = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await memberstack?.updateMember({
  //         customFields: {
  //           behaviour: data.behaviour,
  //           personal: data.personal,
  //           company: data.Company,
  //           'business-description': data['business-description'],
  //         },
  //       });

  //       toast.success(res?._internalUseOnly?.message || 'Updated successfully');
  //     } catch (error) {
  //       const err = handleApiError(error);
  //       toast.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const renderTabButton = (tabKey: string, label: string) => (
    <TouchableOpacity
      key={tabKey}
      style={[
        styles.tabButton,
        selectedTab === tabKey && styles.tabButtonActive,
      ]}
      onPress={() => setSelectedTab(tabKey)}>
      <Text style={styles.tabButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ModalPopover
      open={Open}
      onClose={onClose}
      ContainerStyle={{width: '100%'}}
      backgroundColor="#000000">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.tabContainer}>
          {renderTabButton('tab1', TABS.tab1)}
          {renderTabButton('tab2', TABS.tab2)}
        </View>

        {selectedTab === 'tab1' && (
          <View style={styles.panel}>
            <Text style={styles.label}>Behavior</Text>
            <TextInput
              style={styles.input}
              value={data.behaviour}
              onChangeText={val => setData({...data, behaviour: val})}
              placeholder="E.g., Be very detailed in your answers"
              multiline
            />

            <Text style={styles.label}>Side info</Text>
            <TextInput
              style={styles.input}
              value={data.personal}
              onChangeText={val => setData({...data, personal: val})}
              placeholder="Anything else that Blaze should know about?"
              multiline
            />
            {/* <TouchableOpacity style={styles.button} onPress={updateFields}></TouchableOpacity> */}
            <TouchableOpacity style={styles.button}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {selectedTab === 'tab2' && (
          <View style={styles.panel}>
            <Text style={styles.label}>Business Description</Text>
            <TextInput
              style={styles.input}
              value={data['business-description']}
              onChangeText={val =>
                setData({...data, 'business-description': val})
              }
              placeholder="e.g., BlazeAI is an innovative AI company..."
              multiline
            />

            <Text style={styles.label}>Business Name</Text>
            <TextInput
              style={styles.input}
              value={data.Company}
              onChangeText={val => setData({...data, Company: val})}
              placeholder="E.g., BlazeAI"
            />
            {/* <TouchableOpacity style={styles.button} onPress={updateFields}></TouchableOpacity> */}
            <TouchableOpacity style={styles.button}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ModalPopover>
  );
};

export default InstructionModel;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  tabContainer: {
    marginVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,

    borderRadius: 20,
    width: 130,
  },
  tabButtonActive: {
    backgroundColor: '#333',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  panel: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 10,
  },
  label: {
    color: '#fff',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlignVertical: 'top',
    borderColor: '#61B6C8',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#61B6C8',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
