
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Package, 
  ArrowRightLeft, 
  MapPin, 
  Calendar,
  History,
  Box,
  ArrowUpCircle,
  ArrowDownCircle,
  RotateCcw,
  Settings2
} from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_STOCK_MOVEMENTS, COMPANIES } from '../constants';
import { Status, Product, StockMovement, MovementType } from '../types';
import { useCompany } from '../CompanyContext';

// Helper to generate a fake location based on ID
const getMockLocation = (id: string) => {
  const aisle = id.charCodeAt(id.length - 1) % 5 + 1; // 1-5
  const shelf = id.charCodeAt(id.length - 2) % 4 + 1; // 1-4
  const bin = id.charCodeAt(id.length - 3) % 10 + 1; // 1-10
  return `Pasillo ${aisle} - Estante ${shelf} - Caja ${bin}`;
};

const MovementIcon = ({ type }: { type: MovementType }) => {
  switch (type) {
    case 'in': return <ArrowUpCircle className="text-green-500" size={18} />;
    case 'out': return <ArrowDownCircle className="text-blue-500" size={18} />;
    case 'adjustment': return <Settings2 className="text-orange-500" size={18} />;
    case 'return': return <RotateCcw className="text-purple-500" size={18} />;
  }
};

const MovementBadge = ({ type }: { type: MovementType }) => {
  const styles = {
    in: 'bg-green-50 text-green-700 border-green-100',
    out: 'bg-blue-50 text-blue-700 border-blue-100',
    adjustment: 'bg-orange-50 text-orange-700 border-orange-100',
    return: 'bg-purple-50 text-purple-700 border-purple-100',
  };
  
  const labels = {
    in: 'Entrada',
    out: 'Salida',
    adjustment: 'Ajuste',
    return: 'Devolución'
  };

  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[type]}`}>
      {labels[type]}
    </span>
  );
};

const CompanyBadge = ({ companyId }: { companyId: string }) => {
  const company = COMPANIES.find(c => c.id === companyId);
  if (!company) return null;
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${company.color} opacity-80`}>
      {company.logo}
    </span>
  );
};

