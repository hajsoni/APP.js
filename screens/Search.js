import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import offersData from '../data/offers.json';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Łączymy wszystkie oferty w jedną tablicę
  const allOffers = [
    ...offersData.specialOffers,
    ...offersData.saleOffers,
    ...offersData.myOffers
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    setHasSearched(true);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filteredResults = allOffers.filter(offer => {
      const searchLower = query.toLowerCase();
      return (
        offer.name.toLowerCase().includes(searchLower) ||
        offer.description.toLowerCase().includes(searchLower) ||
        offer.location.toLowerCase().includes(searchLower) ||
        offer.price.toString().includes(searchLower)
      );
    });

    setSearchResults(filteredResults);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.offerCard}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/200x200/1a1a1a/ffffff?text=No+Image' }}
        style={styles.offerImage}
      />
      <View style={styles.offerInfo}>
        <Text style={styles.offerName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.offerDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.offerDetails}>
          <Text style={styles.offerPrice}>{item.price.toFixed(2)} PLN</Text>
          <Text style={styles.offerLocation}>📍 {item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, locations..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus={true}
        />
      </View>

      {hasSearched && searchQuery.trim() !== '' && searchResults.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No results found for "{searchQuery}"</Text>
          <Text style={styles.noResultsSubText}>Try different keywords or check for typos</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.resultsList}
          ListEmptyComponent={
            !hasSearched && (
              <View style={styles.initialStateContainer}>
                <Text style={styles.initialStateText}>Start typing to search</Text>
              </View>
            )
          }
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
  searchContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2A305A',
  },
  searchInput: {
    backgroundColor: '#2A305A',
    color: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
  },
  resultsList: {
    padding: 15,
  },
  offerCard: {
    flexDirection: 'row',
    backgroundColor: '#2A305A',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  offerImage: {
    width: 100,
    height: 100,
  },
  offerInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  offerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  offerDescription: {
    color: '#B8B9C3',
    fontSize: 14,
    marginTop: 4,
  },
  offerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  offerPrice: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  offerLocation: {
    color: '#B8B9C3',
    fontSize: 12,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noResultsSubText: {
    color: '#B8B9C3',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  initialStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  initialStateText: {
    color: '#B8B9C3',
    fontSize: 16,
    textAlign: 'center',
  },
});