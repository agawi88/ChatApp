import { Alert, LogBox, StyleSheet } from 'react-native';
import React, { useEffect } from "react";

// Screens
import StartScreen from './components/StartScreen';
import ChatScreen from './components/ChatScreen';

// Firebase
import { db, storage } from "./firebaseConfig";
import { enableNetwork, disableNetwork } from "firebase/firestore";

// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Safe Area
import { SafeAreaProvider } from "react-native-safe-area-context"; // 👈 import this

// Network status // code for detecting whether a user is online (should be kept in main/root comp.)
import { useNetInfo } from "@react-native-community/netinfo";

/**
 * App
 *
 * Root component of the application.
 * Responsible for:
 *  - setting up navigation
 *  - providing safe area context
 *  - monitoring network connectivity
 *  - enabling/disabling Firestore network access
 *
 * Acts as the central integration point for:
 *  - React Navigation
 *  - Firebase (Firestore & Storage)
 *  - Offline/online handling
 *
 * @component
 * @returns {JSX.Element} Root application container
 */

const App = () => {

  /**
   * Network connection status provided by NetInfo.
   *
   * @type {Object}
   */

const connectionStatus = useNetInfo();

  /**
   * Reacts to network connectivity changes.
   *
   * - Disables Firestore network access when offline
   * - Enables Firestore network access when online
   *
   * Firestore automatically serves cached data while offline.
   */

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
              storage={storage}
              {...props} />)}         
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
</SafeAreaProvider> 
  );
}

// Ignore deprecation warnings
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);
// Create the navigator

// Navigator
const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({

});

export default App;