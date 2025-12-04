import React, { createContext, useContext, useState, ReactNode } from "react";

export type Location = {
  address: string;
  lat: number;
  lon: number;
};

type LocationContextType = {
  origin: Location | null;
  destination: Location | null;
  setOrigin: (loc: Location) => void;
  setDestination: (loc: Location) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [origin, setOriginState] = useState<Location | null>(null);
  const [destination, setDestinationState] = useState<Location | null>(null);

  const setOrigin = (loc: Location) => setOriginState(loc);
  const setDestination = (loc: Location) => setDestinationState(loc);

  return (
    <LocationContext.Provider value={{ origin, destination, setOrigin, setDestination }}>
      {children}
    </LocationContext.Provider>
  );
};

// Hook pour accéder au store
export const useLocationStore = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocationStore must be used within a LocationProvider");
  return context;
};
