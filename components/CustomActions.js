import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from 'react';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as ExpoLocation from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";


const CustomActions = ({ onSend, storage, wrapperStyle, iconTextStyle, userID }) => {

    const actionSheet = useActionSheet();


    const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  }


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

    const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref)
      onSend({ image: imageURL })
    });
  }

 const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
        else Alert.alert("Permissions haven't been granted.");
    }
  }

  const takePhoto = async () => {

    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  }

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
    fontSize: 30,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;