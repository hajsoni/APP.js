import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MyOffers() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Offers</Text>
      {/* Lista Twoich ofert */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
