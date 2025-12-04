import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from './theme';

// Optional AsyncStorage import (safe like in providers)
let AsyncStorage: any;
try { AsyncStorage = require('@react-native-async-storage/async-storage').default; } catch {}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 1) Si un authToken valide existe (utilisateur déjà en base / connecté), on va directement sur l'app
        if (AsyncStorage && API_URL) {
          const token = await AsyncStorage.getItem('authToken');
          if (token) {
            try {
              const res = await fetch(`${API_URL}/auth/me`, {
                headers: {
                  Accept: 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });
              if (res.ok) {
                const id = setTimeout(() => {
                  if (!cancelled) router.replace('/' as any);
                }, 800);
                return () => clearTimeout(id);
              }
            } catch {
              // on ignore et on retombe sur la logique walkthrough
            }
          }
        }

        // 2) Sinon, on garde la logique walkthrough basée sur has_seen_walkthrough
        const seen = AsyncStorage ? await AsyncStorage.getItem('has_seen_walkthrough') : null;
        const target = seen ? '/' : '/walkthrough/Walkthrough1';
        const id = setTimeout(() => {
          if (!cancelled) router.replace(target as any);
        }, 1000);
        return () => clearTimeout(id);
      } catch {
        router.replace('/');
      }
    })();

    return () => { cancelled = true; };
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerWrap}>
        <Image
          source={require('../assets/images/LOGO.png')}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
      <ActivityIndicator color={Colors.white} size="large" style={styles.spinner} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 120,
  },
  spinner: {
    marginBottom: 40,
    alignSelf: 'center',
  },
});

