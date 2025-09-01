import { useState } from 'react';
import { onPress, ImageBackground, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
// import Icon from '../assets/icon.svg';

const Screen1 = ({ navigation }) => {
  const [name, setName] = useState('');
  const [chosenColor, setChosenColor] = useState('');
  const image = require('../assets/BackgroundImage.png');
  
  return (
  <SafeAreaProvider>
   <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
    <ImageBackground source={image} resizeMode="cover" style={styles.backgroundImage}>
      <Text style={styles.title}>ChatApp!</Text>     
          <View style={styles.container}>
          {/* <Icon width={20} height={20} style={{ marginRight: 8 }} /> */}
        <TextInput
        style={styles.textInput}
        value={name}
        onChangeText={setName}
        placeholder='Your Name'
        placeholderOpacity="0.5"
        placeholderTextColor='#757083'
        selectionColor='#757083'
            />
        <Text style={styles.colorButtonsText}>Choose background color:</Text>
        <View style={styles.colorButtonsContainer}>
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
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate('Screen2', { name: name, backgroundColor: chosenColor })
              }>
          <Text style={styles.navButtonText}>Enter Chat</Text>
          </TouchableOpacity>
      </View>
    </ImageBackground>
   </SafeAreaView>
  </SafeAreaProvider>
 );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // make bckgrnd fill parent
    justifyContent: 'center',
    alignContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'contain'
  },
  title: {
    flex: 1,
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 60,
    textAlign: 'center',
  },
  container: {
    flexDirection: 'column',
    width: '88%',
    height: '44%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginLeft: '6%',
    marginBottom: '8%',
  },
  textInput: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'left',
    width: '88%',
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 25,  
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },
  colorButtonsText: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1,
    marginTop: 10,
    paddingLeft: 25,
    paddingTop: 5,
    paddingBottom: 5,
    width: '88%',

  },
  colorButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'flex-start',
    width: '88%',
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
    margin: 10,
    padding: 5,
    activeOpacity: 0.5,
    
  },
  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#757083',
    width: '88%',
    marginTop: 25,
    marginBottom: 15,
    padding: 15,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default Screen1;