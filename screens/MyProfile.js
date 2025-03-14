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
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
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

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              value={userData.name}
              style={[styles.input, !isEditing && styles.disabledInput]}
              onChangeText={(text) => setUserData({...userData, name: text})}
              placeholder="Name"
              placeholderTextColor="#666"
              editable={isEditing}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              value={userData.surname}
              style={[styles.input, !isEditing && styles.disabledInput]}
              onChangeText={(text) => setUserData({...userData, surname: text})}
              placeholder="Surname"
              placeholderTextColor="#666"
              editable={isEditing}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              value={userData.email}
              style={[styles.input, styles.disabledInput]}
              placeholder="E-mail"
              placeholderTextColor="#666"
              editable={false}
            />
          </View>

          <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={() => setShowChangePassword(!showChangePassword)}
          >
            <Ionicons name="key-outline" size={20} color="#4CAF50" />
            <Text style={styles.changePasswordText}>Change Password</Text>
          </TouchableOpacity>

          {showChangePassword && (
            <View style={styles.passwordContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  value={newPassword}
                  style={styles.input}
                  onChangeText={setNewPassword}
                  placeholder="New Password"
                  placeholderTextColor="#666"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  value={confirmNewPassword}
                  style={styles.input}
                  onChangeText={setConfirmNewPassword}
                  placeholder="Confirm New Password"
                  placeholderTextColor="#666"
                  secureTextEntry
                />
              </View>

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
    backgroundColor: '#1E2337',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 30,
    backgroundColor: '#2A305A',
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
    backgroundColor: '#1E2337',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  formContainer: {
    width: '90%',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#2A305A',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    elevation: 2,
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
  disabledInput: {
    opacity: 0.7,
  },
  button: {
    width: '100%',
    backgroundColor: '#1a531b',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    padding: 10,
  },
  changePasswordText: {
    color: '#4CAF50',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  passwordContainer: {
    width: '100%',
    alignItems: 'center',
  },
});