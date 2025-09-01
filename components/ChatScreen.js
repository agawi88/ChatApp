import { useEffect } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';

const Screen2 = ({ route, navigation }) => {

  const { name, backgroundColor } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: name }, {backgroundColor: backgroundColor});
    }, []);

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor || 'white' }]}>
      <Text>Hello ChatScreen!</Text>
        <Button
       title="Go back to StartScreen"
       onPress={() => navigation.navigate('Screen1')}
       />
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center'
 }
});

export default Screen2;
