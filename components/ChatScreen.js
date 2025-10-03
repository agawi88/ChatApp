import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat} from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ChatScreen = ({ route, navigation }) => {

  const { userID, name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]); // because the chat needs to send, receive and display messages, so their state will be changing
  
  // Chat code for messages from GiftedChat

  useEffect(() => {
    navigation.setOptions({
      title: name,
      headerStyle: { backgroundColor },
    });

// query all messages ordered by createdAt
    const q = query(collection(db, "messages"),
      orderBy("createdAt", "desc"));
    
    //code to executed when cmpnnt mounted/updated    
    const unsubMessages = onSnapshot(q, (doc) => {
      let newMessages = [];
        doc.forEach(doc => {
            newMessages.push({
              _id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis()),
            });
            });
            setMessages(newMessages);
        });
//   Clean up code
        return () => unsubMessages();
  }, [db, navigation, name, backgroundColor]); //safer option so if changes occur they will re-run

  const onSend = (newMessages = []) => {
    addDoc(collection(db, "messages"), newMessages[0])
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
          user={{
            _id: userID,
            name: name,
            avatar: "https://placeimg.com/140/140/any",
          }}
        renderBubble={renderBubble}      
        textInputProps={{
        editable: true,
        multiline: true,
        placeholder: "Type a message..."
          }}
        keyboardShouldPersistTaps="handled"
        />
{/*     {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}   
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

export default ChatScreen;