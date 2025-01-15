import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import offersData from '../data/offers.json';

const MyOfferCard = ({ offer }) => (
  <TouchableOpacity style={styles.offerCard}>
    <Image
      source={{ uri: offer.image || 'https://via.placeholder.com/200x200/1a1a1a/ffffff?text=No+Image' }}
      style={styles.offerImage}
    />
    <View style={styles.offerInfo}>
      <Text style={styles.offerName}>{offer.name}</Text>
      <Text style={styles.offerPrice}>{offer.price.toFixed(2)} PLN</Text>
      <View style={styles.offerStats}>
        <Text style={styles.offerViews}>👁 {offer.views}</Text>
        <Text style={[styles.offerStatus,
          { color: offer.status === 'active' ? '#1a531b' : '#777' }]}>
          {offer.status}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function MyOffers() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Offers</Text>
      <ScrollView style={styles.scrollView}>
        {offersData.myOffers.length > 0 ? (
          offersData.myOffers.map(offer => (
            <MyOfferCard key={offer.id} offer={offer} />
          ))
        ) : (
          <Text style={styles.noOffers}>No offers available</Text>
        )}
      </ScrollView>
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
    paddingHorizontal: 10,
  },
  scrollView: {
    flex: 1,
  },
  offerCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  offerImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  offerInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  offerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  offerPrice: {
    color: '#1a531b',
    fontSize: 14,
    fontWeight: 'bold',
  },
  offerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  offerViews: {
    color: '#777',
    fontSize: 12,
  },
  offerStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  noOffers: {
    color: '#777',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});