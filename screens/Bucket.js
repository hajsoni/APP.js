import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

const BucketItem = ({ item, onRemove }) => (
 <View style={styles.bucketItem}>
   <Image
     source={{ uri: item.image || 'https://via.placeholder.com/200x200/1a1a1a/ffffff?text=No+Image' }}
     style={styles.itemImage}
   />
   <View style={styles.itemInfo}>
     <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
     <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
     <View style={styles.bottomInfo}>
       <Text style={styles.itemPrice}>{item.price.toFixed(2)} PLN</Text>
       <Text style={styles.itemLocation}>📍 {item.location}</Text>
     </View>
   </View>
   <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeButton}>
     <Text style={styles.removeButtonText}>×</Text>
   </TouchableOpacity>
 </View>
);

export default function Bucket() {
 const [bucketItems, setBucketItems] = useState([]);

 useFocusEffect(
   React.useCallback(() => {
     const loadBucketItems = async () => {
       try {
         const items = await SecureStore.getItemAsync('bucketItems');
         if (items) {
           setBucketItems(JSON.parse(items));
         }
       } catch (error) {
         console.error('Error loading bucket items:', error);
       }
     };

     loadBucketItems();
   }, [])
 );

 const removeFromBucket = async (itemId) => {
   try {
     const updatedItems = bucketItems.filter(item => item.id !== itemId);
     await SecureStore.setItemAsync('bucketItems', JSON.stringify(updatedItems));
     setBucketItems(updatedItems);
   } catch (error) {
     console.error('Error removing item from bucket:', error);
   }
 };

 const totalPrice = bucketItems.reduce((sum, item) => sum + item.price, 0);

 return (
   <View style={styles.container}>
     <View style={styles.header}>
       <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
       <Text style={styles.headerTitle}>Your Bucket</Text>
     </View>

     {bucketItems.length > 0 ? (
       <View style={styles.content}>
         <FlatList
           data={bucketItems}
           renderItem={({ item }) => (
             <BucketItem item={item} onRemove={removeFromBucket} />
           )}
           keyExtractor={item => item.id}
           showsVerticalScrollIndicator={false}
           ListFooterComponent={
             <View style={styles.totalContainer}>
               <Text style={styles.totalText}>Total Price:</Text>
               <Text style={styles.totalPrice}>{totalPrice.toFixed(2)} PLN</Text>
             </View>
           }
         />
       </View>
     ) : (
       <View style={styles.emptyContainer}>
         <Text style={styles.emptyIcon}>🛒</Text>
         <Text style={styles.emptyText}>Your bucket is empty</Text>
         <Text style={styles.emptySubText}>Add some items to get started</Text>
       </View>
     )}
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#1E2337',
 },
 header: {
   padding: 20,
   alignItems: 'center',
   borderBottomWidth: 1,
   borderBottomColor: '#2A305A',
 },
 logo: {
   width: 80,
   height: 80,
   marginBottom: 10,
 },
 headerTitle: {
   color: '#fff',
   fontSize: 24,
   fontWeight: 'bold',
 },
 content: {
   flex: 1,
   padding: 15,
 },
 bucketItem: {
   flexDirection: 'row',
   backgroundColor: '#2A305A',
   borderRadius: 15,
   padding: 12,
   marginBottom: 15,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
   elevation: 5,
 },
 itemImage: {
   width: 100,
   height: 100,
   borderRadius: 10,
 },
 itemInfo: {
   flex: 1,
   marginLeft: 12,
   justifyContent: 'space-between',
 },
 itemName: {
   color: '#fff',
   fontSize: 18,
   fontWeight: 'bold',
   marginBottom: 4,
 },
 itemDescription: {
   color: '#B8B9C3',
   fontSize: 14,
   marginBottom: 8,
 },
 bottomInfo: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
 },
 itemPrice: {
   color: '#4CAF50',
   fontSize: 16,
   fontWeight: 'bold',
 },
 itemLocation: {
   color: '#B8B9C3',
   fontSize: 12,
 },
 removeButton: {
   justifyContent: 'center',
   alignItems: 'center',
   width: 30,
   height: 30,
   borderRadius: 15,
   backgroundColor: '#FF4444',
   marginLeft: 10,
 },
 removeButtonText: {
   color: '#fff',
   fontSize: 20,
   fontWeight: 'bold',
 },
 totalContainer: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   backgroundColor: '#2A305A',
   padding: 20,
   borderRadius: 15,
   marginTop: 20,
 },
 totalText: {
   color: '#fff',
   fontSize: 18,
   fontWeight: 'bold',
 },
 totalPrice: {
   color: '#4CAF50',
   fontSize: 24,
   fontWeight: 'bold',
 },
 emptyContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   padding: 20,
 },
 emptyIcon: {
   fontSize: 50,
   marginBottom: 20,
 },
 emptyText: {
   color: '#fff',
   fontSize: 24,
   fontWeight: 'bold',
   marginBottom: 10,
 },
 emptySubText: {
   color: '#B8B9C3',
   fontSize: 16,
 },
});