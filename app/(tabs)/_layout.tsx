import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons'; 

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2A2A2A', // Fundo escuro
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#EBECE2', 
        tabBarInactiveTintColor: '#B0B0B0', 
        tabBarShowLabel: false, 
      }}>
      
      {/* 1. Aba Início */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
          ),
        }}
      />

      {/* 2. Aba Explorar (ou Notas) */}
      <Tabs.Screen
        name="explore" 
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "compass" : "compass-outline"} size={28} color={color} />
          ),
        }}
      />

      {/* 3. Aba Pastas (A que estava faltando) */}
      <Tabs.Screen
        name="folders"
        options={{
          title: 'Pastas',
          tabBarIcon: ({ color }) => (
            <Feather name="folder" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}