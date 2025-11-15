import React, { createContext, useContext, useEffect, useState } from 'react';
import { jobNimbusApi } from '../services/apiService';

interface CacheContextType {
  dashboardData: any;
  contactsData: any;
  jobsData: any;
  isInitialized: boolean;
  refreshCache: () => Promise<void>;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const useCacheContext = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCacheContext must be used within a CacheProvider');
  }
  return context;
};

export const CacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [contactsData, setContactsData] = useState<any>(null);
  const [jobsData, setJobsData] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const preloadCache = async () => {
    console.log('🚀 RTX Cache Context: Pre-loading essential data...');
    
    try {
      // Preload essential data in parallel
      const [dashboard, contacts, jobs] = await Promise.all([
        jobNimbusApi.getDashboardSummary().catch(e => ({ error: e.message })),
        jobNimbusApi.getContacts(1, 10).catch(e => ({ error: e.message })),
        jobNimbusApi.getJobs(1, 10).catch(e => ({ error: e.message }))
      ]);

      setDashboardData(dashboard);
      setContactsData(contacts);
      setJobsData(jobs);
      setIsInitialized(true);
      
      console.log('✅ RTX Cache Context: Essential data preloaded successfully');
    } catch (error) {
      console.error('❌ RTX Cache Context: Preload failed:', error);
      setIsInitialized(true); // Still mark as initialized to prevent infinite loading
    }
  };

  const refreshCache = async () => {
    console.log('🔄 RTX Cache Context: Refreshing cache...');
    setIsInitialized(false);
    await preloadCache();
  };

  useEffect(() => {
    preloadCache();
    
    // Refresh cache every 5 minutes
    const interval = setInterval(preloadCache, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CacheContext.Provider
      value={{
        dashboardData,
        contactsData,
        jobsData,
        isInitialized,
        refreshCache
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};

export default CacheProvider;