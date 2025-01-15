import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SecureStore from 'expo-secure-store';

// Importy ekranów
import Logowanie from './screens/logowanie';
import Home from './screens/Home';
import MyOffers from './screens/MyOffers';
import AddOffer from './screens/AddOffer';
import MyProfile from './screens/MyProfile';
import Bucket from './screens/Bucket';
import Register from './screens/Register';
import Search from './screens/Search';
import OfferDetails from './screens/OfferDetails';
import AllOffers from './screens/AllOffers';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
 return (
   <Tab.Navigator
     screenOptions={({ route }) => ({
       headerStyle: {
         backgroundColor: '#1E2337',
         elevation: 0,
         shadowOpacity: 0,
       },
       headerTintColor: '#fff',
       tabBarStyle: {
         backgroundColor: '#1E2337',
         borderTopWidth: 0,
         elevation: 0,
         shadowOpacity: 0,
         height: 60,
         paddingBottom: 10,
       },
       tabBarActiveTintColor: '#4CAF50',
       tabBarInactiveTintColor: '#666',
       tabBarIcon: ({ focused, color, size }) => {
         let iconName;

         switch (route.name) {
           case 'Home':
             iconName = focused ? 'home' : 'home-outline';
             break;
           case 'My Offers':
             iconName = focused ? 'pricetags' : 'pricetags-outline';
             break;
           case 'Add Offer':
             iconName = focused ? 'add-circle' : 'add-circle-outline';
             break;
           case 'Search':
             iconName = focused ? 'search' : 'search-outline';
             break;
           case 'All Offers':
             iconName = focused ? 'list' : 'list-outline';
             break;
           default:
             iconName = 'help-outline';
         }

         return <Ionicons name={iconName} size={size} color={color} />;
       },
     })}
   >
     <Tab.Screen name="Home" component={Home} />
     <Tab.Screen name="All Offers" component={AllOffers} />
     <Tab.Screen name="Add Offer" component={AddOffer} />
     <Tab.Screen name="Search" component={Search} />
     <Tab.Screen name="My Offers" component={MyOffers} />
     <Tab.Screen
       name="OfferDetails"
       component={OfferDetails}
       options={{
         tabBarButton: () => null,
         headerShown: true,
       }}
     />
   </Tab.Navigator>
 );
}

function DrawerNavigation() {
 return (
   <Drawer.Navigator
     screenOptions={{
       headerStyle: {
         backgroundColor: '#1E2337',
         elevation: 0,
         shadowOpacity: 0,
       },
       headerTintColor: '#fff',
       drawerStyle: {
         backgroundColor: '#1E2337',
         width: 280,
       },
       drawerActiveTintColor: '#4CAF50',
       drawerInactiveTintColor: '#fff',
       drawerLabelStyle: {
         marginLeft: -20,
       },
     }}
   >
     <Drawer.Screen
       name="Main"
       component={BottomTabs}
       options={{
         title: 'Home',
         drawerIcon: ({ color, size }) => (
           <Ionicons name="home-outline" size={size} color={color} />
         ),
       }}
     />
     <Drawer.Screen
       name="My Profile"
       component={MyProfile}
       options={{
         drawerIcon: ({ color, size }) => (
           <Ionicons name="person-outline" size={size} color={color} />
         ),
       }}
     />
     <Drawer.Screen
       name="Bucket"
       component={Bucket}
       options={{
         drawerIcon: ({ color, size }) => (
           <Ionicons name="cart-outline" size={size} color={color} />
         ),
       }}
     />
   </Drawer.Navigator>
 );
}

export default function App() {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
   const checkLogin = async () => {
     try {
       const email = await SecureStore.getItemAsync('userEmail');
       const password = await SecureStore.getItemAsync('userPassword');
       setIsLoggedIn(Boolean(email && password));
     } catch (error) {
       console.error('Error checking login status:', error);
     } finally {
       setIsLoading(false);
     }
   };

   checkLogin();
 }, []);

 if (isLoading) {
   return null;
 }

 return (
   <NavigationContainer>
     <Stack.Navigator
       screenOptions={{
         headerShown: false,
         cardStyle: { backgroundColor: '#1E2337' }
       }}
     >
       {!isLoggedIn ? (
         <>
           <Stack.Screen name="Logowanie">
             {(props) => <Logowanie {...props} setIsLoggedIn={setIsLoggedIn} />}
           </Stack.Screen>
           <Stack.Screen
             name="Register"
             component={Register}
             options={{
               headerShown: true,
               headerStyle: {
                 backgroundColor: '#1E2337',
               },
               headerTintColor: '#fff',
               title: 'Create Account'
             }}
           />
         </>
       ) : (
         <Stack.Screen name="Drawer" component={DrawerNavigation} />
       )}
     </Stack.Navigator>
   </NavigationContainer>
 );
}