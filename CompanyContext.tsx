
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Company } from './types';
import { COMPANIES } from './constants';

interface CompanyContextType {
  selectedCompanyId: string | 'all';
  setSelectedCompanyId: (id: string | 'all') => void;
  currentCompany: Company | null;
  companies: Company[];
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | 'all'>('all');

  const currentCompany = selectedCompanyId === 'all' 
    ? null 
    : COMPANIES.find(c => c.id === selectedCompanyId) || null;

  return (
    <CompanyContext.Provider value={{ selectedCompanyId, setSelectedCompanyId, currentCompany, companies: COMPANIES }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
