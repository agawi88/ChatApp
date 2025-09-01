import { StyleSheet, View } from 'react-native';
import Screen1 from './components/StartScreen';
import Screen2 from './components/ChatScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const App = () => {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Screen1">
      <Stack.Screen
          name="Screen1"
          component={Screen1}
        />
      <Stack.Screen
          name="Screen2"
          component={Screen2}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});

export default App;