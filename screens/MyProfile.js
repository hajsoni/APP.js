import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function MyProfile() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Profile</Text>
      <TextInput placeholder="Name" placeholderTextColor="#fff" style={styles.input} />
      <TextInput placeholder="Surname" placeholderTextColor="#fff" style={styles.input} />
      <TextInput placeholder="E-mail" placeholderTextColor="#fff" style={styles.input} />
      <TextInput placeholder="Password" placeholderTextColor="#fff" secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#1a531b',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
