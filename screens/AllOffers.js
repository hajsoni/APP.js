import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

export default function AllOffers({ navigation }) {
  const [allOffers, setAllOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchOffers = async () => {
        setLoading(true); // Ustawiamy loading na true przed pobraniem danych
        try {
          const response = await axios.get('http://10.0.2.2:3000/myOffers');
          setAllOffers(response.data);
        } catch (error) {
          console.error('Error fetching offers:', error);
        } finally {
          setLoading(false); // Wyłączamy loading po pobraniu danych
        }
      };

      fetchOffers();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1a531b" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={allOffers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OfferDetails', { offer: item })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>{item.price.toFixed(2)} PLN</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
});
