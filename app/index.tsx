// app/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import AccountScreen from "./screens/AccountScreen";
import ActivityScreen from "./screens/ActivityScreen";
import HomeScreen from "./screens/HomeScreen";
import WalletScreen from "./screens/WalletScreen";
import { Colors } from "./theme";

const Tab = createBottomTabNavigator();

export default function AppNavigation() {
  return (
   
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName: keyof typeof Ionicons.glyphMap =
              route.name === 'Home' ? 'home-outline' :
              route.name === 'Portefeuille' ? 'wallet-outline' :
              route.name === 'Activité' ? 'stats-chart-outline' :
              'person-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: "gray",
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Portefeuille" component={WalletScreen} />
        <Tab.Screen name="Activité" component={ActivityScreen} />
        <Tab.Screen name="Compte" component={AccountScreen} />
      </Tab.Navigator>
  
  );
}
