import { StyleSheet } from 'react-native';
import StartScreen from './components/StartScreen';
import ChatScreen from './components/ChatScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import { initializeApp } from "firebase/app";
//import { getFirestore } from "firebase/firestore";

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="StartScreen">
      <Stack.Screen
        name="StartScreen"
        component={StartScreen}
        //children={props => <StartScreen auth={auth} {...props} />}

        />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        //children={props => <ChatScreen db={db} {...props} />}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});

export default App;