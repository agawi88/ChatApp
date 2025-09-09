import { useEffect, useState } from 'react';
import { Button, StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";


const Screen2 = ({ route, navigation }) => {

  const { name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]); // because the chat needs to send, receive and display messages, so their state will be changing
  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  }
  // Chat code for messages from GiftedChat

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  // Navigating between pages
    useEffect(() => {
      navigation.setOptions({
        title: name,
        headerStyle: { backgroundColor: backgroundColor },
      });
    }, []);

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor || 'white' }]}>
      <Text>Hello ChatScreen!</Text>
      <View style={styles.topButton}>
        <Button
       title="Go back to StartScreen"
       onPress={() => navigation.navigate('Screen1')}
        />
      </View>
    <GiftedChat
     messages={messages}
     onSend={messages => onSend(messages)}
     user={{
       _id: 1
     }}
      />
      {Platform.OS === 'android' ?
        <KeyboardAvoidingView behavior="height"
        /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
  },
  topButton: {
   justifyContent: 'center',
    alignItems: 'center',
   padding: 10,
  }
});

export default Screen2;