export const Inventory: React.FC = () => {
  const { selectedCompanyId } = useCompany();
  const [activeTab, setActiveTab] = useState<'stock' | 'movements'>('stock');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Base Data filtered by Company
  const companyProducts = useMemo(() => {
    return selectedCompanyId === 'all' 
      ? MOCK_PRODUCTS 
      : MOCK_PRODUCTS.filter(p => p.companyId === selectedCompanyId);
  }, [selectedCompanyId]);

  const companyMovements = useMemo(() => {
    return selectedCompanyId === 'all' 
      ? MOCK_STOCK_MOVEMENTS 
      : MOCK_STOCK_MOVEMENTS.filter(m => m.companyId === selectedCompanyId);
  }, [selectedCompanyId]);

  // Derived Statistics
  const stats = useMemo(() => {
    const totalStock = companyProducts.reduce((acc, p) => acc + p.stock, 0);
    const totalValue = companyProducts.reduce((acc, p) => acc + (p.stock * p.price), 0);
    const lowStockItems = companyProducts.filter(p => p.stock < 20).length;
    const outOfStockItems = companyProducts.filter(p => p.stock === 0).length;

    return { totalStock, totalValue, lowStockItems, outOfStockItems };
  }, [companyProducts]);

  // Filtering Logic
  const filteredStock = useMemo(() => {
    return companyProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, companyProducts]);

  const filteredMovements = useMemo(() => {
    return companyMovements.filter(m => 
      (m.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       m.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === 'All' || m.type === filterType)
    );
  }, [searchTerm, filterType, companyMovements]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventario y Logística</h2>
          <p className="text-sm text-gray-500">Control de existencias, ubicaciones y auditoría de movimientos.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2">
            <Download size={16} />
            Reporte
          </button>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
            <ArrowRightLeft size={16} />
            Ajuste Rápido
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Package size={20} />
            </div>
          </div>
          <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Stock Total</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStock.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Unidades físicas</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Valor Inventario</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">${stats.totalValue.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Precio de venta actual</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <AlertTriangle size={20} />
            </div>
            <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Acción Req.</span>
          </div>
          <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Stock Bajo</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.lowStockItems}</p>
          <p className="text-xs text-gray-400 mt-1">Items por debajo del mínimo</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <Box size={20} />
            </div>
          </div>
          <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Agotados</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.outOfStockItems}</p>
          <p className="text-xs text-gray-400 mt-1">Sin existencias</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[500px]">
        {/* Tabs & Search Toolbar */}
        <div className="border-b border-gray-200">
          <div className="flex items-center gap-6 px-6 pt-2">
            <button
              onClick={() => setActiveTab('stock')}
              className={`pb-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === 'stock'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Box size={18} /> Stock Actual
            </button>
            <button
              onClick={() => setActiveTab('movements')}
              className={`pb-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === 'movements'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <History size={18} /> Movimientos
            </button>
          </div>
          
          {/* Toolbar */}
          <div className="p-4 bg-gray-50/50 flex flex-col sm:flex-row justify-between gap-4 items-center">
            <div className="relative w-full sm:w-96">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input 
                 type="text" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder={activeTab === 'stock' ? "Buscar producto o SKU..." : "Buscar en historial..."}
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
               />
            </div>

            {activeTab === 'movements' && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                 <Filter size={16} className="text-gray-400" />
                 <select 
                   value={filterType}
                   onChange={(e) => setFilterType(e.target.value)}
                   className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block px-3 py-2"
                 >
                   <option value="All">Todos los tipos</option>
                   <option value="in">Entradas</option>
                   <option value="out">Salidas</option>
                   <option value="adjustment">Ajustes</option>
                   <option value="return">Devoluciones</option>
                 </select>
              </div>
            )}
          </div>
        </div>

        {/* STOCK TAB CONTENT */}
        {activeTab === 'stock' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Producto</th>
                  {selectedCompanyId === 'all' && <th className="px-6 py-3">Empresa</th>}
                  <th className="px-6 py-3">Ubicación</th>
                  <th className="px-6 py-3 text-center">Stock Físico</th>
                  <th className="px-6 py-3 text-center">Comprometido</th>
                  <th className="px-6 py-3 text-center">Disponible</th>
                  <th className="px-6 py-3 text-right">Valor Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStock.length === 0 ? (
                    <tr>
                      <td colSpan={selectedCompanyId === 'all' ? 7 : 6} className="px-6 py-8 text-center text-gray-500">
                        No se encontraron items.
                      </td>
                    </tr>
                ) : filteredStock.map((product) => {
                  const committed = Math.floor(product.stock * 0.1); // Mock calculation
                  const available = product.stock - committed;
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 font-bold text-xs">
                             IMG
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-blue-600 font-mono">SKU: {product.sku}</div>
                          </div>
                        </div>
                      </td>
                      {selectedCompanyId === 'all' && (
                        <td className="px-6 py-4">
                           <CompanyBadge companyId={product.companyId} />
                        </td>
                      )}
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-gray-400" />
                          {getMockLocation(product.id)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className="font-medium text-gray-900">{product.stock}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-500">
                         {committed}
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`font-bold ${available < 20 ? 'text-orange-600' : 'text-green-600'}`}>
                           {available}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">
                         ${(product.stock * product.price).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* MOVEMENTS TAB CONTENT */}
        {activeTab === 'movements' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Fecha / Hora</th>
                  {selectedCompanyId === 'all' && <th className="px-6 py-3">Empresa</th>}
                  <th className="px-6 py-3">Producto</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3 text-center">Cantidad</th>
                  <th className="px-6 py-3">Razón</th>
                  <th className="px-6 py-3">Usuario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {movement.date}
                       </div>
                    </td>
                    {selectedCompanyId === 'all' && (
                        <td className="px-6 py-4">
                           <CompanyBadge companyId={movement.companyId} />
                        </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{movement.productName}</div>
                      <div className="text-xs text-gray-500 font-mono">{movement.sku}</div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <MovementIcon type={movement.type} />
                          <MovementBadge type={movement.type} />
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold ${['out', 'adjustment'].includes(movement.type) ? 'text-red-600' : 'text-green-600'}`}>
                        {['out'].includes(movement.type) || (movement.type === 'adjustment' && movement.quantity < 0) ? '' : '+'}
                        {movement.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {movement.reason}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      <div className="bg-gray-100 px-2 py-1 rounded inline-block">
                        {movement.user}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
             {filteredMovements.length === 0 && (
                <div className="p-12 text-center text-gray-400">
                  No se encontraron movimientos.
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};
