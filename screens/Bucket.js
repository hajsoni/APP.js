import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

const AddressForm = ({ visible, onClose, onSubmit }) => {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    phoneNumber: '',
  });

  const handleSubmit = () => {
    // Prosta walidacja
    if (!address.street || !address.city || !address.postalCode || !address.phoneNumber) {
      Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola');
      return;
    }
    onSubmit(address);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Adres dostawy</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Ulica i numer"
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

          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.modalButtonText}>Anuluj</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={handleSubmit}>
              <Text style={styles.modalButtonText}>Kontynuuj</Text>
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
        <Text style={styles.itemLocation}>📍 {item.location}</Text>
      </View>
      <TouchableOpacity style={styles.buyButton} onPress={() => onBuyNow(item)}>
        <Text style={styles.buyButtonText}>KUP TERAZ</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeButton}>
      <Text style={styles.removeButtonText}>×</Text>
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

  const handlePurchase = async (address) => {
    // Tutaj możesz dodać logikę przetwarzania zakupu
    Alert.alert(
      'Sukces!',
      'Twoje zamówienie zostało złożone. Dziękujemy za zakupy!',
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
          <Text style={styles.emptyIcon}>🛒</Text>
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
  // Istniejące style...
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
  bucketItem: {
    flexDirection: 'row',
    backgroundColor: '#2A305A',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Nowe style dla formularza adresu
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2A305A',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1E2337',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#4A4D6A',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF4444',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // Style dla przycisku "KUP TERAZ"
  buyButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  buyButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

 itemImage: {
   width: 100,
   height: 100,
   borderRadius: 10,
 },
 itemInfo: {
   flex: 1,
   marginLeft: 12,
   justifyContent: 'space-between',
 },
 itemName: {
   color: '#fff',
   fontSize: 18,
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
 removeButtonText: {
   color: '#fff',
   fontSize: 20,
   fontWeight: 'bold',
 },
 totalContainer: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   backgroundColor: '#2A305A',
   padding: 20,
   borderRadius: 15,
   marginTop: 20,
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
 },
 emptyContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   padding: 20,
 },
 emptyIcon: {
   fontSize: 50,
   marginBottom: 20,
 },
 emptyText: {
   color: '#fff',
   fontSize: 24,
   fontWeight: 'bold',
   marginBottom: 10,
 },
 emptySubText: {
   color: '#B8B9C3',
   fontSize: 16,
 },
});