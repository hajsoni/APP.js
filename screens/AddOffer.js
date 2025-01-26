import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function AddOffer({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');

  const handleAddOffer = async () => {
    if (!name || !description || !price || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newOffer = {
      id: Date.now().toString(),
      name,
      description,
      price: parseFloat(price),
      location,
      image: 'https://via.placeholder.com/200x200/1a1a1a/ffffff?text=No+Image',
      date: new Date().toISOString(),
      status: 'active',
      views: 0,
    };

    try {
      await axios.post('http://10.0.2.2:3000/myOffers', newOffer);
      Alert.alert('Success', 'Offer added successfully', [
        { text: 'Add Another', onPress: () => { setName(''); setDescription(''); setPrice(''); setLocation(''); } },
        { text: 'Go to My Offers', onPress: () => navigation.navigate('My Offers') },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save the offer');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Offer</Text>
      <TextInput placeholder="Name" placeholderTextColor="#fff" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Description" placeholderTextColor="#fff" style={styles.input} value={description} onChangeText={setDescription} />
      <TextInput placeholder="Price" placeholderTextColor="#fff" style={styles.input} keyboardType="numeric" value={price} onChangeText={setPrice} />
      <TextInput placeholder="Localization" placeholderTextColor="#fff" style={styles.input} value={location} onChangeText={setLocation} />
      <TouchableOpacity style={styles.button} onPress={handleAddOffer}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  text: { color: '#fff', fontSize: 18, marginBottom: 20 },
  input: { backgroundColor: '#1a1a1a', color: '#fff', marginBottom: 10, padding: 10, borderRadius: 5 },
  button: { backgroundColor: '#1a531b', padding: 15, alignItems: 'center', borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
