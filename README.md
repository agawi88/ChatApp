REACT NATIVE PROJECT: MOBILE CHAT APP
The aim of this project was building a chat app for mobile devices using React Native, Expo GO, Android Symulator, Google Firestore Database, Google Firebase authentication,Firebase Cloud Storage, Gifted Chat Library, etc. 

GOAL: The app aims to provide users with a chat interface allowing to share images, both from the library as well as taking images, and the user's location on the map.

1. Design Specifications
   ● Vertical and horizontal spacing: evenly distributed
   ● App title: font size 45, font weight 600, font color #FFFFFF Page 3
   ● “Your name”: font size 16, font weight 300, font color #757083, 50% opacity
   ● “Choose background color”: font size 16, font weight 300, font color #757083, 100% opacity
   ● Color options HEX codes: #090C08; #474056; #8A95A5; #B9C6AE
   ● Start chatting button: font size 16, font weight 600, font color #FFFFFF, button color #757083

2. UI Components:
- Start Screen
- Chat Screen
- CustomActions/ActionSheet

3. Features
- customizability: users can enter their name and choose their background color within the ChatScreen,
- anonymous authentication from Firebase Auth: users do not need an account,
- messages stored within Firebase database,
- connectivity-check: the app check whether the user is online or offline (by means of the Network status detection @react-native-community/netinfo) showing respectively the necessary view (offline users do not have the text input field),
- following media services can be shared/send via the chat: images from camera and the library and current location on a map using react-native-maps (all media are stored in Firebase Storage).

4. Setting up ChattApp

PREREQUISITES
React Native 
Expo
Firebase (Auth, Firestore, Storage)
React Navigation
Gifted Chat
AsyncStorage
expo-image-picker
expo-location
@expo/react-native-action-sheet

INSTALLING
git clone https://github.com/agawi88/ChatApp
cd ChatApp
npm install
npx expo start (for android type a, for ios either type i or scan the code with your physical device. At the final stage web version not available due to native features.)
