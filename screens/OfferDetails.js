import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function OfferDetails({ route, navigation }) {
  const { offer } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: offer.image || 'https://via.placeholder.com/200x200/1a1a1a/ffffff?text=No+Image' }}
        style={styles.image}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.name}>{offer.name}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{offer.price.toFixed(2)} PLN</Text>
          {offer.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{offer.discount}%</Text>
            </View>
          )}
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color="#B8B9C3" />
          <Text style={styles.location}>{offer.location}</Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{offer.description}</Text>

        <View style={styles.sellerInfo}>
          <Text style={styles.sectionTitle}>Seller</Text>
          <Text style={styles.sellerName}>{offer.seller}</Text>
          <Text style={styles.date}>Posted on: {offer.date}</Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add to Bucket</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2337',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  discountBadge: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    color: '#B8B9C3',
    marginLeft: 5,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    marginTop: 20,
  },
  description: {
    color: '#B8B9C3',
    fontSize: 16,
    lineHeight: 24,
  },
  sellerInfo: {
    marginVertical: 20,
  },
  sellerName: {
    color: '#fff',
    fontSize: 16,
  },
  date: {
    color: '#B8B9C3',
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});