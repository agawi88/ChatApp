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
              createdAt: new Date(doc.data().createdAt.toMillis()), // one way to change convert
              // the TimeStamp stored at the createdAt property of each message to a Date object
              // that Gifted Chat understands. Other way suggested by chatGPT:
              // const data = doc.data();
/*         return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt?.toDate() || new Date(),
          user: data.user,
        };
 */
            });
            });
            setMessages(newMessages);
        });
//   Clean up code
        return () => unsubMessages();
  }, [db, navigation, name, backgroundColor]); //safer option so if changes occur they will re-run


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
 
  return (
    <KeyboardAvoidingView // always needs flex: 1
    style={{ flex: 1 }}
    behavior={Platform.OS === 'android' ? 'padding' : 'height'} // padding is for iOS and height is for android. Since I'm working on both, depending on which app works atm, I need both in my code
    keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0} // solution for iOS Expo app, which tends to have problems with the text iput field of the
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
{/*    alternative option for KeyboardAvoidingView&Platform, which didn't seem to work properly with my Expo Go on iOS
     {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}  
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