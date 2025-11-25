
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  MapPin, 
  Calendar,
  History,
  Box,
  ArrowUpCircle,
  ArrowDownCircle,
  RotateCcw,
  Settings2,
  Plus,
  X,
  Save,
  FilePlus,
  ClipboardList,
  MoreHorizontal
} from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_STOCK_MOVEMENTS, COMPANIES } from '../constants';
import { Status, Product, StockMovement, MovementType } from '../types';
import { useCompany } from '../CompanyContext';

// Helper to generate a fake location based on ID
const getMockLocation = (id: string) => {
  const aisle = id.charCodeAt(id.length - 1) % 5 + 1;
  const shelf = id.charCodeAt(id.length - 2) % 4 + 1; 
  return `Aisle ${aisle} - Shelf ${shelf}`;
};

const MovementBadge = ({ type }: { type: MovementType }) => {
  const styles = {
    in: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    out: 'text-blue-700 bg-blue-50 border-blue-100',
    adjustment: 'text-amber-700 bg-amber-50 border-amber-100',
    return: 'text-purple-700 bg-purple-50 border-purple-100',
  };
  
  const labels = {
    in: 'In',
    out: 'Out',
    adjustment: 'Adjustment',
    return: 'Return'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${styles[type]}`}>
      {labels[type]}
    </span>
  );
};

const CompanyBadge = ({ companyId }: { companyId: string }) => {
  const company = COMPANIES.find(c => c.id === companyId);
  if (!company) return null;
  return (
    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-zinc-200 text-zinc-600 bg-zinc-50">
      {company.logo}
    </span>
  );
};

// --- Modal de Gestión de Inventario ---
interface InventoryManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const InventoryManageModal: React.FC<InventoryManageModalProps> = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'movement' | 'new_item'>('movement');
  const [formData, setFormData] = useState({
    productId: '',
    movementType: 'in',
    quantity: '',
    reason: '',
    itemName: '',
    itemSku: '',
    itemCategory: 'Colchones',
    initialStock: '',
    location: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-medusa w-full max-w-lg transform transition-all scale-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white">
          <h3 className="font-semibold text-sm text-zinc-900">Inventory Management</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-zinc-100">
           <button 
             onClick={() => setActiveTab('movement')}
             className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors ${activeTab === 'movement' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
           >
              Register Movement
           </button>
           <button 
             onClick={() => setActiveTab('new_item')}
             className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors ${activeTab === 'new_item' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
           >
              New Item
           </button>
        </div>

        <div className="p-6 overflow-y-auto bg-white">
           {activeTab === 'movement' && (
             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-medium text-zinc-500 mb-1.5">Product</label>
                   <select 
                     className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white"
                     value={formData.productId}
                     onChange={(e) => setFormData({...formData, productId: e.target.value})}
                   >
                      <option value="">Select product...</option>
                      {MOCK_PRODUCTS.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.stock} in stock)</option>
                      ))}
                   </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5">Type</label>
                      <select 
                        className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white"
                        value={formData.movementType}
                        onChange={(e) => setFormData({...formData, movementType: e.target.value})}
                      >
                         <option value="in">In (+)</option>
                         <option value="out">Out (-)</option>
                         <option value="adjustment">Adjustment (=)</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5">Quantity</label>
                      <input 
                        type="number" 
                        className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                        placeholder="0"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-medium text-zinc-500 mb-1.5">Reason / Note</label>
                   <textarea 
                     className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 resize-none"
                     rows={3}
                     placeholder="Optional note..."
                     value={formData.reason}
                     onChange={(e) => setFormData({...formData, reason: e.target.value})}
                   />
                </div>
             </div>
           )}

           {activeTab === 'new_item' && (
             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-medium text-zinc-500 mb-1.5">Item Name</label>
                   <input 
                     type="text" 
                     className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                     value={formData.itemName}
                     onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                   />
                </div>
                {/* Additional inputs simplified for brevity */}
             </div>
           )}
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 border border-zinc-200 rounded-md text-sm font-medium text-zinc-700 hover:bg-white bg-white shadow-sm">Cancel</button>
           <button 
             onClick={() => onSave({ type: activeTab, ...formData })}
             className="px-4 py-2 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 shadow-sm"
           >
              Save
           </button>
        </div>
      </div>
    </div>
  );
};

export const Inventory: React.FC = () => {
  const { selectedCompanyId } = useCompany();
  const [activeTab, setActiveTab] = useState<'stock' | 'movements'>('stock');
  const [searchTerm, setSearchTerm] = useState('');
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

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

  // Filtering Logic
  const filteredStock = useMemo(() => {
    return companyProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, companyProducts]);

  const filteredMovements = useMemo(() => {
    return companyMovements.filter(m => 
      m.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, companyMovements]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Inventory</h2>
          <p className="text-xs text-zinc-500 mt-1">Manage stock levels and locations.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsManageModalOpen(true)}
            className="bg-zinc-900 hover:bg-zinc-800 text-white px-3 py-2 rounded-md text-xs font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus size={14} />
            Manage Stock
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm min-h-[500px]">
        <div className="flex flex-col border-b border-zinc-200">
           {/* Search & Filters Toolbar */}
           <div className="p-4 flex justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="Search products, SKU..." 
                   className="w-full pl-8 pr-3 py-1.5 border border-zinc-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                 />
              </div>
              
              {/* Tabs integrated in toolbar right side */}
              <div className="flex gap-4">
                 <button
                    onClick={() => setActiveTab('stock')}
                    className={`text-xs font-medium transition-colors ${activeTab === 'stock' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                 >
                    Stock
                 </button>
                 <button
                    onClick={() => setActiveTab('movements')}
                    className={`text-xs font-medium transition-colors ${activeTab === 'movements' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                 >
                    Activity
                 </button>
              </div>
           </div>
        </div>

        {/* STOCK TAB CONTENT */}
        {activeTab === 'stock' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-50/50 border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Product</th>
                  {selectedCompanyId === 'all' && <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Store</th>}
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider text-right">In Stock</th>
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider text-right">Reserved</th>
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider text-right">Available</th>
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredStock.map((product) => {
                  const committed = Math.floor(product.stock * 0.1);
                  const available = product.stock - committed;
                  
                  return (
                    <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-zinc-100 rounded border border-zinc-200 flex items-center justify-center text-zinc-400">
                             <Package size={14} />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-zinc-900">{product.name}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">{product.sku}</div>
                          </div>
                        </div>
                      </td>
                      {selectedCompanyId === 'all' && (
                        <td className="px-6 py-3">
                           <CompanyBadge companyId={product.companyId} />
                        </td>
                      )}
                      <td className="px-6 py-3 text-xs text-zinc-600">
                        {getMockLocation(product.id)}
                      </td>
                      <td className="px-6 py-3 text-right text-xs font-medium text-zinc-900">
                         {product.stock}
                      </td>
                      <td className="px-6 py-3 text-right text-xs text-zinc-500">
                         {committed}
                      </td>
                      <td className="px-6 py-3 text-right text-xs font-medium text-emerald-600">
                         {available}
                      </td>
                      <td className="px-6 py-3 text-right">
                         <button className="text-zinc-400 hover:text-zinc-600 p-1">
                            <MoreHorizontal size={16} />
                         </button>
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
            <table className="w-full text-left">
              <thead className="bg-zinc-50/50 border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider text-right">Quantity</th>
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-3 text-xs text-zinc-500 whitespace-nowrap">
                       {movement.date}
                    </td>
                    <td className="px-6 py-3 text-xs text-zinc-900">
                      {movement.productName}
                    </td>
                    <td className="px-6 py-3">
                       <MovementBadge type={movement.type} />
                    </td>
                    <td className="px-6 py-3 text-right text-xs font-medium text-zinc-900">
                      {['out', 'adjustment'].includes(movement.type) ? '-' : '+'}{Math.abs(movement.quantity)}
                    </td>
                    <td className="px-6 py-3 text-xs text-zinc-500">
                      {movement.user}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InventoryManageModal 
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        onSave={() => { setIsManageModalOpen(false); alert('Saved'); }}
      />
    </div>
  );
};
