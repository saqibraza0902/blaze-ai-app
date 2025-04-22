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
import {useFilePicker} from '../../hooks/useFilepicker';
import AddFileIcon from '../../ui/icons/add-file-icon';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useAppSelector} from '../../hooks/useRedux';
import {
  api,
  get_vector_files,
  retrieve_vector_store,
  search_file,
} from '../../utils/functions';
import {handleApiError} from '../../utils/error';
import {token} from '../../mock';
const SCREEN_HEIGHT = Dimensions.get('window').height;

type Props = {
  visible?: boolean;
  onClose?: () => void;
};

export const TopDrawer = ({visible, onClose}: Props) => {
  const translateY = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;
  const [openState, setOpenState] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [myData, setMyData] = useState([]);
  // const {token} = useAppSelector(s => s.modal);
  const {user} = useAppSelector(s => s.user);
  // const [file, setFile] = React.useState<any | null>(null);
  const [data, setData] = React.useState<any | []>([]);
  const [usedData, setUsedData] = useState(0);
  const FreeUser = user?.planConnections[0].type === 'FREE' ? true : false;
  useEffect(() => {
    setMyData(data);
  }, [data]);

  const onSearch = async () => {
    try {
      const res = await search_file(token, user?.id || '', searchTerm, 5);
      setMyData(res.data.data);
    } catch (error) {
      // toast.error(handleApiError(error));
      console.warn('error');
    }
  };

  // useEffect(() => {
  //   if (FreeUser) return;
  //   const getdata = async () => {
  //     try {
  //       const res = await get_vector_files(token);
  //       const storeres = await retrieve_vector_store(token);
  //       setData(res?.data);
  //       setUsedData(storeres?.data?.usage_bytes);
  //     } catch (error) {
  //       const err = handleApiError(error);
  //       // toast.error(err);
  //       console.log('error', err);
  //     }
  //   };
  //   getdata();
  // }, [file, deleteOpen]);
  const {pickFile} = useFilePicker();
  const uploadFile = async () => {
    const file = await pickFile();
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

      // toast.success('Upload successful');
      console.log('Success');
      console.log('success Response', response);
    } catch (error) {
      console.error('Upload failed', error);
      // toast.error('Upload failed');
    }
  };
  const PLAN_STORAGE: Record<string, number> = {
    'pln_pro-5mkr0qxs': 3, // Pro = 3GB
    'pln_pro-plus-o71680g29': 5, // Pro-Plus = 5GB
    'pln_ultra-eb1c20cwc': 15, // Enterprise = 15GB
    'pln_free-sg1h00cy3': 0, // Free = 0GB
  };
  const storage = PLAN_STORAGE[user?.planConnections[0].planId] || 0;

  const totalGB = usedData / 1024 ** 3;
  const usedPercentage = storage > 0 ? (totalGB / storage) * 100 : 0;
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);
  // const {token} = useAppSelector(s => s.modal);
  // const {user} = useAppSelector(s => s.user);
  // const {theme} = useTheme();
  //
  //
  // const [singleData, setSingleData] = useState<any | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [loading, setloading] = useState(false);

  // const getSingleDetail = async (id: string) => {
  //   try {
  //     setloading(true);
  //     setIsModalOpen(true);
  //     const res = await get_single_file(token, id);
  //     setSingleData(res.data); // Store the fetched data
  //     // Open the modal
  //   } catch (error) {
  //     toast.error(handleApiError(error));
  //   } finally {
  //     setloading(false);
  //   }
  // };
  // const {file, pickFile} = useFilePicker();

  // const handlePickFile = async () => {
  //   const picked = await pickFile();
  //   if (picked) {
  //     console.log('Picked file:', picked);
  //     console.log('file file:', file);
  //   }
  // };
  console.log('myData', myData);
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
          <Pressable>
            <AntDesign name="questioncircleo" size={35} color="black" />
          </Pressable>
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
                <ProgressBar total={80} value={30} />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Search files..."
                  placeholderTextColor="#aaa"
                  style={styles.inputStyle}
                />
                <TouchableOpacity>
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
        <View>
          <View>
            <Pressable onPress={() => uploadFile()}>
              <FontAwesome5 name="file-upload" size={130} />
            </Pressable>
            {/* <Pressable onPress={handlePickFile}>
            <Text>Click Me</Text>
            </Pressable> */}
          </View>
        </View>
        {myData.map((content, i) => (
          <TouchableOpacity
            key={i}
            // onPress={() => getSingleDetail(content.id)}
            activeOpacity={0.7}>
            {/* Delete Icon */}
            <TouchableOpacity>
              {/* <DeleteFileIcon fill={theme !== 'dark' ? '#000' : '#000'} /> */}
            </TouchableOpacity>

            {/* <PdfFileIcon /> */}
            <Text numberOfLines={1}></Text>
          </TouchableOpacity>
        ))}
      </View>
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
  },
});
