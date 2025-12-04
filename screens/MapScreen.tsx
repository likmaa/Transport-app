import React, { useEffect, useState } from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { View, ActivityIndicator } from 'react-native';

export default function MapScreen() {
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setRegion({ latitude: 48.8566, longitude: 2.3522, latitudeDelta: 0.05, longitudeDelta: 0.05 });
          return;
        }

        try {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
          return;
        } catch (e) {
          // Fall back to last known position if current lookup fails
          try {
            const last = await Location.getLastKnownPositionAsync();
            if (last) {
              setRegion({
                latitude: last.coords.latitude,
                longitude: last.coords.longitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              });
              return;
            }
          } catch {}
          throw e;
        }
      } catch (err) {
        console.warn('Erreur de localisation initiale:', err);
        setRegion({ latitude: 48.8566, longitude: 2.3522, latitudeDelta: 0.05, longitudeDelta: 0.05 });
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {!region ? (
        <ActivityIndicator style={{ marginTop: 32 }} />
      ) : (
        <MapView style={{ flex: 1 }} initialRegion={region} showsUserLocation={true}>
          <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
        </MapView>
      )}
    </View>
  );
}
