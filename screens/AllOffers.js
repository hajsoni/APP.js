import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

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
        <ActivityIndicator size="large" color="#1a531b" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sortuj według:</Text>
        <View style={styles.pickerWrapper}>
          <RNPickerSelect
            onValueChange={(value) => setSortOption(value)}
            items={[
              { label: 'Nazwa A-Z', value: 'name_asc' },
              { label: 'Nazwa Z-A', value: 'name_desc' },
              { label: 'Cena rosnąco', value: 'price_asc' },
              { label: 'Cena malejąco', value: 'price_desc' },
            ]}
            style={pickerSelectStyles}
            placeholder={{ label: 'Wybierz...', value: null }}
            useNativeAndroidPickerStyle={false}
          />
        </View>
      </View>

      <FlatList
        data={getSortedOffers()}
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
  sortContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  sortLabel: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10, 
  },
  pickerWrapper: {
    flex: 1, 
    backgroundColor: '#333',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
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

const pickerSelectStyles = {
  inputIOS: {
    color: '#fff',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  inputAndroid: {
    color: '#fff',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
};

