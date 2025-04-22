import React, {forwardRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
// import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import {IMessages} from '../../utils/types';
import {useAppSelector} from '../../hooks/useRedux';
// import Loader from './Loader'; // Your custom loader component
// import ChunkDisplay from './ChunkDisplay'; // Your custom ChunkDisplay component

// Icons - you'll need to implement these or use alternatives
const AIIcon = () => <Icon name="ios-chatbubbles" size={24} color="#68BEBF" />;
const SystemIcon = () => <Icon name="ios-settings" size={24} color="#68BEBF" />;
const BlazeIcon = () => <Icon name="ios-flame" size={24} color="#68BEBF" />;

interface IProp {
  e: IMessages;
  i: number;
}

const ChatMessages = forwardRef<View, IProp>(({e, i}, ref) => {
  const {colors} = useTheme();
  const [loading, setLoading] = useState(false);
  const {chats} = useAppSelector(s => s.convo);
  const {user} = useAppSelector(s => s.user);

  // These would come from your Redux store in React Native
  const isLoggedIn = true; // Replace with actual auth state

  const conversation_setting = {mode: 'standard'}; // Replace with actual setting

  useEffect(() => {
    setLoading(chats.messages[chats.messages.length - 1]?.loading || false);
  }, [chats.messages]);

  const isDeepResearch = conversation_setting.mode === 'deep_research';
  const lastDeepDiveIndex = [...chats.messages]
    .reverse()
    .findIndex((msg: any) => msg?.content?.includes('deep_dive'));

  const deepDiveMessageIndex =
    lastDeepDiveIndex !== -1
      ? chats.messages.length - 1 - lastDeepDiveIndex
      : -1;

  const handleCopy = (content: string) => {
    const cleanedContent = content
      .replace(/<thinking>.*?<\/thinking>/gs, '')
      .trim();
    // Clipboard.setString(cleanedContent);
    Toast.show('Text copied to clipboard', 500);
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(err => {
      Toast.show('Failed to open link', 500);
    });
  };

  const formatText = (text: string, isDeepDive: boolean) => {
    // Implement your text formatting logic here
    return text;
  };

  return (
    <>
      <View ref={ref} style={styles.container}>
        {e.sender.id !== 'assistant' && (
          <View
            style={[
              styles.messageContainer,
              user?.id === e.sender.id
                ? styles.userMessage
                : styles.otherMessage,
            ]}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri:
                    e.sender.profile_image ||
                    require('../../../assets/images/blaze/blaze-logo.png'),
                }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.senderName}>
                {isLoggedIn ? e.sender.first_name : 'You'}
              </Text>
              <View style={styles.messageContent}>
                <Text style={styles.messageText}>
                  {formatText(e?.content, i === deepDiveMessageIndex)}
                </Text>
                {e?.pdf?.file_name && (
                  <TouchableOpacity
                    style={styles.fileContainer}
                    // onPress={() =>
                    //   handleOpenLink(
                    //     e.pdf.download_link.replace(/^http:/, 'https:'),
                    //   )
                    // }
                  >
                    <View style={styles.pdfIcon}>
                      <Icon name="ios-document" size={24} color={colors.text} />
                    </View>
                    <Text style={styles.fileName}>{e.pdf.file_name}</Text>
                    <Icon name="ios-download" size={20} color={colors.text} />
                  </TouchableOpacity>
                )}
                {e?.image?.file_name && (
                  <TouchableOpacity
                    style={styles.imageContainer}
                    // onPress={() =>
                    //   handleOpenLink(
                    //     e.image.download_link.replace(/^http:/, 'https:'),
                    //   )
                    // }
                  >
                    <Image
                      source={{uri: e.image.download_link}}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}

        {e.sender.id === 'assistant' && e?.model_used && (
          <View style={styles.assistantMessage}>
            <View style={styles.avatarContainer}>
              {e.sender.first_name.toLowerCase().includes('blaze') ? (
                <Image
                  source={require('../../../assets/images/blaze/blaze-logo.png')}
                  style={styles.avatar}
                />
              ) : (
                <AIIcon />
              )}
            </View>
            <View style={styles.assistantContent}>
              <Text style={styles.assistantName}>{e?.sender?.first_name}</Text>
              <View style={styles.assistantTextContainer}>
                {typeof e?.content === 'string' && e.sender.id && (
                  <View style={styles.chunkContainer}>
                    <Text>{e.content}</Text>
                    <TouchableOpacity
                      onPress={() => handleCopy(e.content)}
                      style={styles.copyButton}>
                      <Icon name="ios-copy" size={20} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                )}
                <View style={styles.citationsContainer}>
                  {Array.isArray(e?.citations) &&
                    e.citations.map((el, i) => {
                      if (typeof el === 'string') {
                        return (
                          <TouchableOpacity
                            key={i}
                            style={styles.citationButton}
                            onPress={() => handleOpenLink(el)}>
                            <Text style={styles.citationText}>
                              {new URL(el).hostname.replace(/^www\./, '')}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                      return null;
                    })}
                </View>
              </View>
            </View>
          </View>
        )}

        {isDeepResearch && i === 0 && (
          <View style={styles.systemMessage}>
            <View style={styles.avatarContainer}>
              <SystemIcon />
            </View>
            <View style={styles.systemContent}>
              <Text style={styles.systemName}>System</Text>
              <Text style={styles.systemText}>
                Welcome to the I.D.E.A. Hub! This is your space for
                collaborative exploration and brainstorming with Blaze and other
                AIs like ChatGPT, Claude and Perplexity. Just tag the AI you
                want to address by writing @Blaze (or the name of the AI you
                want to address), followed by your message or question—and we'll
                jump right in. Let's get started!
              </Text>
            </View>
          </View>
        )}
      </View>

      {chats.messages.length - 1 === i && loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={10} />
        </View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // alignSelf: 'center',
    // marginVertical: 20,
    // paddingHorizontal: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  userMessage: {
    backgroundColor: '#737373',
  },
  otherMessage: {
    backgroundColor: '#4e4c4c',
  },
  assistantMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#68BEBF',
    marginBottom: 20,
  },
  systemMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#68BEBF',
    marginTop: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 40,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'black',
  },
  contentContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
  },
  messageContent: {
    flexDirection: 'column',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    padding: 8,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  pdfIcon: {
    marginRight: 8,
  },
  fileName: {
    fontSize: 14,
    color: 'white',
    marginRight: 8,
  },
  imageContainer: {
    marginTop: 12,
  },
  image: {
    width: 250,
    height: 400,
    borderRadius: 8,
  },
  assistantContent: {
    flex: 1,
    marginTop: -12,
  },
  assistantName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#68BEBF',
    marginBottom: 8,
  },
  assistantTextContainer: {
    borderRadius: 12,
  },
  chunkContainer: {
    position: 'relative',
  },
  copyButton: {
    backgroundColor: '#252627',
    borderRadius: 12,
    marginTop: 8,
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  citationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  citationButton: {
    backgroundColor: '#737373',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  citationText: {
    color: 'white',
  },
  systemContent: {
    flex: 1,
    marginTop: -12,
  },
  systemName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#68BEBF',
    marginBottom: 8,
  },
  systemText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
  },
  loaderContainer: {
    maxWidth: 800,
    alignSelf: 'center',
    paddingLeft: 20,
  },
});

export default ChatMessages;
