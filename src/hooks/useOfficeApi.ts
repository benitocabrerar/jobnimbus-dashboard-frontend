import { useEffect } from 'react';
import { useOffice } from '../contexts/OfficeContext';
import { jobNimbusApi } from '../services/apiService';

export const useOfficeApi = () => {
  const { currentOffice } = useOffice();

  useEffect(() => {
    // Update the API service location when office changes
    if (currentOffice) {
      jobNimbusApi.setLocation(currentOffice.id as 'guilford' | 'stamford');
    }
  }, [currentOffice]);

  return {
    currentOffice,
    apiService: jobNimbusApi
  };
};