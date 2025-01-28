import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default function AddOffer({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setLocation('');
    setImage(null);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access the gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access the camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Permission to access location was denied');
      return;
    }

    const userLocation = await Location.getCurrentPositionAsync({});
    const coords = `${userLocation.coords.latitude}, ${userLocation.coords.longitude}`;
    setLocation(coords);
    Alert.alert('Location fetched', `Your location is: ${coords}`);
  };

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
      image: image || 'https://via.placeholder.com/200x200/1a1a1a/ffffff?text=No+Image',
      date: new Date().toISOString(),
      status: 'active',
      views: 0,
    };

    try {
      await axios.post('http://10.0.2.2:3000/myOffers', newOffer);
      Alert.alert('Success', 'Offer added successfully', [
        { text: 'Add Another', onPress: resetForm },
        {
          text: 'Go to My Offers',
          onPress: () => {
            resetForm(); 
            navigation.navigate('My Offers');
          },
        },
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
      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>Get Current Location</Text>
      </TouchableOpacity>

      <View style={styles.imagePickerContainer}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take a Photo</Text>
        </TouchableOpacity>
      </View>

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
  button: { backgroundColor: '#1a531b', padding: 15, alignItems: 'center', borderRadius: 5, marginBottom: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  imagePickerContainer: { marginBottom: 20, alignItems: 'center' },
  image: { width: 200, height: 200, borderRadius: 10, marginBottom: 10 },
});
 