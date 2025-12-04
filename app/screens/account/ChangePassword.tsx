import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme';
import { Fonts } from '../../font';

export default function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [nextPw, setNextPw] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mot de passe actuel</Text>
          <TextInput value={current} onChangeText={setCurrent} style={styles.input} placeholder="••••••••" secureTextEntry />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nouveau mot de passe</Text>
          <TextInput value={nextPw} onChangeText={setNextPw} style={styles.input} placeholder="••••••••" secureTextEntry />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmer</Text>
          <TextInput value={confirm} onChangeText={setConfirm} style={styles.input} placeholder="••••••••" secureTextEntry />
        </View>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Enregistrer</Text>
        </TouchableOpacity>
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
