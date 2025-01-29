import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function Logowanie({ setIsLoggedIn, navigation, savedCredentials }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (savedCredentials) {
      setEmail(savedCredentials.email);
      setPassword(savedCredentials.password);
    }
  }, [savedCredentials]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Pobierz listę użytkowników
      const usersJson = await SecureStore.getItemAsync('users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Znajdź użytkownika o podanym emailu i haśle
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Zapisz dane aktualnie zalogowanego użytkownika
        await SecureStore.setItemAsync('currentUser', JSON.stringify(user));
        setIsLoggedIn(true);
        Alert.alert('Success', 'Logged in successfully');
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to read data');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <TextInput
        placeholder="E-MAIL"
        placeholderTextColor="#fff"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="PASSWORD"
        placeholderTextColor="#fff"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOG IN</Text>
      </TouchableOpacity>
      <Text style={styles.text}>
        If you don't have an account{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          REGISTER
        </Text>
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
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  input: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginBottom: 20,
    color: '#fff',
    padding: 10,
  },
  button: {
    width: '80%',
    backgroundColor: '#1a531b',
    alignItems: 'center',
    padding: 10,
    marginVertical: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
  },
  link: {
    color: '#00ff00',
    fontWeight: 'bold',
  },
});