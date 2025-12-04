import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useNotificationCount() {
  const [count, setCount] = useState<number>(0);
  const API_URL: string | undefined = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        if (!API_URL) return;

        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;

        const res = await fetch(`${API_URL}/passenger/notifications/unread-count`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setCount(0);
          return;
        }

        const json = await res.json().catch(() => null);
        if (json && typeof json.count === 'number') {
          setCount(json.count);
        } else {
          setCount(0);
        }
      } catch {
        setCount(0);
      }
    };

    loadNotifications();
  }, [API_URL]);

  return count;
}
