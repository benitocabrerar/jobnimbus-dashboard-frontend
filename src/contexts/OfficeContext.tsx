import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Office {
  id: string;
  name: string;
  location: string;
  apiKey: string;
  color: string;
  description: string;
  baseUrl?: string;
}

export const offices: Office[] = [
  {
    id: 'guilford',
    name: 'Guilford Office',
    location: 'Guilford, CT',
    apiKey: 'mecyk7o9u0e7rcfj',
    color: '#2196f3',
    description: 'Oficina principal - Datos completos de operaciones',
    baseUrl: 'http://localhost:8000'
  },
  {
    id: 'stamford',
    name: 'Stamford Office', 
    location: 'Stamford, CT',
    apiKey: 'meaxpvmlzqu0g3il',
    color: '#ff9800',
    description: 'Sucursal - Datos regionales especializados',
    baseUrl: 'http://localhost:8000'
  }
];

interface OfficeContextType {
  currentOffice: Office;
  setCurrentOffice: (office: Office) => void;
  offices: Office[];
  isLoading: boolean;
  switchOffice: (officeId: string) => void;
}

const OfficeContext = createContext<OfficeContextType | undefined>(undefined);

export const useOffice = () => {
  const context = useContext(OfficeContext);
  if (context === undefined) {
    throw new Error('useOffice must be used within an OfficeProvider');
  }
  return context;
};

interface OfficeProviderProps {
  children: ReactNode;
}

export const OfficeProvider: React.FC<OfficeProviderProps> = ({ children }) => {
  const [currentOffice, setCurrentOffice] = useState<Office>(offices[0]); // Default to Guilford
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved office preference
    const savedOfficeId = localStorage.getItem('selectedOffice');
    if (savedOfficeId) {
      const savedOffice = offices.find(office => office.id === savedOfficeId);
      if (savedOffice) {
        setCurrentOffice(savedOffice);
      }
    }
    setIsLoading(false);
  }, []);

  const switchOffice = (officeId: string) => {
    const office = offices.find(o => o.id === officeId);
    if (office) {
      setCurrentOffice(office);
      localStorage.setItem('selectedOffice', office.id);
      
      // Trigger a page refresh to reload all data
      window.location.reload();
    }
  };

  const handleOfficeChange = (office: Office) => {
    setCurrentOffice(office);
    localStorage.setItem('selectedOffice', office.id);
  };

  const value: OfficeContextType = {
    currentOffice,
    setCurrentOffice: handleOfficeChange,
    offices,
    isLoading,
    switchOffice
  };

  return (
    <OfficeContext.Provider value={value}>
      {children}
    </OfficeContext.Provider>
  );
};