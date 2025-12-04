import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLocationStore } from '../providers/LocationProvider';
import { Colors, Fonts } from '../theme';

export default function DeliverySection() {
  const router = useRouter();
  const [packageSize, setPackageSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [fragile, setFragile] = useState(false);
  const [notes, setNotes] = useState('');
  const { origin, destination } = useLocationStore();
  const isValid = !!origin && !!destination;

  return (
    <>
      <Text style={styles.sectionTitle}>Envoyer un colis</Text>
      <View style={styles.deliveryForm}>
        <TouchableOpacity activeOpacity={0.8} style={styles.deliveryInputBox} onPress={() => router.push({ pathname: '/screens/map/PickLocation', params: { mode: 'origin' } })}>
          <MaterialCommunityIcons name="arrow-up-circle-outline" size={24} color={Colors.gray} style={styles.deliveryIcon} />
          <TextInput style={styles.searchInput} placeholder="Adresse de départ" placeholderTextColor={Colors.gray} value={origin?.address || ''} editable={false} pointerEvents="none" />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.deliveryInputBox} onPress={() => router.push({ pathname: '/screens/map/PickLocation', params: { mode: 'destination' } })}>
          <MaterialCommunityIcons name="map-marker-outline" size={24} color={Colors.primary} style={styles.deliveryIcon} />
          <TextInput style={styles.searchInput} placeholder="Adresse d'arrivée" placeholderTextColor={Colors.gray} value={destination?.address || ''} editable={false} pointerEvents="none" />
        </TouchableOpacity>

        <Text style={styles.packageSizeTitle}>Taille du colis</Text>
        <View style={styles.packageSizeSelector}>
          <TouchableOpacity onPress={() => setPackageSize('small')} style={[styles.packageOption, packageSize === 'small' && styles.packageOptionActive]}>
            <MaterialCommunityIcons name="email-outline" size={24} color={packageSize === 'small' ? Colors.primary : Colors.gray} />
            <Text style={[styles.packageText, packageSize === 'small' && styles.packageTextActive]}>Petit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPackageSize('medium')} style={[styles.packageOption, packageSize === 'medium' && styles.packageOptionActive]}>
            <MaterialCommunityIcons name="cube-outline" size={24} color={packageSize === 'medium' ? Colors.primary : Colors.gray} />
            <Text style={[styles.packageText, packageSize === 'medium' && styles.packageTextActive]}>Moyen</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPackageSize('large')} style={[styles.packageOption, packageSize === 'large' && styles.packageOptionActive]}>
            <MaterialCommunityIcons name="package-variant-closed" size={24} color={packageSize === 'large' ? Colors.primary : Colors.gray} />
            <Text style={[styles.packageText, packageSize === 'large' && styles.packageTextActive]}>Grand</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.fragileRow} onPress={() => setFragile((f) => !f)}>
          <MaterialCommunityIcons name={fragile ? 'checkbox-marked-outline' : 'checkbox-blank-outline'} size={22} color={fragile ? Colors.primary : Colors.gray} />
          <MaterialCommunityIcons name="alert-circle-outline" size={22} color={fragile ? Colors.primary : Colors.gray} style={{ marginLeft: 8 }} />
          <Text style={[styles.fragileText, fragile && { color: Colors.primary, fontFamily: Fonts.titilliumWebBold }]}>Colis fragile</Text>
        </TouchableOpacity>

        <View style={styles.notesBox}>
          <Text style={styles.notesLabel}>Instructions au livreur</Text>
          <TextInput style={styles.notesInput} placeholder="Ex: Sonner à la porte, laisser à la réception..." placeholderTextColor={Colors.gray} multiline value={notes} onChangeText={setNotes} />
        </View>

        <View style={styles.estimateBox}>
          <MaterialCommunityIcons name="timelapse" size={20} color={Colors.gray} />
          <Text style={styles.estimateText}>
            Estimation: livraison {packageSize === 'small' ? 'rapide' : packageSize === 'medium' ? 'standard' : 'grand format'}{fragile ? ' • gestion fragile' : ''}
          </Text>
        </View>

        <TouchableOpacity style={[styles.confirmButton, !isValid && { opacity: 0.6 }]} disabled={!isValid} onPress={() => { router.push({ pathname: '/screens/delivery/PackageDetails' }); }}>
          <Text style={styles.confirmButtonText}>Voir les options de livraison</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontFamily: Fonts.titilliumWebBold, fontSize: 18, color: Colors.black, marginBottom: 16 },
  deliveryForm: { paddingVertical: 10 },
  deliveryInputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: Colors.lightGray },
  deliveryIcon: { marginHorizontal: 16 },
  searchInput: { flex: 1, height: 50, fontSize: 16, fontFamily: Fonts.titilliumWeb, color: Colors.black, marginLeft: 10, paddingTop: 13 },
  packageSizeTitle: { fontFamily: Fonts.titilliumWebBold, fontSize: 16, color: Colors.gray, marginBottom: 12, marginTop: 8 },
  packageSizeSelector: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  packageOption: { alignItems: 'center', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, width: 90 },
  packageOptionActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  packageText: { fontFamily: Fonts.titilliumWeb, fontSize: 14, color: Colors.gray, marginTop: 4 },
  packageTextActive: { color: Colors.primary, fontFamily: Fonts.titilliumWebBold },
  fragileRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.white, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: Colors.lightGray, marginBottom: 12 },
  fragileText: { marginLeft: 8, color: Colors.gray, fontFamily: Fonts.titilliumWeb },
  notesBox: { backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 4, marginBottom: 12 },
  notesLabel: { fontFamily: Fonts.titilliumWebBold, color: Colors.gray, marginBottom: 6 },
  notesInput: { minHeight: 70, textAlignVertical: 'top', fontFamily: Fonts.titilliumWeb, color: Colors.black },
  estimateBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.background, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: Colors.lightGray, marginBottom: 6 },
  estimateText: { fontFamily: Fonts.titilliumWeb, color: Colors.gray },
  confirmButton: { backgroundColor: Colors.secondary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  confirmButtonText: { color: Colors.white, fontFamily: Fonts.titilliumWebBold, fontSize: 16 },
});
