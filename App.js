import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Logowanie from './screens/logowanie';
import Home from './screens/Home';
import MyOffers from './screens/MyOffers';
import AddOffer from './screens/AddOffer';
import MyProfile from './screens/MyProfile';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="My Offers" component={MyOffers} />
      <Tab.Screen name="Add Offer" component={AddOffer} />
    </Tab.Navigator>
  );
}

function DrawerNavigation() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Main" component={BottomTabs} />
      <Drawer.Screen name="My Profile" component={MyProfile} />
      <Drawer.Screen name="My Offers" component={MyOffers} />
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
