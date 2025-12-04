import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React from 'react';
import {
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../theme';

interface CustomHeaderProps {
    showMenuButton?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ showMenuButton = false }) => {
    const navigation = useNavigation();

    const handleNotificationPress = () => {
        // Navigue vers l'écran Notifications enregistré sous app/screens/Notifications.tsx
        navigation.navigate('screens/Notifications' as never);
    };

    const handleMenuPress = () => {
        console.log('Menu pressed!');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {showMenuButton ? (
                    <TouchableOpacity style={styles.iconButton} onPress={handleMenuPress}>
                        <MaterialCommunityIcons name="menu" size={28} color={Colors.black} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.logoContainer}>
                        {/* Logo affiché quand showMenuButton = false */}
                        <Image
                            source={require('../../assets/images/LOGO_OR.png')}
                            style={styles.logo}
                        />
                    </View>
                )}

                <View style={styles.centerContent} />

                <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
                    <Ionicons name="notifications-outline" size={26} color={Colors.black} />
                    <View style={styles.notificationBadge} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        height: 80,
    },
    logoContainer: {},
    logo: {
        width: 80,
        height: 100,
        resizeMode: 'contain',
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconButton: {
        padding: 5,
    },
    notificationButton: {
        padding: 5,
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: Colors.secondary,
        borderRadius: 5,
        width: 10,
        height: 10,
        borderWidth: 1,
        borderColor: Colors.white,
    },
});

export default CustomHeader;
