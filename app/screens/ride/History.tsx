import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme';
import { Fonts } from '../../font';

const data = [
  { id: 'r1', date: '2025-09-18', from: 'Domicile', to: 'Aéroport', vehicle: 'Standard', amount: 2500, status: 'Terminée' },
  { id: 'r2', date: '2025-09-17', from: 'Bureau', to: 'Centre-ville', vehicle: 'Éco', amount: 1800, status: 'Annulée' },
  { id: 'r3', date: '2025-09-16', from: 'Chez Paul', to: 'Marché', vehicle: 'Premium', amount: 4000, status: 'Terminée' },
];

export default function History() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.from} → {item.to}</Text>
              <Text style={styles.meta}>{item.date} · {item.vehicle} · {item.status}</Text>
            </View>
            <Text style={styles.amount}>FCFA {item.amount.toLocaleString('fr-FR')}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  card: { backgroundColor: Colors.white, borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2 },
  title: { fontFamily: Fonts.titilliumWebBold, color: Colors.black },
  meta: { fontFamily: Fonts.titilliumWeb, color: Colors.gray, marginTop: 4 },
  amount: { fontFamily: Fonts.titilliumWebBold, color: Colors.black },
});
