import React, { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const ChatScreen = ({ db, isConnected, route, storage, navigation }) => {

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
    unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
        docs.forEach(doc => {
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
        return () => {
          if (unsubMessages) unsubMessages();
        }
  }, [ isConnected ]); //safer option so if changes occur they will re-run

const loadCachedMessages = async () => {
  const cachedMessages = await AsyncStorage.getItem("messages") || [];
  setMessages(cachedMessages ? JSON.parse(cachedMessages) : [] );
  }    
    
const cacheMessages = async (messagesToCache) => {
    try {
          await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
}

  // using  addDoc() Firestore function to save the passed message to the function in the database
/*     const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]) */
  
  const onSend = async (newMessages) => {
    console.log('onSend in Chat.js called with:', newMessages);
    try {
      await addDoc(collection(db, "messages"), newMessages[0]);
    console.log('Messages added to Firestore successfully!');
    } catch (error) {
      console.log('Error adding messages to Firestore:', error)
    }
  }

  // method for conditionally rendering the input toolbar based on isConnected status
  const renderInputToolbar = (props) => {
    if (isConnected === true)
    return <InputToolbar {...props} />;
    else return null; 
}

// method for adjusting colors of gifted chat's message bubbles
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "#000"},
        left: { backgroundColor: "#FFF" }
      }}
    />
  };
// method for rendering custom actions (e.g., sending images, location)
  const renderCustomActions = (props) => {
    return <CustomActions 
    userID={userID} 
    storage={storage}
    onSend={onSend}
     {...props} />;
  };

// method for rendering custom view (e.g., map for location messages)
const renderCustomView = (props) => {
const { currentMessage } = props;
if (currentMessage.location) {
  return (

      <MapView
        style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
        region={{
          latitude: currentMessage.location.latitude,
          longitude: currentMessage.location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      // {currentMessage.image && <Image source={{ uri: currentMessage.image }} style={{ width: 200, height: 200 }} />}
  );
  } return null;
}
 
  // Conditional config for KeyboardAvoidingView
  /* const keyboardBehavior = Platform.OS === "ios" ? "padding" : "height";
  const keyboardVerticalOffset = Platform.OS === "ios" ? 10 : 0; */

  return (
/*     <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={keyboardBehavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
    > */
      <View
        style={[
          styles.container, { backgroundColor: backgroundColor || "white" },
        ]}
      >
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderActions={renderCustomActions}
          renderCustomView={renderCustomView}
          user={{
            _id: userID,
            name,
          }}
          textInputProps={{
            editable: true,
            multiline: true,
            placeholder: "Type a message...",
          }}
          keyboardShouldPersistTaps="handled"
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
  );
};


const styles = StyleSheet.create({
 container: {
   flex: 1,
  }
});


export default ChatScreen;