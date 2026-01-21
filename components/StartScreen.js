import React, { useState } from 'react';
import {Alert, ImageBackground, StyleSheet,
  ScrollView, View, Text, TextInput,
  TouchableOpacity, Platform, KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
// import Icon from '../assets/icon.svg';
import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebaseConfig";

/**
 * StartScreen
 *
 * Initial entry screen of the application.
 * Allows the user to:
 *  - enter a display name
 *  - choose a preferred chat background color
 *  - sign in anonymously via Firebase Authentication
 *
 * After successful sign-in, navigates to the ChatScreen
 * and passes user preferences as route parameters.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.navigation
 *        React Navigation navigation object.
 *
 * @returns {JSX.Element} Start screen UI
 */

const StartScreen = ({ navigation }) => {

/**
   * Display name entered by the user.
   *
   * @type {[string, Function]}
   */  
  const [name, setName] = useState('');

  /**
   * Selected background color for the chat screen.
   *
   * @type {[string, Function]}
   */  
  const [chosenColor, setChosenColor] = useState('');
 
  const image = require('../assets/BackgroundImage.png');
  
  /**
   * Signs the user in anonymously using Firebase Authentication
   * and navigates to the ChatScreen on success.
   *
   * Passes user ID, name, and chosen background color
   * via React Navigation route params.
   */

    const signInUser = () => {
        signInAnonymously(auth).then(result => {
              console.log("StartScreen.js - result.user.uid:", result.user.uid);
              navigation.navigate("ChatScreen", {
                userID: result.user.uid,
                name: name,
                backgroundColor: chosenColor
              });
              Alert.alert("Signed in successfully!");
            })
            .catch((error) => {
                Alert.alert("Unable to sign in, try later again.");
        })
}
  
return (
  <SafeAreaProvider>
    <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <SafeAreaView style={styles.wholeView} edges={['top', 'left', 'right']}> 
      <ImageBackground source={image} resizeMode="cover" style={styles.backgroundImage}>
        <View style={styles.container1}>
          <Text style={styles.title}>ChatApp!</Text>
        </View>
        <View style={styles.container2}> 
                {/* <Icon width={20} height={20} style={{ marginRight: 8 }} /> */}
          <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    keyboardShouldPersistTaps="handled"
  >
          <View style={styles.textPart}>
          <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder='Your Name'
                  placeholderOpacity="0.5"
                  placeholderTextColor='#757083'
                selectionColor='#757083'
                paddingLeft='15'
                />
          </View>
            <View style={styles.colorPart}>
              <Text style={styles.colorText}>Choose background color:</Text>
              <View style={styles.colorButtons}>
                    <TouchableOpacity style={[styles.backgroundButton, { backgroundColor: '#090C08' },
                    chosenColor === '#090C08' && styles.selectedColor,
                    ]} onPress={() => setChosenColor('#090C08')}>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.backgroundButton, { backgroundColor: '#474056' },
                    chosenColor === '#474056' && styles.selectedColor,
                    ]} onPress={() => setChosenColor('#474056')}>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.backgroundButton, { backgroundColor: '#8A95A5' },
                    chosenColor === '#8A95A5' && styles.selectedColor,
                    ]} onPress={() => setChosenColor('#8A95A5')}>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.backgroundButton, { backgroundColor: '#B9C6AE' },
                    chosenColor === '#B9C6AE' && styles.selectedColor,
                    ]} onPress={() => setChosenColor('#B9C6AE')}>
                    </TouchableOpacity>
              </View>
          </View>
          <View sytle={styles.buttonPart}>
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={signInUser}>
                  <Text style={styles.navButtonText}>Enter Chat</Text>
            </TouchableOpacity>
          </View>
        </ScrollView> 
          </View>
        </ImageBackground>
      </SafeAreaView>
    </KeyboardAvoidingView>
  </SafeAreaProvider>
 );
}

const styles = StyleSheet.create({
  wholeView: {
    flex: 1, // make bckgrnd fill parent
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'contain'
  },
  container1: {
    flex: 60,
    flexDirection: 'column',
  },
    title: {
      flex: 1,
      fontSize: 45,
      maxHeight: '44%',
      height: '50%',
      fontWeight: '600',
      color: '#FFFFFF',
      justifyContent: 'center',
      alignContent: 'center',
      marginTop: 60,
      textAlign: 'center',
    },
  container2: {
    flex: 40,
    flexDirection: 'column',
    width: '88%',
    height: '44%',
    maxHeight: '50%',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginLeft: '6%',
    marginBottom: '15%',
  },
    textPart: {
      flex: 30,
      width: '88%',
    },
      textInput: {
        textAlign: 'flex-start',
        width: '113.5%',
        paddingTop: 22.5,
        paddingBottom: 22.5,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 10,  
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
      },
    colorPart: {
      flex: 45,
      flexDirection: 'column',
      width: '88%',
      alignSelf: 'flex-start',
      //marginLeft: '4%',
    },
      colorText: {
        flex: 1/3,
        textAlign: 'left',
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 1,
        marginTop: 10,
        marginBottom: 4,
        paddingTop: 10,
        paddingBottom: 2,
        width: '100%',
      },
      colorButtons: {
        flex: 2/3,
        flexDirection: 'row',
        alignContent: 'flex-start',
        alignSelf: 'flex-start',
        width: '100%',
        marginBottom: 7,
      },
      selectedColor: {
        borderWidth: 3,
        borderColor: '#6057c0ff',
        borderPadding: 5,
    },
      backgroundButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginTop: 5,
        marginBottom: 5,
        marginRight: 10,
        padding: 3,
        activeOpacity: 0.5,
        
      },
    buttonPart: {
      flex: 25,
      width: '88%',
    },
      navButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#757083',
        width: '100%',
        marginTop: 5,
        marginBottom: 15,
        paddingTop: 10,
        paddingBottom: 10,
      },
      navButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        padding: 10,
      },
});

export default StartScreen;