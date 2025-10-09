import { StyleSheet } from 'react-native';
import StartScreen from './components/StartScreen';
import ChatScreen from './components/ChatScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from "react-native-safe-area-context"; // 👈 import this

//import { initializeApp } from "firebase/app";
//import { getFirestore } from "firebase/firestore";

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {

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
        name="ChatScreen"
        component={ChatScreen}
        />
      </Stack.Navigator>
      </NavigationContainer>
</SafeAreaProvider> 
  );
}

const styles = StyleSheet.create({

});

export default App;