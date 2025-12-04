import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme';
import { Fonts } from '../font';
import { useLocationStore } from '../providers/LocationProvider';
import { EMBARKATION_POINTS } from '../data/embarkationPoints';

export default function HomeTab() {
  const navigation = useNavigation();
  const { origin, destination, reset, setOrigin } = useLocationStore();
  const [showEmbarkModal, setShowEmbarkModal] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (!origin) setShowEmbarkModal(true);
      return () => {};
    }, [origin])
  );

  const handleSelectEmbark = (p: { id: string; name: string; lat: number; lon: number; address?: string }) => {
    setOrigin({ address: p.address || p.name, lat: p.lat, lon: p.lon });
    setShowEmbarkModal(false);
  };

  const handleUseMyLocation = async () => {
    try {
      const locMod = await import('expo-location');
      const { status } = await locMod.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setShowEmbarkModal(false); return; }
      const loc = await locMod.getCurrentPositionAsync({});
      setOrigin({ address: 'Ma position', lat: loc.coords.latitude, lon: loc.coords.longitude });
      setShowEmbarkModal(false);
    } catch {
      setShowEmbarkModal(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate({ name: 'screens/map/PickLocation', params: { mode: 'origin' } } as never)}
        >
          <Text style={styles.label}>Départ</Text>
          <Text style={styles.value} numberOfLines={1}>{origin?.address || 'Choisir le point de départ'}</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate({ name: 'screens/map/PickLocation', params: { mode: 'destination' } } as never)}
        >
          <Text style={styles.label}>Destination</Text>
          <Text style={styles.value} numberOfLines={1}>{destination?.address || 'Choisir la destination'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, !(origin && destination) && { opacity: 0.5 }]}
        disabled={!(origin && destination)}
        onPress={() => navigation.navigate('screens/ride/VehicleOptions' as never)}
      >
        <Text style={styles.primaryText}>Choisir un véhicule</Text>
      </TouchableOpacity>

      {(origin || destination) && (
        <TouchableOpacity style={styles.secondaryBtn} onPress={reset}>
          <Text style={styles.secondaryText}>Réinitialiser</Text>
        </TouchableOpacity>
      )}

      <Modal visible={showEmbarkModal} transparent animationType="slide" onRequestClose={() => setShowEmbarkModal(false)}>
        <View style={{ flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: Colors.white, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: '70%' }}>
            <Text style={{ fontFamily: Fonts.titilliumWebBold, fontSize: 18, color: Colors.black, marginBottom: 12 }}>Choisir un point d’embarquement</Text>
            <TouchableOpacity style={[styles.modalRow]} onPress={handleUseMyLocation}>
              <MaterialCommunityIcons name="crosshairs-gps" size={24} color={Colors.primary} />
              <Text style={styles.modalRowText}>Utiliser ma position</Text>
            </TouchableOpacity>
            <FlatList
              data={EMBARKATION_POINTS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalRow} onPress={() => handleSelectEmbark(item)}>
                  <MaterialCommunityIcons name="map-marker" size={24} color={Colors.secondary} />
                  <Text style={styles.modalRowText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setShowEmbarkModal(false)}>
              <Text style={styles.secondaryText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  title: { fontFamily: Fonts.unboundedBold, color: Colors.black, fontSize: 20, marginBottom: 12 },
  card: { backgroundColor: Colors.white, borderRadius: 12, padding: 12, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2 },
  row: { paddingVertical: 10 },
  separator: { height: 1, backgroundColor: Colors.background, marginVertical: 8 },
  label: { fontFamily: Fonts.titilliumWeb, color: Colors.gray, marginBottom: 4 },
  value: { fontFamily: Fonts.titilliumWebBold, color: Colors.black },
  primaryBtn: { marginTop: 16, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryText: { color: Colors.white, fontFamily: Fonts.titilliumWebBold },
  secondaryBtn: { marginTop: 10, backgroundColor: Colors.white, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.lightGray },
  secondaryText: { color: Colors.black, fontFamily: Fonts.titilliumWebBold },
  modalRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.background },
  modalRowText: { fontFamily: Fonts.titilliumWeb, color: Colors.black, marginLeft: 8 },
});
