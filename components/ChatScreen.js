import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat} from "react-native-gifted-chat";


const Screen2 = ({ route, navigation }) => {

  const { name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]); // because the chat needs to send, receive and display messages, so their state will be changing
  

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

  const onSend = (newMessages) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages))
  }

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
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
    >
    <View style={[styles.container,
    { backgroundColor: backgroundColor || 'white' }]}>
        <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{ _id: 1, name }}
        renderBubble={renderBubble}      
        textInputProps={{
        editable: true,
        multiline: true,
        placeholder: "Type a message..."
  }}
        />
{/*        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}   
      {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior='padding' /> : undefined}
    {Platform.OS === 'ios' ? <KeyboardAvoidingView keyboardVerticalOffset='60' /> : null} */}
      </View>
    </KeyboardAvoidingView>  
  );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
  }
});

export default Screen2;