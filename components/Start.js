//Start.js

import React from 'react';
import { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, Button, TextInput } from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';

const Start = ({ navigation }) => {
  // Log in the user anonymously
  const auth = getAuth();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#090C08');
  const image = require('../img/backgroundimage.png');

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleStartChat = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate('Chat', { selectedColor, userId: result.user.uid, name });
      })
      .catch((error) => {
        console.error('Error signing in anonymously:', error);
      });
  };

  const colorOptions = ['#2f4f4f', '#db7093', '#98fb98', '#b0c4de'];

  return (
    <ImageBackground source={image} resizeMode="cover" style={styles.container}>
      <Text style={styles.title}>Chat It Up!</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder='Type your username here'
          placeholderTextColor='#757083'
        />
      </View>

      <Text style={styles.text}>Pick your Background Color for Chat:</Text>

      <View style={styles.colorOptionContainer}>

        <TouchableOpacity
          style={[styles.colorOption, { backgroundColor: colorOptions[0] }]}
          onPress={() => handleColorChange(colorOptions[0])}
        />
        <TouchableOpacity
          style={[styles.colorOption, { backgroundColor: colorOptions[1] }]}
          onPress={() => handleColorChange(colorOptions[1])}
        />
        <TouchableOpacity
          style={[styles.colorOption, { backgroundColor: colorOptions[2] }]}
          onPress={() => handleColorChange(colorOptions[2])}
        />
        <TouchableOpacity
          style={[styles.colorOption, { backgroundColor: colorOptions[3] }]}
          onPress={() => handleColorChange(colorOptions[3])}
        />
      </View>

      <Button
        title="Start Chat"
        onPress={handleStartChat}
        disabled={!name} // Disable the button if the username is not entered
        style={styles.buttonchat}
        color="#4b0082"
      />

    </ImageBackground >


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  inputContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },

  textInput: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },

  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  colorOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25, // Half of the width to make it circular
    margin: 0.9,
    borderWidth: 2,
  },

});

export default Start;