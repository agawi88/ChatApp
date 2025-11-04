import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from 'react';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as ExpoLocation from 'expo-location';
import * as MediaLibrary from 'expo-media-library';

const CustomActions = ({ onSend, wrapperStyle, iconTextStyle}) => {

    const actionSheet = useActionSheet();
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);

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

 const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        console.log('uploading and uploading the image occurs here');
      } else Alert.alert("Permissions haven't been granted.");
    }
  };

  const takePhoto = async () => {

    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
        let requestMediaLibraryPermissions = await MediaLibrary.requestPermissionsAsync();
        if (requestMediaLibraryPermissions?.granted)
          await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
        setImage(result.assets[0]);
      } else Alert.alert("Permissions haven't been granted.");
    }
  };

  const getLocation = async () => {
    let permissions = await ExpoLocation.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await ExpoLocation.getCurrentPositionAsync({});
      //setLocation(location);
      if (location) {
        onSend({
            location: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            },     
        });
      } else Alert.alert("Permission to access location was denied");
    } else Alert.alert("Permission to access location was denied");
 }

    return (
<TouchableOpacity style={StyleSheet.container} onPress={onActionPress}>
  <View style={[StyleSheet.wrapper, wrapperStyle]}>
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
    fontSize: 10,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;