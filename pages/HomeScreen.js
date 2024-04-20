import React from 'react';
import { ImageBackground, Image, Text, View, TouchableOpacity, StyleSheet,} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen({ }) {

  const navigation = useNavigation();
  return (
    <ImageBackground source={require('../assets/bg1.png')} style={styles.background}>
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Find Art</Text>
        <Text style={styles.subtitle}>Explore art near you!!</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#ff9e1b' }]}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={[styles.buttonText, { color: 'white' }]}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#ffffff', borderColor: '#ff9e1b' }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.buttonText, { color: '#ff9e1b' }]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Main', { screen: 'Map' })}
          >
            <Text style={[styles.skipText, { color: '#ff9e1b' }]}>Skip for now </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    marginTop: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  buttonsContainer: {
    marginTop: 80,
    flexDirection: 'column',
    marginBottom: 90,
  },
  button: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginVertical: 6,
  },
  buttonText: {
    fontSize: 18,
  },
  skipText: {
    marginBottom:20,
  }
});