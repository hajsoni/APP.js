import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#fff"
          />
        </View>

        <Text style={styles.sectionTitle}>Special</Text>
        <View style={styles.section}>
          <Text style={styles.noOffers}>No offers available</Text>
        </View>

        <Text style={styles.sectionTitle}>Sale</Text>
        <View style={styles.section}>
          <Text style={styles.noOffers}>No offers available</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingBottom: 5,
  },
  section: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    alignItems: 'center',
  },
  noOffers: {
    color: '#fff',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
