import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat} from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
// import { db } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatScreen = ({ db, isConnected, route, navigation }) => {


  const { userID, name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]); // because the chat needs to send, receive and display messages, so their state will be changing
 
  // Chat code for messages from GiftedChat

  let unsubMessages;

  useEffect(() => {

    navigation.setOptions({
      title: name,
      headerStyle: { backgroundColor }
    });

    if (isConnected === true) {
// unregister current onSnapshot() listener to avoid registering multiple listeners when useEffect code is re-executed.
    if (unsubMessages) unsubMessages();
      unsubMessages = null;      

// query all messages ordered by createdAt
    const q = query(collection(db, "messages"),
      orderBy("createdAt", "desc"));
   
    //code to executed when component mounted/updated    
    const unsubMessages = onSnapshot(q, (doc) => {
      let newMessages = [];
        doc.forEach(doc => {
            newMessages.push({
              _id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis()), // one way to change convert
              // the TimeStamp stored at the createdAt property of each message to a Date object
              // that Gifted Chat understands. Other way suggested by chatGPT:
              // const data = doc.data();
            })
          });
            cacheMessages(newMessages);
            setMessages(newMessages);
        });
      } else loadCachedMessages();
//   Clean up code
        return () => unsubMessages();
  }, [db, isConnected, name, backgroundColor]); //safer option so if changes occur they will re-run

const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("messages") || [];
    setLists(JSON.parse(cachedMessages));
  }    
    
const cacheMessages = async (messagesToCache) => {
    try {
          await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
}

  // using  addDoc() Firestore function to save the passed message to the function in the database
  const onSend = (newMessages = []) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }
// a method of adjusting colors of gifted chat's message bubbles
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
 
  // Conditional config for KeyboardAvoidingView
  const keyboardBehavior = Platform.OS === "ios" ? "padding" : "height";
  const keyboardVerticalOffset = Platform.OS === "ios" ? 10 : 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={keyboardBehavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: backgroundColor || "white" },
        ]}
      >
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
            placeholder: "Type a message...",
          }}
          keyboardShouldPersistTaps="handled"
        />
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