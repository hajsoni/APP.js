import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Modal } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const EditOfferModal = ({ visible, offer, onClose, onSave }) => {
  const [editedOffer, setEditedOffer] = useState(offer);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await onSave(editedOffer);
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Offer</Text>
          
          <TextInput
            style={styles.input}
            value={editedOffer.name}
            onChangeText={(text) => setEditedOffer({...editedOffer, name: text})}
            placeholder="Name"
            placeholderTextColor="#777"
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            value={editedOffer.description}
            onChangeText={(text) => setEditedOffer({...editedOffer, description: text})}
            placeholder="Description"
            placeholderTextColor="#777"
            multiline
            numberOfLines={3}
          />
          
          <TextInput
            style={styles.input}
            value={editedOffer.price.toString()}
            onChangeText={(text) => setEditedOffer({...editedOffer, price: parseFloat(text) || 0})}
            placeholder="Price"
            placeholderTextColor="#777"
            keyboardType="numeric"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]} 
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function MyOffers() {
  const [myOffers, setMyOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const fetchMyOffers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://10.0.2.2:3000/myOffers');
      setMyOffers(response.data);
    } catch (error) {
      console.error('Error fetching my offers:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMyOffers();
    }, [])
  );

  const handleEditOffer = (offer) => {
    setSelectedOffer(offer);
    setIsEditModalVisible(true);
  };

  const updateOffer = async (updatedOffer) => {
    try {
      // Wywołanie PUT do API
      await axios.put(`http://10.0.2.2:3000/myOffers/${updatedOffer.id}`, updatedOffer);
      
      // Aktualizacja lokalnego stanu
      const updatedOffers = myOffers.map(offer => 
        offer.id === updatedOffer.id ? updatedOffer : offer
      );
      setMyOffers(updatedOffers);
      
      // Zamknięcie modalu
      setIsEditModalVisible(false);
      setSelectedOffer(null);
    } catch (error) {
      console.error('Error updating offer:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1a531b" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Offers</Text>
      <FlatList
        data={myOffers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.name}</Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => handleEditOffer(item)}
              >
                <Ionicons name="pencil" size={20} color="#1a531b" />
              </TouchableOpacity>
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>{item.price.toFixed(2)} PLN</Text>
          </View>
        )}
      />

      {selectedOffer && (
        <EditOfferModal
          visible={isEditModalVisible}
          offer={selectedOffer}
          onClose={() => {
            setIsEditModalVisible(false);
            setSelectedOffer(null);
          }}
          onSave={updateOffer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  description: {
    color: '#ccc',
    marginTop: 5,
  },
  price: {
    color: '#1a531b',
    marginTop: 10,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#000',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  saveButton: {
    backgroundColor: '#1a531b',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});