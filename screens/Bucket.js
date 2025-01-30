import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const AddressForm = ({ visible, onClose, onSubmit }) => {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    phoneNumber: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleSubmit = () => {
    if (!address.street || !address.city || !address.postalCode || !address.phoneNumber) {
      Alert.alert('Error', 'Please fill in all address fields');
      return;
    }
    if (!paymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
    onSubmit({ ...address, paymentMethod });
  };

  const PaymentOption = ({ value, label, icon }) => (
    <TouchableOpacity 
      style={[
        styles.paymentOption,
        paymentMethod === value && styles.paymentOptionSelected
      ]}
      onPress={() => setPaymentMethod(value)}
    >
      <View style={styles.paymentRadio}>
        <View style={paymentMethod === value ? styles.paymentRadioSelected : null} />
      </View>
      <Ionicons name={icon} size={24} color="#B8B9C3" style={styles.paymentIcon} />
      <Text style={styles.paymentLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Delivery Details</Text>
          
          <Text style={styles.sectionTitle}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Ulica, numer domu"
            placeholderTextColor="#B8B9C3"
            value={address.street}
            onChangeText={(text) => setAddress({ ...address, street: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Miasto"
            placeholderTextColor="#B8B9C3"
            value={address.city}
            onChangeText={(text) => setAddress({ ...address, city: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Kod pocztowy"
            placeholderTextColor="#B8B9C3"
            value={address.postalCode}
            onChangeText={(text) => setAddress({ ...address, postalCode: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Numer telefonu"
            placeholderTextColor="#B8B9C3"
            value={address.phoneNumber}
            onChangeText={(text) => setAddress({ ...address, phoneNumber: text })}
            keyboardType="phone-pad"
          />

          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <PaymentOption 
              value="card" 
              label="Karta kredytowa" 
              icon="card-outline" 
            />
            <PaymentOption 
              value="cash" 
              label="Gotówka przy odbiorze" 
              icon="cash-outline" 
            />
            <PaymentOption 
              value="transfer" 
              label="Przelew krajowy" 
              icon="wallet-outline" 
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.submitButton]} 
              onPress={handleSubmit}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const BucketItem = ({ item, onRemove, onBuyNow }) => (
  <View style={styles.bucketItem}>
    <Image
      source={{ uri: item.image || 'https://via.placeholder.com/200x200/1a1a1a/ffffff?text=No+Image' }}
      style={styles.itemImage}
    />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
      <View style={styles.bottomInfo}>
        <Text style={styles.itemPrice}>{item.price.toFixed(2)} PLN</Text>
        <Text style={styles.itemLocation}>
          <Ionicons name="location" size={16} color="#B8B9C3" /> {item.location}
        </Text>
      </View>
      <TouchableOpacity style={styles.buyButton} onPress={() => onBuyNow(item)}>
        <Text style={styles.buyButtonText}>BUY NOW</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeButton}>
      <Ionicons name="close" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default function Bucket() {
  const [bucketItems, setBucketItems] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadBucketItems = async () => {
        try {
          const items = await SecureStore.getItemAsync('bucketItems');
          if (items) {
            setBucketItems(JSON.parse(items));
          }
        } catch (error) {
          console.error('Error loading bucket items:', error);
        }
      };

      loadBucketItems();
    }, [])
  );

  const removeFromBucket = async (itemId) => {
    try {
      const updatedItems = bucketItems.filter(item => item.id !== itemId);
      await SecureStore.setItemAsync('bucketItems', JSON.stringify(updatedItems));
      setBucketItems(updatedItems);
    } catch (error) {
      console.error('Error removing item from bucket:', error);
    }
  };

  const handleBuyNow = (item) => {
    setSelectedItem(item);
    setShowAddressForm(true);
  };

  const handlePurchase = async (deliveryDetails) => {
    Alert.alert(
      'Success!',
      `Order placed successfully!\nPayment method: ${deliveryDetails.paymentMethod}`,
      [
        {
          text: 'OK',
          onPress: async () => {
            await removeFromBucket(selectedItem.id);
            setShowAddressForm(false);
            setSelectedItem(null);
          }
        }
      ]
    );
  };

  const totalPrice = bucketItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.headerTitle}>Your Bucket</Text>
      </View>

      {bucketItems.length > 0 ? (
        <View style={styles.content}>
          <FlatList
            data={bucketItems}
            renderItem={({ item }) => (
              <BucketItem 
                item={item} 
                onRemove={removeFromBucket}
                onBuyNow={handleBuyNow}
              />
            )}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total Price:</Text>
                <Text style={styles.totalPrice}>{totalPrice.toFixed(2)} PLN</Text>
              </View>
            }
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={50} color="#B8B9C3" />
          <Text style={styles.emptyText}>Your bucket is empty</Text>
          <Text style={styles.emptySubText}>Add some items to get started</Text>
        </View>
      )}

      <AddressForm
        visible={showAddressForm}
        onClose={() => {
          setShowAddressForm(false);
          setSelectedItem(null);
        }}
        onSubmit={handlePurchase}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Główne style kontenera
  container: {
    flex: 1,
    backgroundColor: '#1E2337',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2A305A',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },

  // Style dla pojedynczego przedmiotu w koszyku
  bucketItem: {
    flexDirection: 'row',
    backgroundColor: '#2A305A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    color: '#B8B9C3',
    fontSize: 14,
    marginBottom: 8,
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemLocation: {
    color: '#B8B9C3',
    fontSize: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Style dla przycisków
  buyButton: {
    backgroundColor: '#1a531b',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF4444',
    marginLeft: 10,
  },

  // Style dla modalnego formularza
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2A305A',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1E2337',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#3D4266',
    fontSize: 16,
  },

  // Style dla opcji płatności
  paymentOptions: {
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2337',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3D4266',
  },
  paymentOptionSelected: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  paymentRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentRadioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  paymentIcon: {
    marginHorizontal: 12,
  },
  paymentLabel: {
    color: '#fff',
    fontSize: 16,
  },

  // Style dla przycisków w modalu
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#FF4444',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Style dla pustego koszyka
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubText: {
    color: '#B8B9C3',
    fontSize: 16,
  },

  // Style dla podsumowania
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A305A',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  totalText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
  }
});