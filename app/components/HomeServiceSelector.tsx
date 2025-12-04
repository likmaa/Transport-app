import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Fonts } from '../theme';

type ServiceType = 'Déplacement' | 'Courses' | 'Livraison';

type Props = {
  activeService: ServiceType;
  onChange: (s: ServiceType) => void;
};

export default function HomeServiceSelector({ activeService, onChange }: Props) {
  return (
    <View style={styles.serviceSelector}>
      <TouchableOpacity style={[styles.serviceButton, activeService === 'Déplacement' && styles.serviceButtonActive]} onPress={() => onChange('Déplacement')}>
        <MaterialCommunityIcons name="car" size={26} color={activeService === 'Déplacement' ? Colors.primary : Colors.gray} />
        <Text style={[styles.serviceButtonText, activeService === 'Déplacement' && styles.serviceButtonTextActive]}>Courses</Text>
        {activeService === 'Déplacement' && <View style={styles.activeUnderline} />}
      </TouchableOpacity>
      <TouchableOpacity style={[styles.serviceButton, activeService === 'Courses' && styles.serviceButtonActive]} onPress={() => onChange('Courses')}>
        <MaterialCommunityIcons name="walk" size={26} color={activeService === 'Courses' ? Colors.primary : Colors.gray} />
        <Text style={[styles.serviceButtonText, activeService === 'Courses' && styles.serviceButtonTextActive]}>Deplacement</Text>
        {activeService === 'Courses' && <View style={styles.activeUnderline} />}
      </TouchableOpacity>
      <TouchableOpacity style={[styles.serviceButton, activeService === 'Livraison' && styles.serviceButtonActive]} onPress={() => onChange('Livraison')}>
        <MaterialCommunityIcons name="package-variant-closed" size={26} color={activeService === 'Livraison' ? Colors.primary : Colors.gray} />
        <Text style={[styles.serviceButtonText, activeService === 'Livraison' && styles.serviceButtonTextActive]}>Livraison</Text>
        {activeService === 'Livraison' && <View style={styles.activeUnderline} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  serviceSelector: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent', borderRadius: 0, paddingVertical: 0, marginHorizontal: 20, marginTop: 6, marginBottom: 10 },
  serviceButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginHorizontal: 4 },
  serviceButtonActive: {},
  serviceButtonText: { fontFamily: 'Titillium-SemiBold', fontSize: 13, color: Colors.gray, marginTop: 4 },
  serviceButtonTextActive: { color: Colors.primary, fontFamily: 'Titillium-SemiBold' },
  activeUnderline: { width: 28, height: 4, backgroundColor: Colors.primary, borderRadius: 2, marginTop: 6 },
});
