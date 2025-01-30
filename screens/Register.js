import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Modal, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const termsContent = `Terms and Conditions for AuctionPortal

1. Acceptance of Terms
By accessing and using AuctionPortal, you agree to be bound by these Terms and Conditions.

2. User Registration
- Users must provide accurate and complete information
- Users must be at least 18 years old
- Each user may maintain only one account

3. Auction Rules
- All items must be accurately described
- Sellers must have the right to sell listed items
- Bids are binding contracts
- Winning bidders must complete the purchase

4. Payments and Fees
- Payment must be made within 48 hours of auction end
- Platform fees apply to successful sales
- All transactions must use our secure payment system

5. Prohibited Items
- Illegal goods and services
- Counterfeit items
- Hazardous materials
- Stolen property

6. User Conduct
- No fraudulent activities
- No harassment of other users
- No interference with the platform's operation

7. Termination
We reserve the right to terminate accounts for violation of these terms.

8. Liability
AuctionPortal is not liable for disputes between users.`;

  const handleRegister = async () => {
    if (!email || !password || !name || !surname) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Error', 'Please accept the Terms and Conditions');
      return;
    }

    try {
      const existingUsersJson = await SecureStore.getItemAsync('users');
      const users = existingUsersJson ? JSON.parse(existingUsersJson) : [];

      if (users.some(user => user.email === email)) {
        Alert.alert('Error', 'User with this email already exists');
        return;
      }

      const newUser = {
        email,
        password,
        name,
        surname,
        dateCreated: new Date().toISOString(),
        termsAccepted: new Date().toISOString()
      };

      users.push(newUser);
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
      <Modal
        visible={showTerms}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTerms(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Terms and Conditions</Text>
            <ScrollView style={styles.termsScroll}>
              <Text style={styles.termsText}>{termsContent}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTerms(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.welcomeText}>Create Account</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#B8B9C3" style={styles.inputIcon} />
          <TextInput
            placeholder="NAME"
            placeholderTextColor="#666"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#B8B9C3" style={styles.inputIcon} />
          <TextInput
            placeholder="SURNAME"
            placeholderTextColor="#666"
            style={styles.input}
            value={surname}
            onChangeText={setSurname}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#B8B9C3" style={styles.inputIcon} />
          <TextInput
            placeholder="E-MAIL"
            placeholderTextColor="#666"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#B8B9C3" style={styles.inputIcon} />
          <TextInput
            placeholder="PASSWORD"
            placeholderTextColor="#666"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#B8B9C3"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setTermsAccepted(!termsAccepted)}
          >
            <Ionicons
              name={termsAccepted ? "checkbox" : "square-outline"}
              size={24}
              color="#4CAF50"
            />
          </TouchableOpacity>
          <View style={styles.termsTextContainer}>
            <Text style={styles.termsLabel}>I accept the </Text>
            <TouchableOpacity onPress={() => setShowTerms(true)}>
              <Text style={styles.termsLink}>Terms and Conditions</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Logowanie')}>
            <Text style={styles.loginLink}>LOG IN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2337',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A305A',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 15,
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: '#3D4266',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: 10,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  termsTextContainer: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  termsLabel: {
    color: '#B8B9C3',
    fontSize: 14,
  },
  termsLink: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2A305A',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  termsScroll: {
    marginBottom: 15,
  },
  termsText: {
    color: '#B8B9C3',
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#1a531b',
    width: '100%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#B8B9C3',
    fontSize: 14,
  },
  loginLink: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
});