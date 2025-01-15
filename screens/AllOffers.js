import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import offersData from '../data/offers.json';

const OfferCard = ({ offer, onPress, onAddToBucket }) => (
 <TouchableOpacity style={styles.offerCard} onPress={onPress}>
   <Image
     source={{ uri: offer.image || 'https://via.placeholder.com/200x200/1a1a1a/ffffff?text=No+Image' }}
     style={styles.offerImage}
   />
   <View style={styles.offerContent}>
     <View>
       <Text style={styles.offerName} numberOfLines={1}>{offer.name}</Text>
       <Text style={styles.offerDescription} numberOfLines={2}>{offer.description}</Text>
     </View>
     <View style={styles.bottomContainer}>
       <View style={styles.priceLocation}>
         <View style={styles.priceContainer}>
           <Text style={styles.offerPrice}>{offer.price.toFixed(2)} PLN</Text>
         </View>
         <Text style={styles.offerLocation}>📍 {offer.location}</Text>
       </View>
       <TouchableOpacity
         style={styles.addToBucketButton}
         onPress={() => onAddToBucket(offer)}
       >
         <Text style={styles.addToBucketText}>Add to Bucket</Text>
       </TouchableOpacity>
     </View>
   </View>
 </TouchableOpacity>
);

export default function AllOffers() {
 const navigation = useNavigation();

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

 const allOffers = [...offersData.specialOffers, ...offersData.saleOffers, ...offersData.myOffers];
 const sortedOffers = allOffers.sort((a, b) => new Date(b.date) - new Date(a.date));

 return (
   <View style={styles.container}>
     <FlatList
       data={sortedOffers}
       renderItem={({ item }) => (
         <OfferCard
           offer={item}
           onPress={() => navigation.navigate('OfferDetails', { offer: item })}
           onAddToBucket={addToBucket}
         />
       )}
       keyExtractor={item => item.id}
       contentContainerStyle={styles.listContent}
       ListEmptyComponent={
         <View style={styles.emptyContainer}>
           <Text style={styles.noOffers}>No offers available</Text>
         </View>
       }
     />
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#1E2337',
 },
 listContent: {
   padding: 15,
 },
 offerCard: {
   backgroundColor: '#2A305A',
   borderRadius: 15,
   marginBottom: 15,
   overflow: 'hidden',
   flexDirection: 'row',
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
   elevation: 5,
 },
 offerImage: {
   width: 120,
   height: 140,
 },
 offerContent: {
   flex: 1,
   padding: 12,
   justifyContent: 'space-between',
 },
 offerName: {
   color: '#fff',
   fontSize: 18,
   fontWeight: 'bold',
   marginBottom: 4,
 },
 offerDescription: {
   color: '#B8B9C3',
   fontSize: 14,
 },
 bottomContainer: {
   marginTop: 8,
 },
 priceLocation: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   marginBottom: 8,
 },
 priceContainer: {
   backgroundColor: '#4CAF50',
   paddingHorizontal: 12,
   paddingVertical: 4,
   borderRadius: 20,
 },
 offerPrice: {
   color: '#fff',
   fontSize: 16,
   fontWeight: 'bold',
 },
 offerLocation: {
   color: '#B8B9C3',
   fontSize: 12,
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
 emptyContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   padding: 40,
 },
 noOffers: {
   color: '#B8B9C3',
   fontSize: 16,
   textAlign: 'center',
 },
});