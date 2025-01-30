import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import offersData from '../data/offers.json';

export default function Search() {
  const navigation = useNavigation();
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');

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

  const handleClear = () => {
    setName('');
    setPriceFrom('');
    setPriceTo('');
    setLocation('');
    setCategory('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.offerCard}
      onPress={() => navigation.navigate('OfferDetails', { offer: item })}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/200x200/1a1a1a/ffffff?text=No+Image' }}
        style={styles.offerImage}
      />
      <View style={styles.offerInfo}>
        <Text style={styles.offerName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.offerDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.offerDetails}>
          <Text style={styles.offerPrice}>{item.price.toFixed(2)} PLN</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#B8B9C3" />
            <Text style={styles.offerLocation}>{item.location}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <View style={styles.inputGroup}>
          <Text style={styles.filterLabel}>Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.filterInput}
              placeholder="Enter name"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.filterLabel}>Price Range</Text>
          <View style={styles.priceContainer}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Ionicons name="cash-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.priceInput}
                placeholder="From"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={priceFrom}
                onChangeText={setPriceFrom}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
              <Ionicons name="cash-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.priceInput}
                placeholder="To"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={priceTo}
                onChangeText={setPriceTo}
              />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.filterLabel}>Location</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.filterInput}
              placeholder="Enter location"
              placeholderTextColor="#666"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.filterLabel}>Category</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="list-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.filterInput}
              placeholder="Enter category"
              placeholderTextColor="#666"
              value={category}
              onChangeText={setCategory}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Ionicons name="close-circle-outline" size={20} color="#fff" />
            <Text style={styles.clearButtonText}>CLEAR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#fff" />
            <Text style={styles.searchButtonText}>SEARCH</Text>
          </TouchableOpacity>
        </View>
      </View>

      {hasSearched && searchResults.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={50} color="#666" />
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
  inputGroup: {
    marginBottom: 15,
  },
  filterLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A305A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3D4266',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  filterInput: {
    flex: 1,
    color: '#fff',
    padding: 12,
    fontSize: 16,
  },
  priceContainer: {
    flexDirection: 'row',
  },
  priceInput: {
    flex: 1,
    color: '#fff',
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  searchButton: {
    flex: 1,
    backgroundColor: '#1a531b',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#3D4266',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsList: {
    padding: 5,
  },
  offerCard: {
    flexDirection: 'row',
    backgroundColor: '#2A305A',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  offerImage: {
    width: 120,
    height: 120,
  },
  offerInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  offerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  offerDescription: {
    color: '#B8B9C3',
    fontSize: 14,
  },
  offerDetails: {
    marginTop: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  offerPrice: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  offerLocation: {
    color: '#B8B9C3',
    fontSize: 14,
    marginLeft: 4,
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
    marginTop: 10,
  },
});