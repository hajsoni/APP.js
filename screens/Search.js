import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import offersData from '../data/offers.json';

export default function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState(''); // Dodano pole do filtrowania nazw

  const allOffers = [
    ...offersData.specialOffers,
    ...offersData.saleOffers,
    ...offersData.myOffers,
  ];

  const handleSearch = () => {
    setHasSearched(true);

    const filteredResults = allOffers.filter(offer => {
      const matchesName = name.trim() === '' || offer.name.toLowerCase().includes(name.toLowerCase());
      const matchesPrice =
        (!priceFrom || offer.price >= parseFloat(priceFrom)) &&
        (!priceTo || offer.price <= parseFloat(priceTo));
      const matchesLocation = location.trim() === '' || offer.location.toLowerCase().includes(location.toLowerCase());
      const matchesCategory = category.trim() === '' || offer.category?.toLowerCase().includes(category.toLowerCase());

      return matchesName && matchesPrice && matchesLocation && matchesCategory;
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
      <View style={styles.filters}>
        <Text style={styles.filterLabel}>Name</Text>
        <TextInput
          style={styles.filterInput}
          placeholder="Enter name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.filterLabel}>Price</Text>
        <View style={styles.priceContainer}>
          <TextInput
            style={styles.priceInput}
            placeholder="From"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={priceFrom}
            onChangeText={setPriceFrom}
          />
          <TextInput
            style={styles.priceInput}
            placeholder="To"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={priceTo}
            onChangeText={setPriceTo}
          />
        </View>
        <Text style={styles.filterLabel}>Location</Text>
        <TextInput
          style={styles.filterInput}
          placeholder="Enter location"
          placeholderTextColor="#666"
          value={location}
          onChangeText={setLocation}
        />
        <Text style={styles.filterLabel}>Category</Text>
        <TextInput
          style={styles.filterInput}
          placeholder="Enter category"
          placeholderTextColor="#666"
          value={category}
          onChangeText={setCategory}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>SEARCH</Text>
        </TouchableOpacity>
      </View>

      {hasSearched && searchResults.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No results found</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.resultsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2337',
    padding: 15,
  },
  filters: {
    marginBottom: 20,
  },
  filterLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceInput: {
    backgroundColor: '#2A305A',
    color: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '48%',
  },
  filterInput: {
    backgroundColor: '#2A305A',
    color: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  },
  noResultsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
