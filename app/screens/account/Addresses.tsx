import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../../theme';
import { Fonts } from '../../font';
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Address = {
  id: number;
  label: string; // Domicile, Travail
  full_address: string;
  type?: string | null;
  is_favorite?: boolean;
};

export default function Addresses() {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        if (!API_URL) {
          setError('API_URL non configurée');
          setLoading(false);
          return;
        }

        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          setError('Utilisateur non connecté');
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/passenger/addresses`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const json = await res.json().catch(() => null);
          const msg = (json && (json.message || json.error)) || 'Impossible de charger les adresses.';
          setError(msg);
          setLoading(false);
          return;
        }

        const json = await res.json();
        setAddresses(Array.isArray(json) ? json : []);
      } catch (e: any) {
        setError(e?.message || 'Erreur réseau lors du chargement des adresses');
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, [API_URL]);

  const renderItem = ({ item }: { item: Address }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('screens/account/AddressForm' as never, {
          id: item.id,
          label: item.label,
          full_address: item.full_address,
        } as never)
      }
      style={styles.card}
      activeOpacity={0.7}
    >
      <Text style={styles.cardLabel}>{item.label}</Text>
      <Text style={styles.cardAddress}>{item.full_address}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate('screens/account/AddressForm' as never)}
            >
              <Text style={styles.addBtnText}>Ajouter une adresse</Text>
            </TouchableOpacity>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {error ? error : "Aucune adresse enregistrée pour l'instant."}
              </Text>
            </View>
          }
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listContent: { padding: 16 },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  addBtnText: { color: Colors.white, fontFamily: Fonts.titilliumWebBold },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  cardLabel: { fontFamily: Fonts.titilliumWebBold, fontSize: 14, color: Colors.black, marginBottom: 4 },
  cardAddress: { fontFamily: Fonts.titilliumWeb, fontSize: 14, color: Colors.darkGray },
  emptyContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Fonts.titilliumWeb,
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
  },
});
