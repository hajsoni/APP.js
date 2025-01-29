import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

export default function MyProfile({ navigation }) {
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUserJson = await SecureStore.getItemAsync('currentUser');
      if (currentUserJson) {
        const currentUser = JSON.parse(currentUserJson);
        setUserData(currentUser);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    }
  };

  const handleSave = async () => {
    try {
      const usersJson = await SecureStore.getItemAsync('users');
      let users = usersJson ? JSON.parse(usersJson) : [];

      const updatedUsers = users.map(user => 
        user.email === userData.email ? { ...user, ...userData } : user
      );

      await SecureStore.setItemAsync('users', JSON.stringify(updatedUsers));
      await SecureStore.setItemAsync('currentUser', JSON.stringify(userData));

      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile data:', error);
      Alert.alert('Error', 'Failed to save profile data');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      const updatedUserData = { ...userData, password: newPassword };
      
      const usersJson = await SecureStore.getItemAsync('users');
      let users = JSON.parse(usersJson);
      const updatedUsers = users.map(user => 
        user.email === userData.email ? updatedUserData : user
      );

      await SecureStore.setItemAsync('users', JSON.stringify(updatedUsers));
      await SecureStore.setItemAsync('currentUser', JSON.stringify(updatedUserData));

      setUserData(updatedUserData);
      setNewPassword('');
      setConfirmNewPassword('');
      setShowChangePassword(false);
      Alert.alert('Success', 'Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        
        <View style={styles.header}>
          <Text style={styles.headerText}>My Profile</Text>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => setIsEditing(!isEditing)}
          >
            <Ionicons 
              name={isEditing ? "close" : "create-outline"} 
              size={24} 
              color="#4CAF50" 
            />
          </TouchableOpacity>
        </View>

        <TextInput
          value={userData.name}
          style={[styles.input, !isEditing && styles.disabledInput]}
          onChangeText={(text) => setUserData({...userData, name: text})}
          placeholder="Name"
          placeholderTextColor="#777"
          editable={isEditing}
        />
        <TextInput
          value={userData.surname}
          style={[styles.input, !isEditing && styles.disabledInput]}
          onChangeText={(text) => setUserData({...userData, surname: text})}
          placeholder="Surname"
          placeholderTextColor="#777"
          editable={isEditing}
        />
        <TextInput
          value={userData.email}
          style={[styles.input, styles.disabledInput]}
          placeholder="E-mail"
          placeholderTextColor="#777"
          editable={false}
        />

        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={() => setShowChangePassword(!showChangePassword)}
        >
          <Text style={styles.changePasswordText}>Change Password</Text>
        </TouchableOpacity>

        {showChangePassword && (
          <View style={styles.passwordContainer}>
            <TextInput
              value={newPassword}
              style={styles.input}
              onChangeText={setNewPassword}
              placeholder="New Password"
              placeholderTextColor="#777"
              secureTextEntry
            />
            <TextInput
              value={confirmNewPassword}
              style={styles.input}
              onChangeText={setConfirmNewPassword}
              placeholder="Confirm New Password"
              placeholderTextColor="#777"
              secureTextEntry
            />
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleChangePassword}
            >
              <Text style={styles.buttonText}>SAVE NEW PASSWORD</Text>
            </TouchableOpacity>
          </View>
        )}

        {isEditing && (
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>SAVE CHANGES</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 5,
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
  disabledInput: {
    opacity: 0.7,
    backgroundColor: '#1a1a1a',
    borderRadius: 5,
  },
  button: {
    width: '80%',
    backgroundColor: '#1a531b',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  changePasswordButton: {
    marginVertical: 10,
  },
  changePasswordText: {
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
  passwordContainer: {
    width: '100%',
    alignItems: 'center',
  },
});