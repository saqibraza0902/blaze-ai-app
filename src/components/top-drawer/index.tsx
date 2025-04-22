import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {use, useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo'; // or MaterialIcons, FontAwesome, etc.
import {ScrollView} from 'react-native';
import KnowledgeBased from '../../ui/icons/knowledge-based-icon';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProgressBar from '../progress-bar';

import Toast from 'react-native-simple-toast';
import Feather from 'react-native-vector-icons/Feather';
import {useAppSelector} from '../../hooks/useRedux';
import {
  api,
  get_single_file,
  get_vector_files,
  pickSingleFile,
  retrieve_vector_store,
  search_file,
} from '../../utils/functions';
import {handleApiError} from '../../utils/error';
import {token} from '../../mock';
import PdfIcon from '../../ui/icons/pdf-icon';
import ModalPopover from '../modal';
import {Colors} from '../../constant/Colors';
import {ActivityIndicator} from 'react-native';
import DeletePdfFile from '../pdf-file-delete-modal';
const SCREEN_HEIGHT = Dimensions.get('window').height;

type Props = {
  visible?: boolean;
  onClose?: () => void;
};

export const TopDrawer = ({visible, onClose}: Props) => {
  const translateY = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;
  const [openTooltip, setOpenTooltip] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null);
  const {theme} = useAppSelector(s => s.theme);
  const themeColor = Colors[theme];
  // const {token} = useAppSelector(s => s.modal);
  const {user} = useAppSelector(s => s.user);
  // const {token} = useAppSelector(s => s.modal);
  // const {user} = useAppSelector(s => s.user);
  // const {theme} = useTheme();
  const [singleData, setSingleData] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [data, setData] = React.useState<any | []>([]);
  const [usedData, setUsedData] = useState(0);
  const FreeUser = user?.planConnections[0].type === 'FREE' ? true : false;
  const PLAN_STORAGE: Record<string, number> = {
    'pln_pro-5mkr0qxs': 3, // Pro = 3GB
    'pln_pro-plus-o71680g29': 5, // Pro-Plus = 5GB
    'pln_ultra-eb1c20cwc': 15, // Enterprise = 15GB
    'pln_free-sg1h00cy3': 0, // Free = 0GB
  };
  const storage = PLAN_STORAGE[user?.planConnections[0].planId] || 0;

  const totalGB = usedData / 1024 ** 3;
  const usedPercentage = storage > 0 ? (totalGB / storage) * 100 : 0;

  /* ________ONSearch_____________________________ */
  const onSearch = async () => {
    try {
      const res = await search_file(token, user?.id || '', searchTerm, 5);
      setData(res.data.data);
    } catch (error) {
      // toast.error(handleApiError(error));
      console.warn('error');
    }
  };
  /* ___________GET ALL DATA FILES__________________________ */
  const getdata = async () => {
    try {
      const res = await get_vector_files(token);
      const storeres = await retrieve_vector_store(token);
      setData(res?.data);
      setUsedData(storeres?.data?.usage_bytes);
    } catch (error) {
      const err = handleApiError(error);
      // toast.error(err);
      console.log('error', err);
    }
  };
  useEffect(() => {
    if (FreeUser) return;

    getdata();
  }, [searchTerm, deleteFileId]);

  /* _________UPLOAD FILE AND POST _________________________ */
  const uploadFile = async () => {
    const file = await pickSingleFile();
    if (!file) return;

    try {
      const formData = new FormData();

      formData.append('file', {
        uri: file.fileCopyUri ?? file.uri,
        name: file.name,
        type: file.type || 'application/octet-stream',
      });

      const response = await fetch(
        `${api}/api/vector_store/files/manual_upload_no_disk?user_id=${user?.id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Upload error details:', errorData);
        throw new Error('Upload failed');
      }
      getdata();
      Toast.showWithGravity('Successfully added', Toast.SHORT, Toast.CENTER);
      console.log('Success Response:', await response.json());
    } catch (error) {
      console.error('Upload failed', error);
      // toast.error('Upload failed');
    }
  };

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const getSingleDetail = async (id: string) => {
    try {
      setloading(true);
      setIsModalOpen(true);
      const res = await get_single_file(token, id);
      setSingleData(res.data); // Store the fetched data
      // Open the modal
    } catch (error) {
      // toast.error(handleApiError(error));
    } finally {
      setloading(false);
    }
  };

  console.log('myData', deleteFileId);
  return (
    <Animated.ScrollView
      style={[
        styles.drawer,
        {
          transform: [{translateY}],
        },
      ]}>
      <View style={{padding: 10}}>
        <View style={styles.HeaderContainer}>
          <Pressable onPress={() => setOpenTooltip(prev => !prev)}>
            <AntDesign name="questioncircleo" size={35} color="black" />
          </Pressable>
          {/* ____ToolTIP______ */}
          {openTooltip && (
            <View style={styles.TooltipWrapper}>
              <Text style={{color: 'white', fontSize: 14, fontWeight: '700'}}>
                Enhance Blaze Max’s knowledge by adding your documents.
              </Text>
            </View>
          )}
          <View style={{flex: 1}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <KnowledgeBased style={{width: 80, height: 80}} fill="black" />
              <Text style={{color: 'black', fontWeight: '700'}}>
                Knowledge Base
              </Text>
              <View style={{width: '80%', marginTop: 10}}>
                <ProgressBar total={storage} value={usedPercentage} />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Search files..."
                  placeholderTextColor="#aaa"
                  style={styles.inputStyle}
                  value={searchTerm}
                  onChangeText={text => setSearchTerm(text)}
                />
                <TouchableOpacity onPressOut={onSearch}>
                  <AntDesign name="search1" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Pressable onPress={onClose}>
            <Icon name="cross" size={35} color="black" />
          </Pressable>
        </View>
        {/* ________BODY__________________________________ */}
        <View style={styles.pdf_wrapper}>
          <View>
            <View>
              <Pressable onPress={() => uploadFile()}>
                <Feather name="upload" size={105} />
              </Pressable>
            </View>
          </View>
          {data.map((content: any, i: number) => (
            <View
              key={i}
              // onPress={() => getSingleDetail(content.id)}
            >
              <View
                style={{
                  alignSelf: 'flex-end',

                  marginBottom: -15,
                }}>
                <TouchableOpacity onPress={() => setDeleteFileId(content.id)}>
                  <AntDesign
                    name="closecircleo"
                    color={theme !== 'dark' ? '#000' : '#000'}
                    size={25}
                  />
                </TouchableOpacity>
              </View>
              <Pressable onPress={() => getSingleDetail(content.id)}>
                <PdfIcon style={{width: 105, height: 105}} />

                <Text
                  style={{fontSize: 12, textAlign: 'center'}}
                  numberOfLines={1}>
                  {content?.attributes?.filename?.length > 10
                    ? `${content?.attributes?.filename.substring(0, 10)}...`
                    : content?.attributes?.filename}
                </Text>
              </Pressable>
              <DeletePdfFile
                open={deleteFileId === content.id}
                onClose={() => {
                  setDeleteFileId(null);
                  getdata();
                }}
                fileId={content.id}
                FileName={content?.attributes?.filename}
              />
            </View>
          ))}
        </View>
      </View>
      {/* ______________File Details______________________________ */}
      <ModalPopover
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ContainerStyle={{
          width: '100%',
          height: 'auto',
        }}
        backgroundColor={themeColor.dropdownbg}>
        <View>
          <Text style={{fontSize: 18, fontWeight: '700', textAlign: 'center'}}>
            File Details
          </Text>
          {!loading ? (
            <>
              <View>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    flexDirection: 'row',
                    marginVertical: 10,
                  }}>
                  <Text style={{fontSize: 14}}>FileName:</Text>
                  <Text
                    style={{fontSize: 14, fontWeight: '500'}}
                    numberOfLines={1}>
                    {singleData?.attributes?.filename?.length > 20
                      ? `${singleData?.attributes?.filename.substring(
                          0,
                          20,
                        )}...`
                      : singleData?.attributes?.filename}
                  </Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    flexDirection: 'row',
                  }}>
                  <Text style={{fontSize: 14}}>FileSize:</Text>
                  <Text
                    style={{fontSize: 14, fontWeight: '500'}}
                    numberOfLines={1}>
                    {singleData?.usage_bytes} Bytes
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <ActivityIndicator
                color={'black'}
                size={'large'}
                style={{marginTop: 10}}
              />
            </>
          )}
          <View>
            <TouchableOpacity
              onPress={() => setIsModalOpen(false)}
              style={{
                backgroundColor: '#EF4444',
                padding: 10,
                borderRadius: 15,
                width: 100,
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: '600',
                }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalPopover>
      {/* ____________Delete File Modal ____________________ */}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: SCREEN_HEIGHT,
    backgroundColor: '#D8D8D9',
    zIndex: 100,
  },
  close: {
    padding: 16,
    backgroundColor: 'green',
  },
  HeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 16,
    width: '100%',
    gap: 10,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
  },
  pdf_wrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  TooltipWrapper: {
    backgroundColor: '#7C7C7C',
    position: 'absolute',
    width: 200,
    padding: 10,
    zIndex: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    top: 30,
    left: 30,
  },
});
