import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import offersData from '../data/offers.json';

const OfferCard = ({ offer, onPress, onAddToBucket }) => (
 <TouchableOpacity style={styles.offerCard} onPress={onPress}>
   <Image
     source={{ uri: offer.image || 'https://via.placeholder.com/200x200/1a1a1a/ffffff?text=No+Image' }}
     style={styles.offerImage}
   />
   <View style={styles.offerOverlay}>
     <Text style={styles.offerLocation}>📍 {offer.location}</Text>
   </View>
   <View style={styles.offerInfo}>
     <Text style={styles.offerName} numberOfLines={1}>{offer.name}</Text>
     <Text style={styles.offerDescription} numberOfLines={2}>{offer.description}</Text>
     <View style={styles.priceContainer}>
       <Text style={styles.offerPrice}>{offer.price.toFixed(2)} PLN</Text>
     </View>
     <TouchableOpacity
       style={styles.addToBucketButton}
       onPress={() => onAddToBucket(offer)}
     >
       <Text style={styles.addToBucketText}>Add to Bucket</Text>
     </TouchableOpacity>
   </View>
 </TouchableOpacity>
);

export default function Home() {
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

 return (
   <View style={styles.container}>
     <ScrollView contentContainerStyle={styles.scrollViewContent}>
       <View style={styles.header}>
         <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
         <TouchableOpacity
           style={styles.searchButton}
           onPress={() => navigation.navigate('Search')}
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
           {offersData.specialOffers.length > 0 ? (
             offersData.specialOffers.map(offer => (
               <OfferCard
                 key={offer.id}
                 offer={offer}
                 onPress={() => navigation.navigate('OfferDetails', { offer })}
                 onAddToBucket={addToBucket}
               />
             ))
           ) : (
             <Text style={styles.noOffers}>No special offers available</Text>
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
           {offersData.saleOffers.length > 0 ? (
             offersData.saleOffers.map(offer => (
               <OfferCard
                 key={offer.id}
                 offer={offer}
                 onPress={() => navigation.navigate('OfferDetails', { offer })}
                 onAddToBucket={addToBucket}
               />
             ))
           ) : (
             <Text style={styles.noOffers}>No sales available</Text>
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
   backgroundColor: '#4CAF50',
   alignSelf: 'flex-start',
   paddingHorizontal: 15,
   paddingVertical: 5,
   borderRadius: 20,
   marginBottom: 10,
 },
 offerPrice: {
   color: '#fff',
   fontSize: 16,
   fontWeight: 'bold',
 },
 offerLocation: {
   color: '#fff',
   fontSize: 12,
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