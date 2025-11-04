import { Alert, LogBox, StyleSheet } from 'react-native';
// import the screens
import StartScreen from './components/StartScreen';
import ChatScreen from './components/ChatScreen';
import { db } from "./firebaseConfig";

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from "react-native-safe-area-context"; // 👈 import this

// code for detecting whether a user is online (should be kept in main/root comp.)
import { useNetInfo } from "@react-native-community/netinfo";
import React, { useEffect } from "react";
import { enableNetwork, disableNetwork } from "firebase/firestore";

// Ignore deprecation warnings
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);
// Create the navigator

// Create the navigator
const Stack = createNativeStackNavigator();

//state that represents network connectivity

const App = () => {

const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) { 
      Alert.alert("Connection is on!");
      enableNetwork(db); }
  }, [connectionStatus.isConnected]);


  return (
<SafeAreaProvider>   
  <NavigationContainer>
    <Stack.Navigator
        initialRouteName="StartScreen">
      <Stack.Screen
        name="StartScreen"
        component={StartScreen}
        />
      <Stack.Screen
        name="ChatScreen">
        {(props) => (
            <ChatScreen
              isConnected={connectionStatus.isConnected}
              db={db}
              {...props} />)}         
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
</SafeAreaProvider> 
  );
}

const styles = StyleSheet.create({

});

export default App;