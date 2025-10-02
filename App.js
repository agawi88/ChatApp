import { StyleSheet } from 'react-native';
import StartScreen from './components/StartScreen';
import ChatScreen from './components/ChatScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {

const firebaseConfig = {
  apiKey: "AIzaSyBihgTR-xnxRYcW6TEy9IdpReCX_7AstBg",
  authDomain: "agas-shopping-list-demo.firebaseapp.com",
  projectId: "agas-shopping-list-demo",
  storageBucket: "agas-shopping-list-demo.firebasestorage.app",
  messagingSenderId: "326283031177",
  appId: "1:326283031177:web:614a2b367bbe8f39294c58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);
  const auth = getAuth(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="StartScreen">
      <Stack.Screen
          name="StartScreen"
          children={props => <StartScreen auth={auth} {...props} />}
        />
      <Stack.Screen
          name="ChatScreen"
          children={props => <ChatScreen db={db} {...props} />}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});

export default App;