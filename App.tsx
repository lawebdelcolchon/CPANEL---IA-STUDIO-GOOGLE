import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Customers } from './pages/Customers';
import { Products } from './pages/Products';
import { Gallery } from './pages/Gallery';
import { Inventory } from './pages/Inventory';
import { Budget } from './pages/Budget';
import { Marketing } from './pages/Marketing';
import { Settings } from './pages/Settings';
import { Marketplace } from './pages/Marketplace';
import { Transport } from './pages/Transport';
import { Scanner } from './pages/Scanner';
import { Suppliers } from './pages/Suppliers';
import { CompanyProvider } from './CompanyContext';

function App() {
  return (
    <CompanyProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/products" element={<Products />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/settings" element={<Settings />} />
            {/* New Marketplace Route with Parameter */}
            <Route path="/marketplace/:platform" element={<Marketplace />} />
            {/* New Transport Route with Parameter */}
            <Route path="/transport/:provider" element={<Transport />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </CompanyProvider>
  );
}

export default App;