import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../theme';

type Props = {
  logoSource: ImageSourcePropType;
  notificationCount: number;
  onPressNotifications: () => void;
};

export default function HomeHeader({ logoSource, notificationCount, onPressNotifications }: Props) {
  return (
    <View style={styles.header}>
      <Image source={logoSource} style={styles.logo} resizeMode="contain" />
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Notifications" style={styles.bellBtn} onPress={onPressNotifications}>
        <Ionicons name="notifications-outline" size={24} color={Colors.black} />
        {notificationCount > 0 && (
          <View style={styles.bellBadge}>
            <Text style={styles.bellBadgeText}>{notificationCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 6 },
  logo: { width: 110, height: 28 },
  bellBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white, position: 'relative', borderWidth: 1, borderColor: Colors.lightGray },
  bellBadge: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.white },
  bellBadgeText: { color: Colors.white, fontFamily: Fonts.titilliumWebBold, fontSize: 11, lineHeight: 12 },
});
