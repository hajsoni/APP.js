import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Bucket() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.icon}>🛒</Text>
      <View style={styles.auctionList}>
        <Text style={styles.placeholder}>No items in your bucket</Text>
      </View>
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  icon: {
    fontSize: 40,
    color: '#fff',
    marginBottom: 20,
  },
  auctionList: {
    flex: 1,
    width: '90%',
    marginTop: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 10,
  },
  placeholder: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
