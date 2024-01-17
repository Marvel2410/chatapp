//Chat.js

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, } from "firebase/firestore";



const Chat = ({ route, navigation, db }) => {
  const { name, selectedColor } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'messages'), (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: {
            _id: data.user._id,
            name: data.user.name,
            avatar: data.user.avatar,
          },
        };
      });
      setMessages(newMessages);
    });

    // Add cleanup 
    return () => {
      unsubscribe();
    };
  }, [db]);


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