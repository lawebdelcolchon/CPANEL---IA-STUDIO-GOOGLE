
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Factory, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Truck, 
  Calendar,
  Package,
  AlertTriangle,
  X,
  Save,
  Trash2,
  Edit2,
  MoreHorizontal
} from 'lucide-react';
import { MOCK_SUPPLIER_ORDERS, COMPANIES } from '../constants';
import { useCompany } from '../CompanyContext';
import { SupplierOrder } from '../types';

const CompanyBadge = ({ companyId }: { companyId: string }) => {
  const company = COMPANIES.find(c => c.id === companyId);
  if (!company) return null;
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${company.color} opacity-80`}>
      {company.logo}
    </span>
  );
};

// --- Modal para Nuevo Pedido a Proveedor ---
interface NewSupplierOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Partial<SupplierOrder>) => void;
  selectedCompanyId: string;
}

const NewSupplierOrderModal: React.FC<NewSupplierOrderModalProps> = ({ isOpen, onClose, onSave, selectedCompanyId }) => {
  const [formData, setFormData] = useState({
    supplierName: '',
    productName: '',
    sku: '',
    contractedQty: '',
    availableQty: '0',
    purchaseDate: new Date().toISOString().split('T')[0],
    expectedDate: '',
    status: 'Pendiente',
    companyId: selectedCompanyId === 'all' ? COMPANIES[0].id : selectedCompanyId
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.supplierName || !formData.productName || !formData.contractedQty) return;
    
    onSave({
      ...formData,
      contractedQty: Number(formData.contractedQty),
      availableQty: Number(formData.availableQty),
      status: formData.status as any
    });
    onClose();
    // Reset form
    setFormData({
      supplierName: '',
      productName: '',
      sku: '',
      contractedQty: '',
      availableQty: '0',
      purchaseDate: new Date().toISOString().split('T')[0],
      expectedDate: '',
      status: 'Pendiente',
      companyId: selectedCompanyId === 'all' ? COMPANIES[0].id : selectedCompanyId
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all scale-100 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Plus size={18} className="text-primary-600"/> Nuevo Pedido a Proveedor
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
            <input 
              type="text" 
              value={formData.supplierName}
              onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Ej. Textiles del Norte"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
              <input 
                type="text" 
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Nombre del material"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU / Ref</label>
              <input 
                type="text" 
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="MAT-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cant. Contratada</label>
              <input 
                type="number" 
                value={formData.contractedQty}
                onChange={(e) => setFormData({...formData, contractedQty: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cant. Recibida (Inicial)</label>
              <input 
                type="number" 
                value={formData.availableQty}
                onChange={(e) => setFormData({...formData, availableQty: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Compra</label>
                <input 
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Esperada</label>
                <input 
                  type="date"
                  value={formData.expectedDate}
                  onChange={(e) => setFormData({...formData, expectedDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
             <select 
               value={formData.status}
               onChange={(e) => setFormData({...formData, status: e.target.value})}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
             >
                <option value="Pendiente">Pendiente</option>
                <option value="Parcial">Parcial</option>
                <option value="Completo">Completo</option>
                <option value="Retrasado">Retrasado</option>
             </select>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
             Cancelar
           </button>
           <button 
             onClick={handleSubmit}
             disabled={!formData.supplierName || !formData.productName || !formData.contractedQty}
             className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <Save size={16} /> Guardar Pedido
           </button>
        </div>
      </div>
    </div>
  );
};

// --- Modal de Detalle y Gestión del Proveedor ---
interface SupplierDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierName: string;
  orders: SupplierOrder[];
  onUpdateOrder: (id: string, field: keyof SupplierOrder, value: any) => void;
  onDeleteOrder: (id: string) => void;
}

const SupplierDetailModal: React.FC<SupplierDetailModalProps> = ({ isOpen, onClose, supplierName, orders, onUpdateOrder, onDeleteOrder }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl transform transition-all scale-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Factory className="text-primary-600" /> {supplierName}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Gestión de productos relacionados y control de stock</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
           
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
             <table className="w-full text-left text-sm">
               <thead className="bg-gray-100 text-gray-600 font-medium uppercase text-xs">
                 <tr>
                   <th className="px-4 py-3">ID / SKU</th>
                   <th className="px-4 py-3">Producto</th>
                   <th className="px-4 py-3 text-center">Contratado</th>
                   <th className="px-4 py-3 text-center">Disponible</th>
                   <th className="px-4 py-3 text-center">Fecha Compra</th>
                   <th className="px-4 py-3">Estado</th>
                   <th className="px-4 py-3 text-right">Acciones</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {orders.map((order) => (
                   <tr key={order.id} className="group hover:bg-blue-50/30 transition-colors">
                     <td className="px-4 py-3">
                        <div className="font-bold text-gray-900 text-xs">{order.id}</div>
                        <div className="text-xs text-gray-500 font-mono">{order.sku}</div>
                     </td>
                     <td className="px-4 py-3 font-medium text-gray-800">
                        {order.productName}
                     </td>
                     <td className="px-4 py-3 text-center">
                        <input 
                           type="number"
                           value={order.contractedQty}
                           onChange={(e) => onUpdateOrder(order.id, 'contractedQty', Number(e.target.value))}
                           className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-primary-500 focus:border-primary-500"
                        />
                     </td>
                     <td className="px-4 py-3 text-center">
                        <input 
                           type="number"
                           value={order.availableQty}
                           onChange={(e) => onUpdateOrder(order.id, 'availableQty', Number(e.target.value))}
                           className={`w-20 px-2 py-1 border rounded text-center text-sm focus:ring-primary-500 focus:border-primary-500 ${order.availableQty < order.contractedQty ? 'border-orange-300 bg-orange-50 text-orange-900' : 'border-gray-300'}`}
                        />
                     </td>
                     <td className="px-4 py-3 text-center">
                        <input 
                           type="date"
                           value={order.purchaseDate}
                           onChange={(e) => onUpdateOrder(order.id, 'purchaseDate', e.target.value)}
                           className="px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-primary-500 focus:border-primary-500 bg-transparent"
                        />
                     </td>
                     <td className="px-4 py-3">
                        <select 
                           value={order.status}
                           onChange={(e) => onUpdateOrder(order.id, 'status', e.target.value)}
                           className={`text-xs font-bold rounded-full px-2 py-1 border cursor-pointer outline-none appearance-none ${
                                 order.status === 'Completo' ? 'bg-green-50 text-green-700 border-green-200' :
                                 order.status === 'Parcial' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                 order.status === 'Pendiente' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                 'bg-red-50 text-red-700 border-red-200'
                           }`}
                        >
                           <option value="Pendiente">Pendiente</option>
                           <option value="Parcial">Parcial</option>
                           <option value="Completo">Completo</option>
                           <option value="Retrasado">Retrasado</option>
                        </select>
                     </td>
                     <td className="px-4 py-3 text-right">
                        <button 
                           onClick={() => {
                              if (window.confirm('¿Estás seguro de eliminar este registro?')) {
                                 onDeleteOrder(order.id);
                              }
                           }}
                           className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                           title="Eliminar registro"
                        >
                           <Trash2 size={16} />
                        </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             {orders.length === 0 && (
                <div className="p-8 text-center text-gray-500">No hay pedidos asociados a este proveedor.</div>
             )}
           </div>

           <div className="mt-4 flex gap-2 items-start text-xs text-gray-500">
              <AlertCircle size={14} className="mt-0.5" />
              <p>Los cambios en cantidades y estados se guardan automáticamente en la sesión actual. Para eliminar un pedido, usa el icono de papelera.</p>
           </div>
        </div>

        <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end">
           <button onClick={onClose} className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black shadow-lg">
             Cerrar Panel
           </button>
        </div>
      </div>
    </div>
  );
};

export const Suppliers: React.FC = () => {
  const { selectedCompanyId } = useCompany();
  const [orders, setOrders] = useState<SupplierOrder[]>(MOCK_SUPPLIER_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for Detail Modal
  const [selectedSupplierName, setSelectedSupplierName] = useState<string | null>(null);

  // Filtrado de datos según empresa y búsqueda
  const filteredOrders = useMemo(() => {
    let data = selectedCompanyId === 'all' 
      ? orders 
      : orders.filter(o => o.companyId === selectedCompanyId);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(o => 
        o.supplierName.toLowerCase().includes(term) ||
        o.productName.toLowerCase().includes(term) ||
        o.sku.toLowerCase().includes(term)
      );
    }
    return data;
  }, [selectedCompanyId, searchTerm, orders]);

  // Grouped orders for the selected supplier (to display in modal)
  const ordersForSelectedSupplier = useMemo(() => {
    if (!selectedSupplierName) return [];
    // If viewing 'all', show all orders for that supplier. If specific company selected, filter by that too.
    return orders.filter(o => 
        o.supplierName === selectedSupplierName && 
        (selectedCompanyId === 'all' || o.companyId === selectedCompanyId)
    );
  }, [orders, selectedSupplierName, selectedCompanyId]);

  // Cálculos de KPI
  const stats = useMemo(() => {
    const totalContracted = filteredOrders.reduce((acc, o) => acc + o.contractedQty, 0);
    const totalAvailable = filteredOrders.reduce((acc, o) => acc + o.availableQty, 0);
    const pendingOrders = filteredOrders.filter(o => o.status === 'Pendiente' || o.status === 'Parcial').length;
    const criticalItems = filteredOrders.filter(o => o.contractedQty > o.availableQty).length;

    return { totalContracted, totalAvailable, pendingOrders, criticalItems };
  }, [filteredOrders]);

  // Manejador de Exportación CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Empresa ID', 'Proveedor', 'Producto', 'SKU', 'Contratado', 'Disponible', 'Fecha Compra', 'Estado'];
    const rows = filteredOrders.map(o => [
      o.id,
      o.companyId,
      `"${o.supplierName}"`,
      `"${o.productName}"`,
      o.sku,
      o.contractedQty,
      o.availableQty,
      o.purchaseDate,
      o.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `proveedores_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Manejador para Guardar Nuevo Pedido
  const handleSaveOrder = (newOrderData: Partial<SupplierOrder>) => {
    const newOrder: SupplierOrder = {
      id: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
      companyId: newOrderData.companyId || 'c1',
      supplierName: newOrderData.supplierName || 'Desconocido',
      productName: newOrderData.productName || 'Producto',
      sku: newOrderData.sku || 'GEN-000',
      contractedQty: newOrderData.contractedQty || 0,
      availableQty: newOrderData.availableQty || 0,
      purchaseDate: newOrderData.purchaseDate || new Date().toISOString().split('T')[0],
      expectedDate: newOrderData.expectedDate,
      status: newOrderData.status || 'Pendiente'
    };

    setOrders([newOrder, ...orders]);
  };

  // Handlers for Detail Modal Management
  const handleUpdateOrder = (id: string, field: keyof SupplierOrder, value: any) => {
     setOrders(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const handleDeleteOrder = (id: string) => {
     setOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleRowClick = (supplierName: string) => {
     setSelectedSupplierName(supplierName);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <Factory className="text-gray-600" /> Proveedores
          </h2>
          <p className="text-sm text-gray-500">Gestión de aprovisionamiento y control de stock contratado.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2"
          >
            <Download size={16} /> Exportar CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus size={16} /> Nuevo Pedido
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Contratado</h3>
           <div className="flex items-center gap-2">
              <Package size={24} className="text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">{stats.totalContracted.toLocaleString()}</span>
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock Disponible</h3>
           <div className="flex items-center gap-2">
              <CheckCircle size={24} className="text-green-500" />
              <span className="text-2xl font-bold text-gray-900">{stats.totalAvailable.toLocaleString()}</span>
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Items Faltantes</h3>
           <div className="flex items-center gap-2">
              <AlertTriangle size={24} className="text-red-500" />
              <span className="text-2xl font-bold text-gray-900">{stats.criticalItems}</span>
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Entregas Pendientes</h3>
           <div className="flex items-center gap-2">
              <Truck size={24} className="text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</span>
           </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         {/* Toolbar */}
         <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4 bg-gray-50/50">
            <div className="flex gap-2 flex-1">
               <div className="relative flex-1 sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar proveedor, producto o SKU..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  <Filter size={16} /> Filtros
               </button>
            </div>
         </div>

         {/* Table Content */}
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                  <tr>
                     <th className="px-6 py-3">Proveedor</th>
                     {selectedCompanyId === 'all' && <th className="px-6 py-3">Empresa</th>}
                     <th className="px-6 py-3">Producto / SKU</th>
                     <th className="px-6 py-3 text-center">Contratado vs Disponible</th>
                     <th className="px-6 py-3 text-center">Faltante</th>
                     <th className="px-6 py-3">Fecha Compra</th>
                     <th className="px-6 py-3 text-center">Estado</th>
                     <th className="px-6 py-3 text-right"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {filteredOrders.length === 0 ? (
                     <tr>
                        <td colSpan={selectedCompanyId === 'all' ? 8 : 7} className="px-6 py-12 text-center text-gray-400">
                           No se encontraron registros de proveedores.
                        </td>
                     </tr>
                  ) : filteredOrders.map((order) => {
                     const missing = order.contractedQty - order.availableQty;
                     const progress = Math.min((order.availableQty / order.contractedQty) * 100, 100);
                     
                     return (
                        <tr 
                          key={order.id} 
                          className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                          onClick={() => handleRowClick(order.supplierName)}
                        >
                           <td className="px-6 py-4 font-medium text-primary-600 group-hover:text-primary-700">
                              {order.supplierName}
                              <div className="text-[10px] text-gray-400 font-normal mt-0.5">{order.id}</div>
                           </td>
                           {selectedCompanyId === 'all' && (
                              <td className="px-6 py-4">
                                 <CompanyBadge companyId={order.companyId} />
                              </td>
                           )}
                           <td className="px-6 py-4">
                              <div className="text-gray-900 font-medium">{order.productName}</div>
                              <div className="text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded w-fit mt-1">{order.sku}</div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2 mb-1 justify-center text-xs">
                                 <span className="font-bold">{order.availableQty}</span>
                                 <span className="text-gray-400">/</span>
                                 <span className="text-gray-600">{order.contractedQty}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                 <div 
                                    className={`h-full rounded-full ${missing > 0 ? 'bg-orange-500' : 'bg-green-500'}`} 
                                    style={{ width: `${progress}%` }}
                                 ></div>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-center">
                              {missing > 0 ? (
                                 <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-1 rounded-full text-xs">
                                    <AlertTriangle size={12} /> -{missing}
                                 </span>
                              ) : (
                                 <span className="text-green-600 font-bold text-xs flex items-center justify-center gap-1">
                                    <CheckCircle size={12} /> OK
                                 </span>
                              )}
                           </td>
                           <td className="px-6 py-4 text-gray-600">
                              <div className="flex items-center gap-1">
                                 <Calendar size={14} className="text-gray-400" />
                                 {order.purchaseDate}
                              </div>
                              {order.expectedDate && missing > 0 && (
                                 <div className="text-[10px] text-orange-600 mt-1 font-medium">
                                    Esp: {order.expectedDate}
                                 </div>
                              )}
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                 order.status === 'Completo' ? 'bg-green-50 text-green-700 border-green-200' :
                                 order.status === 'Parcial' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                 order.status === 'Pendiente' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                 'bg-red-50 text-red-700 border-red-200'
                              }`}>
                                 {order.status === 'Completo' && <CheckCircle size={12} />}
                                 {order.status === 'Parcial' && <AlertCircle size={12} />}
                                 {order.status === 'Pendiente' && <Clock size={12} />}
                                 {order.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <MoreHorizontal size={16} className="text-gray-400" />
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>

      {/* Modal Component Instance for New Orders */}
      <NewSupplierOrderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOrder}
        selectedCompanyId={selectedCompanyId}
      />

      {/* Detail Modal Component Instance */}
      <SupplierDetailModal 
        isOpen={!!selectedSupplierName}
        onClose={() => setSelectedSupplierName(null)}
        supplierName={selectedSupplierName || ''}
        orders={ordersForSelectedSupplier}
        onUpdateOrder={handleUpdateOrder}
        onDeleteOrder={handleDeleteOrder}
      />
    </div>
  );
};
