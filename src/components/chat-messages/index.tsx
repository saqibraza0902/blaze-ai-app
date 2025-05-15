import React, {forwardRef, useEffect, useState} from 'react';
import {View, Text, Image, Linking, ActivityIndicator} from 'react-native';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-simple-toast';
import {IMessages} from '../../utils/types';
import {useAppSelector} from '../../hooks/useRedux';
import Markdown from 'react-native-markdown-display';
import AIIcon from '../../ui/icons/ai-icon';
import {Colors} from '../../constant/Colors';
import SystemIcon from '../../ui/icons/system-icon';
import DeepDiveProgressBar from '../deepdive-progressbar';
import VideoPlayer, {type VideoPlayerRef} from 'react-native-video-player';
import Video from 'react-native-video';

interface IProp {
  e: IMessages;
  i: number;
}

const ChatMessages = forwardRef<View, IProp>(({e, i}, ref) => {
  // const {colors} = useTheme();
  const [loading, setLoading] = useState(false);
  const {chats, conversation_setting} = useAppSelector(s => s.convo);
  const {user} = useAppSelector(s => s.user);
  const {theme} = useAppSelector(s => s.theme);
  const colors = Colors[theme];
  const isLoggedIn = true; // Replace with actual auth state
  const [aspectRatio, setAspectRatio] = useState(1);
  const [VideoaspectRatio, setVideoAspectRatio] = useState(1);
  useEffect(() => {
    setLoading(chats.messages[chats.messages.length - 1]?.loading || false);
  }, [chats.messages]);

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

    Toast.show('Text copied to clipboard', 500);
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(err => {
      Toast.show('Failed to open link', 500);
    });
  };
  interface AspectRatioEvent {
    nativeEvent: {
      source: {
        width: number;
        height: number;
      };
    };
  }

  const handleAspectRatio = (event: AspectRatioEvent): void => {
    const {width, height} = event.nativeEvent.source;
    const aspectRatio = width / height;
    setAspectRatio(aspectRatio);
  };
  const handleVideoAspectRatio = (event: {
    naturalSize: {width: number; height: number};
  }): void => {
    const {width, height} = event.naturalSize;
    const aspectRatio = width / height;
    console.log('Video Aspect Ratio:', width, height, aspectRatio);
    setVideoAspectRatio(aspectRatio);
  };

  return (
    <>
      <View ref={ref} style={styles.container} key={i}>
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
                source={
                  e?.sender?.profile_image
                    ? {
                        uri: e?.sender?.profile_image,
                      }
                    : require('../../../assets/images/blaze/usericon.jpg')
                }
                style={styles.avatar}
              />
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.senderName}>
                {isLoggedIn ? e.sender.first_name : 'You'}
              </Text>
              <View style={styles.messageContent}>
                <Markdown
                  style={{
                    body: {
                      color: colors.text,
                    },
                    heading1: {
                      color: colors.text,
                    },
                    strong: {
                      color: colors.text,
                    },
                    em: {
                      color: colors.text,
                    },
                  }}>
                  {e.content}
                  {/* {formatText(e?.content, i === deepDiveMessageIndex)} */}
                </Markdown>
                {e?.pdf?.file_name && (
                  <TouchableOpacity
                    style={styles.fileContainer}
                    onPress={() =>
                      handleOpenLink(
                        e?.pdf?.download_link.replace(/^http:/, 'https:') || '',
                      )
                    }>
                    <View style={styles.pdfIcon}>
                      <Feather name="download" size={24} color={colors.text} />
                    </View>
                    <Text style={styles.fileName}>{e.pdf.file_name}</Text>
                  </TouchableOpacity>
                )}
                {e?.image?.file_name && (
                  <TouchableOpacity
                    style={[
                      styles.imageContainer,
                      {width: '100%', height: 200},
                    ]}
                    onPress={() =>
                      handleOpenLink(
                        e?.image?.download_link.replace(/^http:/, 'https:') ||
                          '',
                      )
                    }>
                    <Image
                      source={{uri: e?.image?.download_link}}
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
                <AIIcon fill="" height={28} width={28} />
              )}
            </View>
            <View style={styles.assistantContent}>
              <Text style={styles.assistantName}>{e?.sender?.first_name}</Text>
              <View style={styles.assistantTextContainer}>
                {typeof e?.content === 'string' && e.sender.id && (
                  <View>
                    {parseContentWithThinkAndDeepDiveTags(e.content).map(
                      (part, index) => {
                        if (part.type === 'markdown') {
                          return (
                            <Markdown
                              key={index}
                              style={{body: {color: colors.text}}}>
                              {part.content}
                            </Markdown>
                          );
                        } else if (
                          part.type === 'think' ||
                          part.type === 'thinking'
                        ) {
                          return (
                            <CollapsibleBlock
                              title={
                                part.type === 'think' ? 'Think' : 'Thinking'
                              }
                              key={index}>
                              {part.content}
                            </CollapsibleBlock>
                          );
                        } else if (part.type === 'deep_dive') {
                          return (
                            <DeepDiveProgressBar
                              key={index}
                              loading={
                                chats.messages[
                                  chats.messages.length - 1
                                ]?.content?.includes('deep_dive') &&
                                i === chats.messages.length - 1
                              }
                            />
                          );
                        }
                      },
                    )}
                  </View>
                )}
                {e?.image?.download_link && (
                  <TouchableOpacity
                    style={[styles.imageContainer, {aspectRatio: aspectRatio}]}
                    // style={{
                    //   flex: 1,
                    //   aspectRatio: aspectRatio, // Square (adjust as needed)
                    // }}
                    onPress={() =>
                      handleOpenLink(
                        e?.image?.download_link.replace(/^http:/, 'https:') ||
                          '',
                      )
                    }>
                    {loading ? (
                      <View
                        style={{
                          height: 200,
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <ActivityIndicator size="large" color={colors.text} />
                      </View>
                    ) : (
                      <Image
                        source={{uri: e?.image?.download_link}}
                        style={styles.image}
                        resizeMethod="resize"
                        resizeMode="cover"
                        onLoad={handleAspectRatio}
                        // onLoadStart={() => setLoading(true)}
                        // onLoadEnd={() => setLoading(false)}
                      />
                    )}
                    <View style={{paddingVertical: 10}}>
                      <Text
                        style={{
                          fontWeight: 400,
                          color: colors.text,
                          textAlign: 'center',
                        }}>
                        {e?.image?.file_name?.replace(
                          /(.{8})(.*)(.{8})/,
                          '$1..$3',
                        )}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {e?.video?.download_link && (
                  <View>
                    <View>
                      <Video
                        source={{
                          uri: e.video.download_link.replace(
                            /^http:/,
                            'https:',
                          ),
                        }}
                        style={[
                          styles.imageContainer,
                          {aspectRatio: VideoaspectRatio},
                        ]}
                        resizeMode="cover"
                        paused={false} // ensures it starts playing
                        repeat={true} // loop continuously
                        controls={true} // show default controls
                        poster={e.image?.download_link?.replace(
                          /^http:/,
                          'https:',
                        )} // thumbnail
                        onLoad={handleVideoAspectRatio}
                        onError={err => console.log('Video Error:', err)}
                        onBuffer={e => console.log('Buffering:', e)} // optional
                        onLoadStart={() => console.log('Video loading...')} // optional
                        onReadyForDisplay={() => console.log('Ready to play')} // optional
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        handleOpenLink(
                          e?.video?.download_link.replace(/^http:/, 'https:') ||
                            '',
                        )
                      }
                      style={{}}>
                      <Text
                        style={{
                          fontWeight: 400,
                          color: colors.text,
                          textAlign: 'center',
                          marginTop: 2,
                        }}>
                        click here to download
                      </Text>
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
                            <Text
                              onPress={() => Linking.openURL(el)}
                              style={styles.citationText}>
                              {
                                el
                                  .replace(/^(https?:\/\/)?(www\.)?/, '')
                                  .split('/')[0]
                              }
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

        {conversation_setting.mode === 'deep_research' && i === 0 && (
          <View style={styles.systemMessage}>
            <View
              style={[
                styles.avatarContainer,
                {
                  backgroundColor: '#000',
                  borderRadius: 50,
                  height: 50,
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <SystemIcon />
            </View>
            <View style={styles.systemContent}>
              <Text style={styles.systemName}>System</Text>
              <Text style={[styles.systemText, {color: colors.text}]}>
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
          <ActivityIndicator size={25} />
        </View>
      )}
    </>
  );
});
const parseContentWithThinkAndDeepDiveTags = (content: string) => {
  const regex = /<(think|thinking|deep_dive)>([\s\S]*?)<\/\1>/gi;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const [fullMatch, tag, innerContent] = match;
    const index = match.index;

    if (index > lastIndex) {
      parts.push({
        type: 'markdown',
        content: content.slice(lastIndex, index),
      });
    }

    parts.push({
      type: tag,
      content: innerContent.trim(),
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'markdown',
      content: content.slice(lastIndex),
    });
  }

  return parts;
};

const CollapsibleBlock = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const {theme} = useAppSelector(s => s.theme);
  const colors = Colors[theme];
  return (
    <View style={{marginVertical: 8}}>
      <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
        <Text style={{fontWeight: 'bold', color: colors.text}}>
          {title} {collapsed ? '▼' : '▲'}
        </Text>
      </TouchableOpacity>
      {!collapsed && (
        <Text style={{paddingTop: 4, color: colors.collapsetext}}>
          {children}
        </Text>
      )}
    </View>
  );
};

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
    width: 50,
    // margi: 10,
    height: 50,
    borderRadius: 50,
    backgroundColor: 'black',
  },
  contentContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: 16,
    // marginBottom: 8,
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
    width: '100%',
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
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    marginVertical: 14,
    flex: 1,
  },
  image: {
    borderRadius: 8,
    width: '100%',
    height: '100%',
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
    fontSize: 14,
    lineHeight: 24,
  },
  loaderContainer: {
    maxWidth: 800,
    alignSelf: 'center',
    paddingLeft: 20,
  },
});

export default ChatMessages;
