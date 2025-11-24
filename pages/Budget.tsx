
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw, 
  TrendingUp, 
  Truck, 
  Package,
  Users,
  PieChart as PieChartIcon,
  Search,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  X
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MOCK_PRODUCTS, COMPANIES } from '../constants';
import { Product } from '../types';
import { useCompany } from '../CompanyContext';

interface MaterialItem {
  id: string;
  name: string;
  cost: number;
}

const CompanyBadge = ({ companyId }: { companyId: string }) => {
  const company = COMPANIES.find(c => c.id === companyId);
  if (!company) return null;
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${company.color} opacity-80`}>
      {company.logo}
    </span>
  );
};

export const Budget: React.FC = () => {
  const { selectedCompanyId } = useCompany();

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Estados para Materia Prima
  const [materials, setMaterials] = useState<MaterialItem[]>([
    { id: '1', name: 'Material Base Estándar', cost: 15.00 },
  ]);
  const [newMaterialName, setNewMaterialName] = useState('');
  const [newMaterialCost, setNewMaterialCost] = useState('');

  // Estados para Costos Fijos y Variables
  const [costs, setCosts] = useState({
    supplier: 0, 
    labor: 0,    
    shipping: 0,  
    packaging: 0, 
    taxRate: 21      
  });

  // Estrategia de Precios
  const [targetMargin, setTargetMargin] = useState(30); // % de margen deseado

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Products based on Company and Search
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    
    return MOCK_PRODUCTS.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCompany = selectedCompanyId === 'all' || p.companyId === selectedCompanyId;
        
        return matchesSearch && matchesCompany;
    });
  }, [searchTerm, selectedCompanyId]);

  // Load Product into Calculator
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm('');
    setIsSearchOpen(false);

    // Simulación de estructura de costos basada en el precio del producto (Reverse Engineering mock)
    // Asumimos que el costo es aprox el 60% del precio actual para llenar los campos
    const estimatedTotalCost = product.price * 0.6; 
    
    setMaterials([
      { id: Date.now().toString(), name: 'Material Principal', cost: Number((estimatedTotalCost * 0.4).toFixed(2)) },
      { id: (Date.now() + 1).toString(), name: 'Material Secundario', cost: Number((estimatedTotalCost * 0.1).toFixed(2)) }
    ]);

    setCosts({
      supplier: Number((estimatedTotalCost * 0.2).toFixed(2)),
      labor: Number((estimatedTotalCost * 0.15).toFixed(2)),
      shipping: 10.00,
      packaging: 5.00,
      taxRate: 21
    });

    // Reset margin to a default to see what the calc says vs real price
    setTargetMargin(30);
  };

  const handleReset = () => {
    setSelectedProduct(null);
    setMaterials([{ id: '1', name: 'Material Base Estándar', cost: 15.00 }]);
    setCosts({ supplier: 0, labor: 0, shipping: 0, packaging: 0, taxRate: 21 });
    setTargetMargin(30);
  };

  // --- Cálculos ---

  // 1. Total Materia Prima
  const totalMaterials = useMemo(() => materials.reduce((sum, item) => sum + item.cost, 0), [materials]);

  // 2. Costo Producto (Materiales + Proveedor + Mano de obra)
  const productCost = totalMaterials + costs.supplier + costs.labor;

  // 3. Costo Total Unitario (Producto + Logística)
  const totalUnitCost = productCost + costs.shipping + costs.packaging;

  // 4. Precio Sugerido
  const suggestedPrice = useMemo(() => {
    const marginDecimal = targetMargin / 100;
    if (marginDecimal >= 1) return 0;
    return totalUnitCost / (1 - marginDecimal);
  }, [totalUnitCost, targetMargin]);

  // 5. Beneficio Neto Calculado
  const netProfit = suggestedPrice - totalUnitCost;

  // 6. Precio con IVA
  const priceWithTax = suggestedPrice * (1 + costs.taxRate / 100);

  // 7. Comparativa con precio real (si existe producto seleccionado)
  const currentProfitMargin = selectedProduct 
    ? ((selectedProduct.price - totalUnitCost) / selectedProduct.price) * 100 
    : 0;

  // --- Handlers ---
  const addMaterial = () => {
    if (!newMaterialName || !newMaterialCost) return;
    setMaterials([...materials, { id: Date.now().toString(), name: newMaterialName, cost: Number(newMaterialCost) }]);
    setNewMaterialName('');
    setNewMaterialCost('');
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  // Datos para la gráfica
  const chartData = [
    { name: 'Materiales', value: totalMaterials },
    { name: 'Manufactura', value: costs.supplier + costs.labor },
    { name: 'Logística', value: costs.shipping + costs.packaging },
    { name: 'Margen', value: netProfit },
  ];
  
  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER & SEARCH */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Calculadora de Costos</h2>
            <p className="text-sm text-gray-500">
               {selectedCompanyId === 'all' 
                 ? 'Busca productos de cualquier empresa para auditar costos.' 
                 : 'Busca productos de la empresa activa para auditar costos.'}
            </p>
          </div>
          <div className="flex gap-2">
             <button onClick={handleReset} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2">
               <RefreshCw size={16} /> Nuevo Cálculo
             </button>
             <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
               <Save size={16} /> Guardar Cambios
             </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative max-w-2xl" ref={searchRef}>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                value={searchTerm}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Buscar producto por nombre o SKU..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
           </div>

           {/* DROPDOWN RESULTS */}
           {isSearchOpen && searchTerm && (
             <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto z-50 divide-y divide-gray-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => handleSelectProduct(p)}
                      className="flex items-center gap-4 p-4 hover:bg-blue-50 cursor-pointer transition-colors group"
                    >
                       <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          <Package size={20} />
                       </div>
                       <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-primary-700 flex items-center gap-2">
                            {p.name}
                            {selectedCompanyId === 'all' && <CompanyBadge companyId={p.companyId} />}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                             <span className="font-mono">SKU: {p.sku}</span>
                             <span>Stock: {p.stock}</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="block font-bold text-gray-900">${p.price.toFixed(2)}</span>
                          <span className="text-xs text-gray-500">Precio Actual</span>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">No se encontraron productos.</div>
                )}
             </div>
           )}
        </div>

        {/* SELECTED PRODUCT CONTEXT */}
        {selectedProduct && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between animate-in fade-in">
             <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <CheckCircle className="text-blue-600" size={20} />
                </div>
                <div>
                   <h3 className="font-bold text-blue-900 flex items-center gap-2">
                     Editando: {selectedProduct.name}
                     <CompanyBadge companyId={selectedProduct.companyId} />
                   </h3>
                   <p className="text-sm text-blue-700">SKU: {selectedProduct.sku}</p>
                </div>
             </div>
             <div className="text-right">
                <span className="text-xs text-blue-600 uppercase font-bold tracking-wider">Precio Actual</span>
                <p className="text-2xl font-bold text-blue-900">${selectedProduct.price.toFixed(2)}</p>
             </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: INPUTS DE COSTOS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Materia Prima */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} className="text-blue-500"/> Materia Prima
            </h3>
            
            <div className="space-y-3 mb-4">
              {materials.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-900">${item.cost.toFixed(2)}</span>
                    <button onClick={() => removeMaterial(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Item Form */}
            <div className="flex gap-2 items-end pt-2 border-t border-gray-100">
               <div className="flex-1">
                 <label className="text-xs text-gray-500 mb-1 block">Item</label>
                 <input 
                    type="text" 
                    placeholder="Ej. Madera, Tela..."
                    value={newMaterialName}
                    onChange={(e) => setNewMaterialName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                 />
               </div>
               <div className="w-32">
                 <label className="text-xs text-gray-500 mb-1 block">Costo ($)</label>
                 <input 
                    type="number" 
                    placeholder="0.00"
                    value={newMaterialCost}
                    onChange={(e) => setNewMaterialCost(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                 />
               </div>
               <button 
                 onClick={addMaterial}
                 className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800 transition-colors h-[38px] w-[38px] flex items-center justify-center"
               >
                 <Plus size={20} />
               </button>
            </div>
          </div>

          {/* 2. Costos Operativos y Logísticos */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
               <TrendingUp size={20} className="text-purple-500"/> Costos Operativos y Logística
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                     <Users size={14} /> Costo Proveedor / Manufactura
                   </label>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input 
                        type="number" 
                        value={costs.supplier}
                        onChange={(e) => setCosts({...costs, supplier: Number(e.target.value)})}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
                      />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Mano de Obra Interna</label>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input 
                        type="number" 
                        value={costs.labor}
                        onChange={(e) => setCosts({...costs, labor: Number(e.target.value)})}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
                      />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Truck size={14} /> Envío Unitario
                   </label>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input 
                        type="number" 
                        value={costs.shipping}
                        onChange={(e) => setCosts({...costs, shipping: Number(e.target.value)})}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
                      />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Packaging / Caja</label>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input 
                        type="number" 
                        value={costs.packaging}
                        onChange={(e) => setCosts({...costs, packaging: Number(e.target.value)})}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
                      />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: RESULTADOS */}
        <div className="space-y-6">
           
           {/* Tarjeta de Margen y Precio */}
           <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden sticky top-6">
              <div className="p-6 bg-gray-900 text-white">
                <h3 className="text-lg font-bold flex items-center gap-2">
                   <Calculator size={20} /> Resultado
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                   <span className="text-4xl font-bold tracking-tight">${suggestedPrice.toFixed(2)}</span>
                   <span className="text-gray-400 text-sm">/ Precio Sugerido</span>
                </div>
                
                {selectedProduct && (
                  <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block">Precio Actual en Tienda</span>
                      <span className="text-lg font-bold">${selectedProduct.price.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">Diferencia</span>
                      <span className={`text-lg font-bold flex items-center gap-1 ${selectedProduct.price < totalUnitCost ? 'text-red-400' : (selectedProduct.price >= suggestedPrice ? 'text-green-400' : 'text-yellow-400')}`}>
                         {selectedProduct.price >= suggestedPrice ? <TrendingUp size={16} /> : <AlertCircle size={16} />}
                         {selectedProduct.price >= suggestedPrice ? 'Rentable' : 'Ajustar'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 space-y-6">
                 {/* Control de Margen */}
                 <div>
                    <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                       <span>Margen Objetivo</span>
                       <span className="text-primary-600">{targetMargin}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="90" 
                      value={targetMargin}
                      onChange={(e) => setTargetMargin(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    {selectedProduct && (
                      <p className="text-xs text-gray-500 mt-2">
                         Con el precio actual (${selectedProduct.price}), tu margen real es del <span className={`font-bold ${currentProfitMargin < 20 ? 'text-red-500' : 'text-green-600'}`}>{currentProfitMargin.toFixed(1)}%</span>.
                      </p>
                    )}
                 </div>
                 
                 <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-600">Costo Directo Total</span>
                       <span className="font-medium">${totalUnitCost.toFixed(2)}</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex justify-between items-center">
                       <span className="text-sm font-medium text-green-800">Ganancia Neta Estimada</span>
                       <span className="text-lg font-bold text-green-600">+${netProfit.toFixed(2)}</span>
                    </div>
                 </div>

                 {/* Gráfica Mini */}
                 <div className="pt-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Desglose</h4>
                    <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={55}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-[-10px]">
                       {chartData.map((entry, index) => (
                         <div key={index} className="flex items-center gap-1 text-[10px] text-gray-500">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                           {entry.name}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};
