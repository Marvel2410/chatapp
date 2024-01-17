import React from 'react';
import Start from './components/Start';
import Chat from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { LogBox } from "react-native";


const Stack = createNativeStackNavigator();

const App = () => {
  // ignores error Message in Welcome Screen
  LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

  const firebaseConfig = {
    apiKey: "AIzaSyDuezJPk6tURtiHASHzANIkrw12S4avlGU",
    authDomain: "chat-app-b21b5.firebaseapp.com",
    projectId: "chat-app-b21b5",
    storageBucket: "chat-app-b21b5.appspot.com",
    messagingSenderId: "202848376216",
    appId: "1:202848376216:web:f64f027b4853129b6547ed"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};




export default App;