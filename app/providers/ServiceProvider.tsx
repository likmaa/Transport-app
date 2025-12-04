import React, { createContext, useContext, useState } from 'react';

export type ServiceType = 'deplacement' | 'course' | 'livraison';

export type PackageDetails = {
  recipientName: string;
  recipientPhone: string;
  description?: string;
  weightKg?: string;
  fragile?: boolean;
};

type ServiceContextType = {
  serviceType: ServiceType;
  setServiceType: (t: ServiceType) => void;
  packageDetails: PackageDetails | null;
  setPackageDetails: (d: PackageDetails | null) => void;
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const [serviceType, setServiceType] = useState<ServiceType>('deplacement');
  const [packageDetails, setPackageDetails] = useState<PackageDetails | null>(null);

  return (
    <ServiceContext.Provider value={{ serviceType, setServiceType, packageDetails, setPackageDetails }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServiceStore() {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error('useServiceStore must be used within ServiceProvider');
  return ctx;
}
