import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Switch } from 'react-native';
import { Colors } from '../../theme';
import { Fonts } from '../../font';

export default function NotificationPreferences() {
  const [marketing, setMarketing] = useState(true);
  const [rides, setRides] = useState(true);
  const [drivers, setDrivers] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.colLeft}>
            <Text style={styles.label}>Mises à jour de trajets</Text>
            <Text style={styles.sub}>Alertes pour vos courses (départ, arrivée, retards...)</Text>
          </View>
          <Switch value={rides} onValueChange={setRides} trackColor={{ false: Colors.lightGray, true: Colors.primary }} thumbColor={Colors.white} />
        </View>
        <View style={styles.row}>
          <View style={styles.colLeft}>
            <Text style={styles.label}>Messages chauffeurs</Text>
            <Text style={styles.sub}>Notifications et messages liés à vos chauffeurs</Text>
          </View>
          <Switch value={drivers} onValueChange={setDrivers} trackColor={{ false: Colors.lightGray, true: Colors.primary }} thumbColor={Colors.white} />
        </View>
        <View style={styles.row}>
          <View style={styles.colLeft}>
            <Text style={styles.label}>Offres & marketing</Text>
            <Text style={styles.sub}>Promotions et actualités</Text>
          </View>
          <Switch value={marketing} onValueChange={setMarketing} trackColor={{ false: Colors.lightGray, true: Colors.primary }} thumbColor={Colors.white} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  card: { backgroundColor: Colors.white, borderRadius: 12, padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.lightGray },
  colLeft: { flex: 1, paddingRight: 10 },
  label: { fontFamily: Fonts.titilliumWebBold, fontSize: 15, color: Colors.black },
  sub: { fontFamily: Fonts.titilliumWeb, fontSize: 13, color: Colors.darkGray, marginTop: 4 },
});
