import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Import ikon
import Logowanie from './screens/logowanie';
import Home from './screens/Home';
import MyOffers from './screens/MyOffers';
import AddOffer from './screens/AddOffer';
import MyProfile from './screens/MyProfile';
import Bucket from './screens/Bucket';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#000' },
        tabBarActiveTintColor: '#00ff00',
        tabBarInactiveTintColor: '#fff',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'My Offers') {
            iconName = focused ? 'pricetags' : 'pricetags-outline';
          } else if (route.name === 'Add Offer') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="My Offers" component={MyOffers} />
      <Tab.Screen name="Add Offer" component={AddOffer} />
    </Tab.Navigator>
  );
}

function DrawerNavigation() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#000' },
        drawerActiveTintColor: '#00ff00',
        drawerInactiveTintColor: '#fff',
      }}
    >
      <Drawer.Screen name="Main" component={BottomTabs} />
      <Drawer.Screen name="My Profile" component={MyProfile} />
      <Drawer.Screen name="Bucket" component={Bucket} />
    </Drawer.Navigator>
  );
}


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Logowanie">
            {(props) => <Logowanie {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Drawer" component={DrawerNavigation} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
