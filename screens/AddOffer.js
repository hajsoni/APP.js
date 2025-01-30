import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Add Offer</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="pricetag-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput 
              placeholder="Name" 
              placeholderTextColor="#666" 
              style={styles.input} 
              value={name} 
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="document-text-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput 
              placeholder="Description" 
              placeholderTextColor="#666" 
              style={[styles.input, styles.textArea]} 
              value={description} 
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="cash-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput 
              placeholder="Price" 
              placeholderTextColor="#666" 
              style={styles.input} 
              keyboardType="numeric" 
              value={price} 
              onChangeText={setPrice}
            />
          </View>

          <View style={styles.locationContainer}>
            <View style={[styles.inputContainer, styles.locationInput]}>
              <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput 
                placeholder="Localization" 
                placeholderTextColor="#666" 
                style={styles.input} 
                value={location} 
                onChangeText={setLocation}
              />
            </View>
            <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
              <Ionicons name="navigate" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.imageSection}>
            {image && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={styles.image} />
              </View>
            )}
            
            <View style={styles.imageButtonsContainer}>
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Ionicons name="images-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleAddOffer}>
            <Text style={styles.submitButtonText}>ADD OFFER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2337',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 25,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    gap: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A305A',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#3D4266',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    padding: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  locationInput: {
    flex: 1,
  },
  locationButton: {
    backgroundColor: '#1a531b',
    width: 54,
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSection: {
    marginVertical: 10,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#2A305A',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#3D4266',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#1a531b',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
 