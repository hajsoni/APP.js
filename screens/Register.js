import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !name || !surname) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Pobierz istniejącą listę użytkowników
      const existingUsersJson = await SecureStore.getItemAsync('users');
      const users = existingUsersJson ? JSON.parse(existingUsersJson) : [];

      // Sprawdź, czy użytkownik już istnieje
      if (users.some(user => user.email === email)) {
        Alert.alert('Error', 'User with this email already exists');
        return;
      }

      // Dodaj nowego użytkownika do listy
      const newUser = {
        email,
        password,
        name,
        surname,
        dateCreated: new Date().toISOString()
      };

      users.push(newUser);

      // Zapisz zaktualizowaną listę użytkowników
      await SecureStore.setItemAsync('users', JSON.stringify(users));

      Alert.alert(
        'Success',
        'Account created successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Logowanie')
          }
        ]
      );
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Failed to create account');
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
      <TextInput
        placeholder="NAME"
        placeholderTextColor="#fff"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="SURNAME"
        placeholderTextColor="#fff"
        style={styles.input}
        value={surname}
        onChangeText={setSurname}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>
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
});