import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';

export default function AllOffers({ navigation }) {
  const [allOffers, setAllOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchOffers = async () => {
        setLoading(true);
        try {
          const response = await axios.get('http://10.0.2.2:3000/myOffers');
          setAllOffers(response.data);
        } catch (error) {
          console.error('Error fetching offers:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchOffers();
    }, [])
  );

  const getSortedOffers = () => {
    if (sortOption === 'price_asc') {
      return [...allOffers].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price_desc') {
      return [...allOffers].sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name_asc') {
      return [...allOffers].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name_desc') {
      return [...allOffers].sort((a, b) => b.name.localeCompare(a.name));
    }
    return allOffers;
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
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.pickerWrapper}>
          <RNPickerSelect
            onValueChange={(value) => setSortOption(value)}
            items={[
              { label: 'Name A-Z', value: 'name_asc' },
              { label: 'Name Z-A', value: 'name_desc' },
              { label: 'Price Low to High', value: 'price_asc' },
              { label: 'Price High to Low', value: 'price_desc' },
            ]}
            style={pickerSelectStyles}
            placeholder={{ label: 'Select...', value: null }}
            useNativeAndroidPickerStyle={false}
            Icon={() => (
              <Ionicons name="chevron-down" size={24} color="#B8B9C3" />
            )}
          />
        </View>
      </View>

      <FlatList
        data={getSortedOffers()}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OfferDetails', { offer: item })}
          >
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{item.price.toFixed(2)} PLN</Text>
                <Ionicons name="chevron-forward" size={20} color="#B8B9C3" />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2337',
  },
  listContainer: {
    padding: 15,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A305A',
    padding: 15,
    marginBottom: 5,
    elevation: 3,
  },
  sortLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: '#1E2337',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A4D6A',
  },
  card: {
    backgroundColor: '#2A305A',
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    padding: 16,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    color: '#B8B9C3',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  price: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
  },
  iconContainer: {
    top: 12,
    right: 12,
  },
};