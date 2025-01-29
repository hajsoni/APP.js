import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const OfferCard = ({ offer, onPress, onAddToBucket }) => {
  // Funkcja do obsługi różnych typów URL zdjęć
  const getImageSource = (imageUrl) => {
    if (!imageUrl || imageUrl.includes('placeholder.com')) {
      return 'https://via.placeholder.com/200x200/1a1a1a/ffffff?text=No+Image';
    } else if (imageUrl.startsWith('file:///')) {
      return imageUrl;
    } else {
      return imageUrl;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.offerCard} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getImageSource(offer.image) }}
          style={styles.offerImage}
          resizeMode="cover"
        />
        <View style={styles.offerOverlay}>
          <Text style={styles.offerLocation}>📍 {offer.location}</Text>
        </View>
        
        {/* Znaczniki dla ofert specjalnych i promocji */}
        {offer.isSpecial && (
          <View style={styles.specialBadge}>
            <Text style={styles.specialBadgeText}>Special</Text>
          </View>
        )}
        {offer.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>-{offer.discount}%</Text>
          </View>
        )}
      </View>

      <View style={styles.offerInfo}>
        <Text style={styles.offerName} numberOfLines={1}>{offer.name}</Text>
        <Text style={styles.offerDescription} numberOfLines={2}>{offer.description}</Text>
        
        <View style={styles.priceContainer}>
          {offer.discount ? (
            <>
              <Text style={styles.originalPrice}>
                {offer.price.toFixed(2)} PLN
              </Text>
              <Text style={styles.offerPrice}>
                {(offer.price - (offer.price * offer.discount / 100)).toFixed(2)} PLN
              </Text>
            </>
          ) : (
            <Text style={styles.offerPrice}>{offer.price.toFixed(2)} PLN</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.addToBucketButton}
          onPress={(e) => {
            e.stopPropagation();
            onAddToBucket(offer);
          }}
        >
          <Text style={styles.addToBucketText}>Add to Bucket</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function Home() {
  const navigation = useNavigation();
  const [specialOffers, setSpecialOffers] = useState([]);
  const [saleOffers, setSaleOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOffers = async () => {
    try {
      const [specialResponse, saleResponse] = await Promise.all([
        axios.get('http://10.0.2.2:3000/specialOffers'),
        axios.get('http://10.0.2.2:3000/saleOffers')
      ]);

      setSpecialOffers(specialResponse.data || []);
      setSaleOffers(saleResponse.data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
      Alert.alert('Error', 'Failed to load offers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchOffers();
  }, []);

  const addToBucket = async (offer) => {
    try {
      const currentItems = await SecureStore.getItemAsync('bucketItems');
      let bucketItems = currentItems ? JSON.parse(currentItems) : [];

      if (!bucketItems.some(item => item.id === offer.id)) {
        bucketItems.push(offer);
        await SecureStore.setItemAsync('bucketItems', JSON.stringify(bucketItems));
        Alert.alert('Success', 'Item added to bucket');
      } else {
        Alert.alert('Info', 'This item is already in your bucket');
      }
    } catch (error) {
      console.error('Error adding to bucket:', error);
      Alert.alert('Error', 'Could not add item to bucket');
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('Search')}
            activeOpacity={0.7}
          >
            <Text style={styles.searchButtonText}>🔍 Search products...</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <Text style={styles.sectionSubtitle}>Limited time deals</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sectionContent}
          >
            {specialOffers.length > 0 ? (
              specialOffers.map(offer => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onPress={() => navigation.navigate('OfferDetails', { offer })}
                  onAddToBucket={addToBucket}
                />
              ))
            ) : (
              <View style={styles.noOffersContainer}>
                <Text style={styles.noOffers}>No special offers available</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>On Sale</Text>
          <Text style={styles.sectionSubtitle}>Best deals for you</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sectionContent}
          >
            {saleOffers.length > 0 ? (
              saleOffers.map(offer => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onPress={() => navigation.navigate('OfferDetails', { offer })}
                  onAddToBucket={addToBucket}
                />
              ))
            ) : (
              <View style={styles.noOffersContainer}>
                <Text style={styles.noOffers}>No sales available</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2337',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1E2337',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    padding: 15,
  },
  header: {
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 15,
    alignSelf: 'center',
  },
  searchButton: {
    backgroundColor: '#2A305A',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchButtonText: {
    color: '#666',
    fontSize: 16,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionSubtitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 15,
  },
  sectionContent: {
    paddingVertical: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  offerCard: {
    width: 220,
    backgroundColor: '#2A305A',
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  offerImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#1a1a1a',
  },
  offerOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  specialBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  specialBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    top: 45,
    right: 10,
    backgroundColor: '#FF4444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  discountBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  offerInfo: {
    padding: 15,
  },
  offerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  offerDescription: {
    color: '#999',
    fontSize: 14,
    marginBottom: 10,
  },
  priceContainer: {
    marginBottom: 10,
  },
  originalPrice: {
    color: '#999',
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  offerPrice: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  offerLocation: {
    color: '#fff',
    fontSize: 12,
  },
  noOffersContainer: {
    width: 220,
    height: 180,
    backgroundColor: '#2A305A',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOffers: {
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  addToBucketButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 15,
    alignItems: 'center',
  },
  addToBucketText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});