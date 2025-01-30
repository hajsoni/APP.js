import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
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
      Alert.alert('Error', 'Failed to fetch offers');
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
      await axios.put(`http://10.0.2.2:3000/myOffers/${updatedOffer.id}`, updatedOffer);
      const updatedOffers = myOffers.map(offer => 
        offer.id === updatedOffer.id ? updatedOffer : offer
      );
      setMyOffers(updatedOffers);
      setIsEditModalVisible(false);
      setSelectedOffer(null);
      Alert.alert('Success', 'Offer updated successfully');
    } catch (error) {
      console.error('Error updating offer:', error);
      Alert.alert('Error', 'Failed to update the offer');
    }
  };

  const handleDeleteOffer = (offerId) => {
    Alert.alert(
      'Delete Offer',
      'Are you sure you want to delete this offer?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`http://10.0.2.2:3000/myOffers/${offerId}`);
              const updatedOffers = myOffers.filter(offer => offer.id !== offerId);
              setMyOffers(updatedOffers);
              Alert.alert('Success', 'Offer deleted successfully');
            } catch (error) {
              console.error('Error deleting offer:', error);
              Alert.alert('Error', 'Failed to delete the offer');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Offers</Text>
      </View>
      
      <FlatList
        data={myOffers}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardMain}>
              <View style={styles.cardContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.price}>{item.price.toFixed(2)} PLN</Text>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.iconButton, styles.editButton]}
                  onPress={() => handleEditOffer(item)}
                >
                  <Ionicons name="pencil" size={20} color="#fff" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.iconButton, styles.deleteButton]}
                  onPress={() => handleDeleteOffer(item.id)}
                >
                  <Ionicons name="trash" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
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
    backgroundColor: '#1E2337',
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#1E2337',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#2A305A',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardMain: {
    flexDirection: 'row',
    padding: 15,
  },
  cardContent: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#B8B9C3',
    fontSize: 14,
    marginBottom: 8,
  },
  price: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#1a531b',
  },
  deleteButton: {
    backgroundColor: '#8B0000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2A305A',
    borderRadius: 12,
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
    backgroundColor: '#1E2337',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#4A4D6A',
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
    borderRadius: 8,
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