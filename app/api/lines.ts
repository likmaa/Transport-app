import AsyncStorage from '@react-native-async-storage/async-storage';

export type LineEstimateResponse = {
  line_id: number;
  from_stop_id: number;
  to_stop_id: number;
  segments: number;
  unit_price: number;
  price: number;
};

export async function estimateLinePrice(
  lineId: number,
  fromStopId: number,
  toStopId: number
): Promise<LineEstimateResponse | null> {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  if (!API_URL) return null;

  const token = await AsyncStorage.getItem('authToken');
  if (!token) return null;

  const res = await fetch(`${API_URL}/passenger/lines/estimate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      line_id: lineId,
      from_stop_id: fromStopId,
      to_stop_id: toStopId,
    }),
  });

  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  return json;
}
