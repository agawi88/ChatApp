import React, { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

/**
 * ChatScreen
 *
 * Main chat interface of the application.
 * Handles:
 *  - real-time messaging via Firebase Firestore
 *  - offline message caching via AsyncStorage
 *  - media and location messages
 *  - conditional UI rendering based on connectivity
 *
 * @component
 * @param {Object} props
@param {Object} props.db
 *        Firestore database instance.
 * @param {boolean} props.isConnected
 *        Network connectivity status.
 * @param {Object} props.route
 *        React Navigation route object.
 * @param {Object} props.route.params
 * @param {string} props.route.params.userID
 *        Unique identifier of the current user.
 * @param {string} props.route.params.name
 *        Display name of the user.
 * @param {string} props.route.params.backgroundColor
 *        Preferred background color for the chat screen.
@param {Object} props.storage
 *        Firebase Storage instance used for media uploads.
 * @param {Object} props.navigation
 *        React Navigation navigation object.
 *
 * @returns {JSX.Element} Chat screen UI
 */

const ChatScreen = ({ db, isConnected, route, storage, navigation }) => {

  const { userID, name, backgroundColor } = route.params;

  /**
   * State holding all chat messages displayed in GiftedChat.
   */

  const [messages, setMessages] = useState([]); // because the chat needs to send, receive and display messages, so their state will be changing

  // Chat code for messages from GiftedChat

  /**
   * Update navigation header when user name or background color changes.
   */

  useEffect(() => {

    navigation.setOptions({
      title: name,
      headerStyle: { backgroundColor }
    });
  }, [ name, backgroundColor]);

  let unsubMessages;

  /**
   * Update navigation header when user name or background color changes.
   */

  useEffect(() => {
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
      } else { 
        loadCachedMessages();
    }
//   Clean up code
        return () => {
          if (unsubMessages) unsubMessages();
        }
  }, [ isConnected ]); //safer option so if changes occur they will re-run

  /**
   * Loads cached messages from AsyncStorage when offline.
   *
   * @async
   * @returns {Promise<void>}
   */

const loadCachedMessages = async () => {
  const cachedMessages = await AsyncStorage.getItem("messages") || [];
  setMessages(JSON.parse(cachedMessages));
  };   

  /**
   * Stores messages in AsyncStorage for offline use.
   *
   * @async
   * @param {Object[]} messagesToCache
   * @returns {Promise<void>}
   */  

const cacheMessages = async (messagesToCache) => {
    try {
          await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
};

  /**
   * Sends a new message to Firestore.
   * Called by GiftedChat and CustomActions.
   *
   * @async
   * @param {Object[]} newMessages - Array containing the new message
   * @returns {Promise<void>}
   */

  const onSend = async (newMessages) => {
    console.log('onSend in Chat.js called with:', newMessages);
    try {
      await addDoc(collection(db, "messages"), newMessages[0]);
    console.log('Messages added to Firestore successfully!');
    } catch (error) {
      console.log('Error adding messages to Firestore:', error)
    }
  };

  /**
   * Conditionally renders the input toolbar
   * depending on network connectivity.
   *
   * @param {Object} props - GiftedChat toolbar props
   * @returns {JSX.Element|null}
   */
  
  const renderInputToolbar = (props) => {
    if (isConnected === true)
    return <InputToolbar {...props} />;
    else return null; 
}

  /**
   * Customizes the appearance of chat bubbles.
   *
   * @param {Object} props - GiftedChat bubble props
   * @returns {JSX.Element}
   */
  
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "#000"},
        left: { backgroundColor: "#FFF" }
      }}
    />
  };
  /**
   * Renders custom action buttons (image, camera, location).
   *
   * @param {Object} props - GiftedChat action props
   * @returns {JSX.Element}
   */
  
  const renderCustomActions = (props) => {
    return <CustomActions 
    userID={userID} 
    storage={storage}
    onSend={onSend}
     {...props} />;
  };

/**
   * Renders custom message views.
   * Displays a map preview for location messages.
   *
   * @param {Object} props - GiftedChat custom view props
   * @returns {JSX.Element|null}
   */
  
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
};
 

  return (
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
  paddingBottom: Platform.OS === 'ios' ? 40 : 0
  }
});


export default ChatScreen;