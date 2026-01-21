import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as ExpoLocation from 'expo-location';
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

/**
 * CustomActions component
 *
 * Renders a "+" button in the chat UI that opens an action sheet.
 * Allows the user to:
 *  - choose an image from the library
 *  - take a photo
 *  - share their current location
 *
 * Media files are uploaded to Firebase Storage and then sent as chat messages.
 *
 * @component
 * @param {Object} props
 * @param {(messages: Object[]) => void} props.onSend
 *        Callback used to send messages to the chat.
 * @param {import('firebase/storage').FirebaseStorage} props.storage
 *        Initialized Firebase Storage instance.
 * @param {Object} [props.wrapperStyle]
 *        Optional style overrides for the icon wrapper.
 * @param {Object} [props.iconTextStyle]
 *        Optional style overrides for the "+" icon.
 * @param {string} props.userID
 *        Unique identifier of the current user.
 *
 * @returns {JSX.Element} Touchable action button
 */

const CustomActions = ({ onSend, storage, wrapperStyle, iconTextStyle, userID }) => {

    const actionSheet = useActionSheet();

  /**
   * Opens the action sheet and handles user selection.
   *
   * Options:
   * 0 → Choose image from library
   * 1 → Take a photo
   * 2 → Send current location
   */

    const onActionPress = () => {
        const options = ['Choose From Library', 'Take Photo', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1; 
        actionSheet.showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          async (buttonIndex) => {
            switch (buttonIndex) {
              case 0:
                pickImage();
                console.log('User wants to choose a photo from library');
                return;
              case 1:
                takePhoto();
                console.log('User wants to take a photo');
                return;
              case 2:
                getLocation();
                console.log('User wants to send their location');
                default:
            }
        },
      );
    };

  /**
   * Requests permission and allows the user to pick an image
   * from the device's media library.
   *
   * If an image is selected, it is uploaded and sent as a message.
   *
   * @async
   * @returns {Promise<void>}
   */

    const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      console.log('Image Picker Result:', result);
      console.log('Image URI:', result.assets?.[0]?.uri);
      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      } 
       else Alert.alert("Permissions haven't been granted.");
    }
  }

  /**
   * Requests camera permission and allows the user to take a photo.
   *
   * If a photo is taken, it is uploaded and sent as a message.
   *
   * @async
   * @returns {Promise<void>}
   */

  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
     /*  let savePerm = await MediaLibrary.requestPermissionsAsync();
      if (savePerm?.granted) {
          await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
      }
      console.log('Camera Result:', result);
      console.log('Camera URI:', result.assets?.[0]?.uri); */
      if (!result.canceled) 
        await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  }

  /**
   * Requests foreground location permission and sends
   * the user's current GPS coordinates as a message.
   *
   * @async
   * @returns {Promise<void>}
   */

  const getLocation = async () => {
    try {
    let permissions = await ExpoLocation.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await ExpoLocation.getCurrentPositionAsync({});
            console.log('Fetched Location:', location);
      if (location) {
        onSend([
          {
            createdAt: new Date(),
            user: {
              _id: userID,
            },
            location: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            },     
        }
      ]);
      } else {
        Alert.alert("Error occurred while fetching location");
    }
  } else {
      Alert.alert("Permission to access location was denied");
      }
  } catch (error) {
      console.log('Error getting location:', error);
      Alert.alert("Error fetching location", error.message);
    }
};

  /**
   * Generates a unique Firebase Storage reference string
   * based on user ID, timestamp, and original file name.
   *
   * @param {string} uri - Local image URI
   * @returns {string} Unique storage reference path
   */

    const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  };

  /**
   * Uploads an image to Firebase Storage and sends
   * the resulting download URL as an image message.
   *
   * @async
   * @param {string} imageURI - Local image URI
   * @returns {Promise<void>}
   */

    const uploadAndSendImage = async (imageURI) => {
          console.log('uploadAndSendImage called with URI:', imageURI);
    if (!imageURI) {
      console.error('Error: imageURI is undefined in uploadAndSendImage');
      return;
    }
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref)
      onSend([
        { image: imageURL,
          createdAt: new Date(),
          user: {
            _id: userID,
            name: ' ',
          },
         }]);
    });
  }

    return (
        <TouchableOpacity 
        style={styles.container} 
        onPress={onActionPress}
        accessible={true}
        accessibilityLabel="More options"
        accessibilityHint="Let’s you choose to send an image or your location"  
        accessibilityRole="button"
         >
        <View style={[styles.wrapper, wrapperStyle]}>
            <Text style={[styles.iconText, iconTextStyle]}> +</Text>
        </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;