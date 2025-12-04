// screens/ride/Confirm.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import * as ExpoLocation from 'expo-location';
import { useNavigation } from 'expo-router';
import { Colors } from '../../theme';
import { Fonts } from '../../font';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocationStore } from '../../providers/LocationProvider';
import { usePaymentStore } from '../../providers/PaymentProvider';
import { useServiceStore } from '../../providers/ServiceProvider';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';

// Helper pour le géocodage inverse
const reverseNominatim = async (lat: number, lon: number): Promise<string | null> => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
    const data = await res.json();
    return data?.display_name || null;
  } catch (e) {
    console.error("Erreur reverse geocoding :", e);
    return null;
  }
};

export default function ConfirmRide() {
  const navigation = useNavigation();
  const { origin, destination, setOrigin } = useLocationStore();
  const { method } = usePaymentStore();
  const { serviceType } = useServiceStore();

  const [isLoading, setIsLoading] = useState(true);
  const [priceEstimate, setPriceEstimate] = useState<number | null>(null);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);

  useEffect(() => {
    const ensureOrigin = async () => {
      if (origin) {
        setIsLoading(false);
        return;
      }
      try {
        const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission requise", "La localisation est nécessaire.");
          navigation.goBack();
          return;
        }
        const location = await ExpoLocation.getCurrentPositionAsync({});
        const address = await reverseNominatim(location.coords.latitude, location.coords.longitude);
        setOrigin({
          address: address || "Ma position actuelle",
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        });
      } catch (error) {
        Alert.alert("Erreur", "Impossible de récupérer votre position.");
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };
    ensureOrigin();
  }, [origin, setOrigin, navigation]);

  useEffect(() => {
    if (!origin || !destination) return;
    const calculatePrice = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        const route = data?.routes?.[0];

        if (!route || !Array.isArray(route?.geometry?.coordinates)) {
          Alert.alert("Erreur", "Impossible de calculer l'itinéraire.");
          return;
        }

        const distanceMeters = route.distance || 0;
        const distanceKm = distanceMeters / 1000;
        setPriceEstimate(Math.round(800 + distanceKm * 500));

        const durationSec = route.duration ?? null;
        if (durationSec != null) {
          const minutes = Math.max(1, Math.round(durationSec / 60));
          setEtaMinutes(minutes);
        }

        const coords = route.geometry.coordinates;
        setRouteCoords(coords.map((c: [number, number]) => ({ latitude: c[1], longitude: c[0] })));

        const latitudes = coords.map((c: [number, number]) => c[1]);
        const longitudes = coords.map((c: [number, number]) => c[0]);
        const centerLat = (Math.min(...latitudes) + Math.max(...latitudes)) / 2;
        const centerLon = (Math.min(...longitudes) + Math.max(...longitudes)) / 2;
        setInitialRegion({ latitude: centerLat, longitude: centerLon, latitudeDelta: 0.05, longitudeDelta: 0.05 });
      } catch (error) {
        console.error("Failed to fetch route for price:", error);
        Alert.alert("Erreur", "Problème lors du calcul de l'itinéraire.");
      }
    };
    calculatePrice();
  }, [origin, destination]);

  const paymentLabel = (m: ReturnType<typeof usePaymentStore>['method']) => {
    const labels = { cash: 'Espèces', mobile_money: 'Mobile Money', card: 'Carte', wallet: 'Portefeuille', qr: 'QR Code' };
    return labels[m] || String(m);
  };

  if (isLoading || !origin || !destination) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Finalisation de votre demande...</Text>
      </View>
    );
  }

  const arrivalChip = useMemo(() => {
    if (!etaMinutes) return null;
    const now = new Date();
    now.setMinutes(now.getMinutes() + etaMinutes);
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    return `arrivée à ${hh}:${mm}`;
  }, [etaMinutes]);

  const priceRangeText = useMemo(() => {
    if (!priceEstimate) return '...';
    const min = Math.max(0, Math.round(priceEstimate * 0.9));
    const max = Math.round(priceEstimate * 1.1);
    return `${min.toLocaleString('fr-FR')}–${max.toLocaleString('fr-FR')} F`;
  }, [priceEstimate]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapWrap}>
        {initialRegion ? (
          <MapView style={StyleSheet.absoluteFill} initialRegion={initialRegion}>
            {routeCoords.length > 0 && (
              <Polyline coordinates={routeCoords} strokeColor={Colors.primary} strokeWidth={5} />
            )}
            <Marker coordinate={{ latitude: origin.lat, longitude: origin.lon }} title="Départ" />
            <Marker coordinate={{ latitude: destination.lat, longitude: destination.lon }} title="Arrivée" />
          </MapView>
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.mapLoading]}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        )}
        {arrivalChip && (
          <View style={styles.arrivalChip}>
            <Text style={styles.arrivalChipText}>{arrivalChip}</Text>
          </View>
        )}
        <View style={styles.mapTopButtons}>
          <TouchableOpacity style={styles.roundBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.black} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.addrRow}>
          <MaterialCommunityIcons name="account" size={20} color={Colors.gray} />
          <Text style={styles.addrText} numberOfLines={1}>{origin.address}</Text>
          <View />
        </View>

        <View style={[styles.addrRow, styles.addrRowDivider]}>
          <MaterialCommunityIcons name="map-marker-distance" size={20} color={Colors.gray} />
          <Text style={styles.addrText} numberOfLines={1}>{destination.address}</Text>
          <TouchableOpacity disabled>
            <Text style={styles.stopsText}>Arrêts</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.servicesRow}>
          <View style={styles.serviceCard}>
            <MaterialCommunityIcons name="car" size={30} color={Colors.primary} />
            <Text style={styles.serviceEta}>{etaMinutes ? `${etaMinutes} min.` : '—'}</Text>
            <Text style={styles.serviceTitle}>Éco</Text>
            <Text style={styles.servicePrice}>{priceRangeText}</Text>
          </View>
          <View style={styles.serviceCard}>
            <MaterialCommunityIcons name="motorbike" size={30} color={Colors.secondary} />
            <Text style={styles.serviceEta}>{etaMinutes ? `${Math.max(1, etaMinutes - 2)} min.` : '—'}</Text>
            <Text style={styles.serviceTitle}>Moto</Text>
            <Text style={styles.servicePrice}>200 F</Text>
          </View>
          <View style={styles.serviceCard}>
            <MaterialCommunityIcons name="van-passenger" size={30} color={Colors.gray} />
            <Text style={styles.serviceEta}>—</Text>
            <Text style={styles.serviceTitle}>Kloboto</Text>
            <Text style={styles.servicePrice}>—</Text>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.payRow} onPress={() => navigation.navigate('screens/payment/PaymentOptions')}>
          <Ionicons name="card-outline" size={22} color={Colors.primary} />
          <Text style={styles.payText}>Paiement · {paymentLabel(method)}</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.orderBtn, !priceEstimate && { backgroundColor: Colors.lightGray }]}
          disabled={!priceEstimate}
          onPress={() => {
            navigation.navigate('screens/ride/SearchingDriver', {
              origin,
              destination,
              priceEstimate,
              method,
              serviceType,
            });
          }}
        >
          <Text style={styles.orderBtnText}>Commander</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loadingText: { marginTop: 10, fontFamily: Fonts.titilliumWeb, color: Colors.gray },
  mapWrap: { height: Dimensions.get('window').height * 0.55, backgroundColor: Colors.lightGray },
  mapLoading: { justifyContent: 'center', alignItems: 'center' },
  mapTopButtons: { position: 'absolute', top: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  roundBtn: { backgroundColor: 'white', width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  arrivalChip: { position: 'absolute', top: 66, alignSelf: 'center', backgroundColor: 'white', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  arrivalChipText: { fontFamily: Fonts.titilliumWeb, color: Colors.black },
  sheet: { flex: 1, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, marginTop: -10 },
  addrRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  addrRowDivider: { borderTopWidth: 1, borderTopColor: Colors.lightGray },
  addrText: { flex: 1, fontFamily: Fonts.titilliumWebSemiBold, fontSize: 16, color: Colors.black },
  stopsText: { fontFamily: Fonts.titilliumWebBold, color: Colors.gray },
  servicesRow: { paddingVertical: 10 },
  serviceCard: { width: 110, backgroundColor: Colors.background, borderRadius: 12, padding: 12, marginRight: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.lightGray },
  serviceEta: { fontFamily: Fonts.titilliumWeb, fontSize: 12, color: Colors.gray, marginTop: 4 },
  serviceTitle: { fontFamily: Fonts.titilliumWebBold, fontSize: 14, color: Colors.black, marginTop: 2 },
  servicePrice: { fontFamily: Fonts.titilliumWebBold, fontSize: 14, color: Colors.black, marginTop: 2 },
  payRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.background, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, marginTop: 6 },
  payText: { flex: 1, marginLeft: 8, fontFamily: Fonts.titilliumWeb, color: Colors.black },
  orderBtn: { marginTop: 12, backgroundColor: Colors.red, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  orderBtnText: { color: Colors.white, fontFamily: Fonts.titilliumWebBold, fontSize: 16 },
});
