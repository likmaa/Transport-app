import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../../theme';
import { Fonts } from '../../font';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AddressFormParams = {
  id?: string;
  label?: string;
  full_address?: string;
};

export default function AddressForm() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<AddressFormParams>();

  const isEdit = !!params.id;
  const [label, setLabel] = useState(params.label ?? 'Domicile');
  const [address, setAddress] = useState(params.full_address ?? '');
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const handleSave = async () => {
    if (!API_URL) {
      Alert.alert('Erreur', 'API_URL non configurée');
      return;
    }
    if (!label.trim() || !address.trim()) {
      Alert.alert('Information', 'Veuillez renseigner le libellé et l\'adresse.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Erreur', 'Utilisateur non connecté');
        return;
      }

      const url = isEdit && params.id
        ? `${API_URL}/passenger/addresses/${params.id}`
        : `${API_URL}/passenger/addresses`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          label: label.trim(),
          full_address: address.trim(),
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json) {
        const msg = (json && (json.message || json.error)) || 'Impossible d\'enregistrer l\'adresse.';
        Alert.alert('Erreur', msg);
        return;
      }

      Alert.alert('Succès', isEdit ? 'Adresse mise à jour.' : 'Adresse créée.');
      // Retour à la liste
      // @ts-ignore navigation type
      (navigation as any).goBack();
    } catch (e: any) {
      Alert.alert('Erreur', e?.message || 'Erreur réseau lors de l\'enregistrement de l\'adresse');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !params.id) {
      return;
    }
    if (!API_URL) {
      Alert.alert('Erreur', 'API_URL non configurée');
      return;
    }

    Alert.alert('Confirmation', 'Supprimer cette adresse ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
              Alert.alert('Erreur', 'Utilisateur non connecté');
              return;
            }

            const res = await fetch(`${API_URL}/passenger/addresses/${params.id}`, {
              method: 'DELETE',
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });

            if (!res.ok) {
              const json = await res.json().catch(() => null);
              const msg = (json && (json.message || json.error)) || 'Impossible de supprimer l\'adresse.';
              Alert.alert('Erreur', msg);
              return;
            }

            Alert.alert('Succès', 'Adresse supprimée.');
            // @ts-ignore navigation type
            (navigation as any).goBack();
          } catch (e: any) {
            Alert.alert('Erreur', e?.message || 'Erreur réseau lors de la suppression de l\'adresse');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Libellé</Text>
          <TextInput value={label} onChangeText={setLabel} style={styles.input} placeholder="Ex: Domicile" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Adresse</Text>
          <TextInput value={address} onChangeText={setAddress} style={styles.input} placeholder="Rue, N°, Ville" />
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveText}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Text>
        </TouchableOpacity>
        {isEdit && (
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: Colors.error }]} onPress={handleDelete} disabled={loading}>
            <Text style={styles.saveText}>Supprimer</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },
  inputGroup: { marginBottom: 12 },
  label: { fontFamily: Fonts.titilliumWebBold, color: Colors.black, marginBottom: 6 },
  input: { backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 12, height: 44, borderWidth: 1, borderColor: Colors.lightGray, fontFamily: Fonts.titilliumWeb },
  saveBtn: { marginTop: 12, backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  saveText: { color: Colors.white, fontFamily: Fonts.titilliumWebBold, fontSize: 16 },
});
