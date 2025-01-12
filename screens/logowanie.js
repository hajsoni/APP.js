import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function Logowanie({ setIsLoggedIn }) {
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <TextInput placeholder="E-MAIL" placeholderTextColor="#fff" style={styles.input} />
      <TextInput placeholder="PASSWORD" placeholderTextColor="#fff" secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOG IN</Text>
      </TouchableOpacity>
      <Text style={styles.text}>
        If you don't have an account{' '}
        <Text style={styles.link}>REGISTER</Text>
      </Text>
      <Text style={styles.text}>
        If you forgot your password{' '}
        <Text style={styles.link}>FORGOT PASSWORD</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginBottom: 20,
    color: '#fff',
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#1a531b',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    marginTop: 10,
  },
  link: {
    color: '#00ff00',
    fontWeight: 'bold',
  },
});
