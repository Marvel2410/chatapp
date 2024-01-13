//Chat.js

import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";


const Chat = ({ route, navigation }) => {
  const { name, selectedColor } = route.params;
  const [messages, setMessages] = useState([]);
  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  }

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);


  useEffect(() => {
    navigation.setOptions({
      title: name,
      headerStyle: {
        backgroundColor: selectedColor,
      },
    });
  }, []);


  return (
    <View style={[styles.container, { backgroundColor: selectedColor }]}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome to the Chat!</Text>
      </View>

      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          renderBubble={renderBubble}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1
          }}
          timeTextStyle={{
            left: {
              color: '#000',
            },
            right: {
              color: '#FFF',
            },
          }}
        />
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior="height" />
        ) : (
          <KeyboardAvoidingView behavior='padding' />
        )}
      </View>
    </View>
  );
}

const renderBubble = (props) => {
  return <Bubble
    {...props}
    wrapperStyle={{
      right: {
        backgroundColor: "#4a90e2",
      },
      left: {
        backgroundColor: "#8bc34a"
      }
    }}
  />
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  welcomeContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,

  },
});


export default Chat;