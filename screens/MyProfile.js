import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function MyProfile() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedName = await SecureStore.getItemAsync('userName');
        const storedSurname = await SecureStore.getItemAsync('userSurname');
        const storedEmail = await SecureStore.getItemAsync('userEmail');
        const storedPassword = await SecureStore.getItemAsync('userPassword');

        setName(storedName || '');
        setSurname(storedSurname || '');
        setEmail(storedEmail || '');
        setPassword(storedPassword || '');
      } catch (error) {
        console.log('Error fetching profile data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await SecureStore.setItemAsync('userName', name);
      await SecureStore.setItemAsync('userSurname', surname);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.log('Error saving profile data:', error);
      Alert.alert('Error', 'Failed to save profile data');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <TextInput
        value={name}
        style={styles.input}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor="#777"
      />
      <TextInput
        value={surname}
        style={styles.input}
        onChangeText={setSurname}
        placeholder="Surname"
        placeholderTextColor="#777"
      />
      <TextInput
        value={email}
        style={styles.input}
        editable={false}
        placeholder="E-mail"
        placeholderTextColor="#777"
      />
      <TextInput
        value={password}
        style={styles.input}
        editable={false}
        secureTextEntry
        placeholder="Password"
        placeholderTextColor="#777"
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>SAVE</Text>
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
