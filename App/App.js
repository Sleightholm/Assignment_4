import React from 'react';
import { SafeAreaView, ImageBackground } from 'react-native';
import PetApp from '../components/PetApp'; // Adjust the path based on your project structure
import BackgroundImage from '../assets/background1.png';
import styles from '../styles/styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ImageBackground source={BackgroundImage} style={styles.container}>
    <SafeAreaView style={styles.container}>
      <PetApp />
    </SafeAreaView>
    </ImageBackground>
    </GestureHandlerRootView>
  );
};

export default App;
