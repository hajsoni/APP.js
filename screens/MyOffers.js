import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function MyOffers() {
  const [myOffers, setMyOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOffers = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:3000/myOffers');
        setMyOffers(response.data);
      } catch (error) {
        console.error('Error fetching my offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOffers();
  }, []);

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
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>{item.price.toFixed(2)} PLN</Text>
          </View>
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
