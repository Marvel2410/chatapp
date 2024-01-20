//Chat.js

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Chat = ({ route, navigation, db, isConnected }) => {
  const { name, selectedColor } = route.params;
  const [messages, setMessages] = useState([]);

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem('messages')) || '[]';
    setMessages(JSON.parse(cachedMessages));
  };

  let unsubMessages;

  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      unsubMessages = onSnapshot(q, (documentSnapshot) => {
        let newMessages = [];
        documentSnapshot.forEach(doc => {
          newMessages.push({ id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis()) })
        });

        cachedMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    // Clean up function
    return () => {
      if (unsubMessages) {
        unsubMessages();
      }
    };
  }, [isConnected]);

  const cachedMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };









  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  const renderInputToolbar = (props) => {
    if (isConnected === true) return <InputToolbar {...props} />;
    else return null;
  }


  useEffect(() => {
    navigation.setOptions({
      title: name,
      headerStyle: {
        backgroundColor: selectedColor,
      },
    });
  }, [name, selectedColor]);


  return (
    <View style={[styles.container, { backgroundColor: selectedColor }]}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome to the Chat!</Text>
      </View>

      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          onSend={(newMessages) => onSend(newMessages)}
          user={{
            _id: route.params.userId, // Extracting user ID from route.params
            name: route.params.name, // Using the name from route.params
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