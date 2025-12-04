export type EmbarkationPoint = {
  id: string;
  name: string;
  address?: string;
  lat: number;
  lon: number;
  radiusMeters?: number;
};

export const EMBARKATION_POINTS: EmbarkationPoint[] = [
  // Ligne 1
  { id: 'fin_pave_agbokou', name: 'Fin pavé Agbokou', lat: 0, lon: 0, radiusMeters: 300 },
  { id: 'ecole_normale_sup', name: 'Ecole Normale Supérieure', lat: 0, lon: 0, radiusMeters: 300 },

  // Ligne 2
  { id: 'place_bayole', name: 'Place Bayole', lat: 0, lon: 0, radiusMeters: 300 },
  { id: 'ouando', name: 'Ouando', lat: 0, lon: 0, radiusMeters: 300 },

  // Ligne 3
  { id: 'ouando_piscine', name: 'Ouando (Piscine municipale)', lat: 0, lon: 0, radiusMeters: 300 },
  { id: 'beau_rivage', name: 'Beau Rivage (Carrefour)', lat: 0, lon: 0, radiusMeters: 300 },

  // Ligne 4
  { id: 'ouando_marche', name: 'Ouando (Marché)', lat: 0, lon: 0, radiusMeters: 300 },
  { id: 'agata_marche', name: 'Agata (Marché)', lat: 0, lon: 0, radiusMeters: 300 },

  // Ligne 5
  { id: 'agata_carrefour', name: 'Agata (Carrefour)', lat: 0, lon: 0, radiusMeters: 300 },
  { id: 'adjara_marche', name: 'Adjara (Marché)', lat: 0, lon: 0, radiusMeters: 300 },

  // Ligne 6
  { id: 'avakpa', name: 'Avakpa', lat: 0, lon: 0, radiusMeters: 300 },

  // Ligne 7
  { id: 'misseterete_carrefour', name: 'Misserete (Carrefour)', lat: 0, lon: 0, radiusMeters: 300 },

  // Ligne 8 (utilise déjà Ouando Marché et Misserete Carrefour)

  // Ligne 9
  { id: 'awana_carrefour', name: 'Awana (Carrefour)', lat: 0, lon: 0, radiusMeters: 300 },
  { id: 'grand_marche', name: 'Grand Marché', lat: 0, lon: 0, radiusMeters: 300 },

  // Ligne 10
  { id: 'baba_iyabo_carrefour', name: 'Baba Iyabo (Carrefour)', lat: 0, lon: 0, radiusMeters: 300 },

  // Ligne 11
  { id: 'ahouangbo_marche', name: 'Ahouangbo (Marché)', lat: 0, lon: 0, radiusMeters: 300 },

  // Ligne 12
  { id: 'agbokou', name: 'Agbokou', lat: 0, lon: 0, radiusMeters: 300 },
];
