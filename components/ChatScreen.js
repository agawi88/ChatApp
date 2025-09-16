import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat} from "react-native-gifted-chat";


const Screen2 = ({ route, navigation }) => {

  const { name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]); // because the chat needs to send, receive and display messages, so their state will be changing
  
  
  const onSend = (newMessages) => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, newMessages))
  }
  // Chat code for messages from GiftedChat

  useEffect(() => {
    navigation.setOptions({
      title: name,
      headerStyle: { backgroundColor: backgroundColor },
     })
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
        {
        _id: 2,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },    
    ]);
  }, []);


  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  };
  
  return (
    <View style={[styles.container,
    { backgroundColor: backgroundColor || 'white' }]}>
     <View style={styles.box1}>
        <Text>Hello ChatScreen!</Text>
    </View> 
    <View style={styles.box2}>
  {Platform.OS === 'android' ? (
    <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
      <View> 
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
        user={{ _id: 1, name }}
              />
      </View>
    </KeyboardAvoidingView>
  ) : (
      <View> 
        <GiftedChat
      messages={messages}
      renderBubble={renderBubble}
      onSend={messages => onSend(messages)}
      user={{ _id: 1, name }}
              />
      </View>
      )}
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
  },
/*   box1: {
    flex: 1,
  },
  box2: {
    flex: 9,
  }, */
/*   topButton: {
   justifyContent: 'center',
    alignItems: 'center',
   padding: 10,
  } */
});

export default Screen2;