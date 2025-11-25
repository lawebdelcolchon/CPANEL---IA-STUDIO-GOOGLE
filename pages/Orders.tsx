
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Filter, 
  Plus, 
  Search, 
  X, 
  Check, 
  Clock, 
  MapPin, 
  CreditCard, 
  User, 
  Package, 
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Truck,
  Calendar,
  Save,
  Edit2,
  FileText,
  Download,
  Printer,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  Copy,
  Mail,
  Send,
  Store,
  Globe,
  ShoppingBag,
  Building,
  Link as LinkIcon,
  Star,
  PackageCheck,
  Timer,
  AlertOctagon,
  ChevronDown,
  FileSpreadsheet,
  MoreHorizontal
} from 'lucide-react';
import { MOCK_ORDERS, COMPANIES } from '../constants';
import { Status, Order } from '../types';
import { useCompany } from '../CompanyContext';

// --- Components Helper: Toast Notification ---
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ToastNotification = ({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: number) => void }) => (
  <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
    {toasts.map((toast) => (
      <div 
        key={toast.id}
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-md shadow-medusa border transform transition-all duration-300 animate-in slide-in-from-right-full bg-white text-sm ${
          toast.type === 'success' ? 'border-emerald-100 text-emerald-800' :
          toast.type === 'error' ? 'border-red-100 text-red-800' :
          'border-zinc-200 text-zinc-800'
        }`}
      >
        {toast.type === 'success' && <CheckCircle size={16} className="text-emerald-500" />}
        {toast.type === 'error' && <AlertCircle size={16} className="text-red-500" />}
        {toast.type === 'info' && <Clock size={16} className="text-zinc-500" />}
        <span className="font-medium">{toast.message}</span>
        <button onClick={() => removeToast(toast.id)} className="ml-4 text-zinc-400 hover:text-zinc-600">
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

// --- Component: Status Badge ---
const StatusBadge = ({ status }: { status: Status }) => {
  const styles = {
    [Status.Active]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    [Status.Completed]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    [Status.Pending]: 'bg-amber-50 text-amber-700 border-amber-200',
    [Status.Cancelled]: 'bg-red-50 text-red-700 border-red-200',
    [Status.Inactive]: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    [Status.Hidden]: 'bg-zinc-50 text-zinc-500 border-zinc-200',
    [Status.Featured]: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  // Dot color
  const dotColors = {
    [Status.Active]: 'bg-emerald-500',
    [Status.Completed]: 'bg-emerald-500',
    [Status.Pending]: 'bg-amber-500',
    [Status.Cancelled]: 'bg-red-500',
    [Status.Inactive]: 'bg-zinc-400',
    [Status.Hidden]: 'bg-zinc-400',
    [Status.Featured]: 'bg-purple-500',
  };

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border border-transparent bg-zinc-50 text-zinc-700">
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status] || 'bg-zinc-400'}`}></span>
      {status}
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

// --- Custom Icons ---
const AmazonIcon = ({ size = 16, className }: { size?: number, className?: string }) => (
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" 
    alt="Amazon"
    style={{ width: size, height: size }}
    className={`object-contain ${className || ''}`}
  />
);

// --- Helper: Supplier Context Logic ---
const getSupplierContext = (companyId: string) => {
  const strategies: Record<string, {
    platform: string, 
    label: string, 
    icon: any, 
    color: string, 
    logistics: string,
    isMarketplace: boolean
  }> = {
    'c1': { 
      platform: 'Amazon', 
      label: 'Vendor Central', 
      icon: AmazonIcon, 
      color: 'text-orange-700 bg-orange-50 border-orange-200',
      logistics: 'FBA (Fulfilled by Amazon)',
      isMarketplace: true
    },
    'c2': { 
      platform: 'Miravia', 
      label: 'Marketplace Mall', 
      icon: ShoppingBag, 
      color: 'text-pink-700 bg-pink-50 border-pink-200',
      logistics: 'DBA (Delivery by Miravia)',
      isMarketplace: true
    },
    'c3': { 
      platform: 'Direct Sales', 
      label: 'eCommerce', 
      icon: Globe, 
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      logistics: 'Own Logistics',
      isMarketplace: false
    }
  };

  return strategies[companyId] || strategies['c3'];
};

// --- Helper: Time Tracker Logic ---
const getTrackingInfo = (order: Order) => {
  const provider = order.companyId === 'c1' ? 'AMZN' : order.companyId === 'c2' ? 'MRV' : 'DHL';
  const trackingCode = `${provider}-${order.id.replace('#', '')}-${Math.floor(Math.random() * 10000)}`;
  
  const orderDate = new Date(order.date);
  const shipDate = new Date(orderDate);
  shipDate.setDate(orderDate.getDate() + 1); 
  
  const now = new Date(); 
  
  const diffMs = now.getTime() - shipDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const timeInTransit = diffDays > 0 
    ? `${diffDays}d ${diffHours}h transit`
    : diffDays === 0 && diffHours > 0 ? `${diffHours}h transit`
    : 'Preparing';

  return { trackingCode, provider, timeInTransit, shipDate };
};

// --- Modal: New Order (Manual) ---
interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderData: any) => void;
  selectedCompanyId: string;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({ isOpen, onClose, onSave, selectedCompanyId }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    products: '',
    amount: '',
    paymentMethod: 'Transferencia',
    companyId: selectedCompanyId === 'all' ? COMPANIES[0].id : selectedCompanyId,
    date: new Date().toISOString().split('T')[0],
    orderId: '',
    shippingProvider: 'DHL',
    address: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-medusa w-full max-w-2xl p-0 animate-in fade-in zoom-in-95 overflow-hidden">
         <div className="flex justify-between items-center p-6 border-b border-zinc-100">
            <h3 className="text-sm font-semibold text-zinc-900">Create Draft Order</h3>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><X size={20}/></button>
         </div>

         <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
             {/* General Info */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Order ID (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">#</span>
                    <input 
                      type="text" 
                      value={formData.orderId}
                      onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                      className="w-full pl-7 pr-3 py-2 border border-zinc-200 rounded-md text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 placeholder-zinc-300"
                      placeholder="Auto-generated"
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                  />
               </div>
               
               {selectedCompanyId === 'all' && (
                 <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Store</label>
                    <select 
                      value={formData.companyId}
                      onChange={(e) => setFormData({...formData, companyId: e.target.value})}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                    >
                      {COMPANIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
               )}
             </div>

             <div className="border-t border-zinc-100 pt-4">
                <h4 className="text-xs font-semibold text-zinc-900 mb-3">Customer Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Full Name</label>
                      <input 
                         type="text" 
                         value={formData.customerName}
                         onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                         className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                         placeholder="e.g. John Doe"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Email</label>
                      <input 
                         type="email" 
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                         placeholder="customer@example.com"
                      />
                   </div>
                </div>
             </div>

             <div className="border-t border-zinc-100 pt-4">
                <h4 className="text-xs font-semibold text-zinc-900 mb-3">Line Items</h4>
                <div className="space-y-4">
                   <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Product</label>
                      <input 
                         type="text" 
                         value={formData.products}
                         onChange={(e) => setFormData({...formData, products: e.target.value})}
                         className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                         placeholder="Find products..."
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-xs font-medium text-zinc-500 mb-1">Total Amount</label>
                         <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                            <input 
                                type="number" 
                                value={formData.amount}
                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                className="w-full pl-6 pr-3 py-2 border border-zinc-200 rounded-md text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                                placeholder="0.00"
                            />
                         </div>
                      </div>
                      <div>
                         <label className="block text-xs font-medium text-zinc-500 mb-1">Payment Method</label>
                         <select 
                            value={formData.paymentMethod}
                            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                            className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                         >
                            <option>Transferencia</option>
                            <option>Tarjeta</option>
                            <option>Efectivo</option>
                            <option>PayPal</option>
                         </select>
                      </div>
                   </div>
                </div>
             </div>
         </div>

         <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-zinc-200 rounded-md text-sm font-medium text-zinc-700 hover:bg-white bg-white shadow-sm">Cancel</button>
            <button 
               onClick={() => onSave(formData)}
               disabled={!formData.customerName || !formData.amount || !formData.products}
               className="px-4 py-2 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
               Create Order
            </button>
         </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export const Orders: React.FC = () => {
  const { selectedCompanyId } = useCompany();
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  useEffect(() => {
    setOrders(MOCK_ORDERS);
  }, [selectedCompanyId]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCompany = selectedCompanyId === 'all' || order.companyId === selectedCompanyId;
      return matchesSearch && matchesCompany;
    });
  }, [orders, searchTerm, selectedCompanyId]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  const handleCreateOrder = (orderData: any) => {
    const newOrder: Order = {
       id: orderData.orderId ? (orderData.orderId.startsWith('#') ? orderData.orderId : `#${orderData.orderId}`) : `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
       companyId: orderData.companyId,
       customerName: orderData.customerName,
       products: orderData.products,
       amount: Number(orderData.amount),
       status: Status.Pending,
       date: orderData.date || new Date().toISOString().split('T')[0],
       paymentMethod: orderData.paymentMethod
    };

    setOrders([newOrder, ...orders]);
    setIsNewOrderModalOpen(false);
    addToast(`Order ${newOrder.id} created successfully.`, 'success');
  };

  return (
    <div className="relative min-h-screen">
      <ToastNotification toasts={toasts} removeToast={removeToast} />

      {/* Header Section */}
      <div className="space-y-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h2 className="text-xl font-semibold text-zinc-900">Orders</h2>
             <p className="text-xs text-zinc-500 mt-1">Manage your orders and subscriptions.</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-zinc-200 text-zinc-700 px-3 py-2 rounded-md text-xs font-medium hover:bg-zinc-50 shadow-sm transition-colors flex items-center gap-2">
               Export
            </button>
            <button 
               onClick={() => setIsNewOrderModalOpen(true)}
               className="bg-zinc-900 hover:bg-zinc-800 text-white px-3 py-2 rounded-md text-xs font-medium flex items-center gap-2 shadow-sm transition-colors"
            >
              Create Order
            </button>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row gap-4 justify-between bg-white">
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors">
                <Filter size={14} />
                Add Filter
                </button>
            </div>
            
            <div className="relative sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search orders..." 
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-zinc-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all placeholder-zinc-400"
                />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-50/50 border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Order</th>
                  {selectedCompanyId === 'all' && <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Store</th>}
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={selectedCompanyId === 'all' ? 7 : 6} className="px-6 py-12 text-center text-zinc-400 text-xs">
                        No orders found matching your search.
                      </td>
                    </tr>
                ) : filteredOrders.map((order) => {
                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => handleRowClick(order)}
                      className="hover:bg-zinc-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-3 text-xs font-medium text-zinc-900">
                        {order.id}
                      </td>
                      {selectedCompanyId === 'all' && (
                          <td className="px-6 py-3">
                             <CompanyBadge companyId={order.companyId} />
                          </td>
                      )}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                            {order.customerName.charAt(0)}
                          </div>
                          <span className="text-xs text-zinc-700">{order.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-xs text-zinc-500">{order.date}</td>
                      <td className="px-6 py-3 text-xs font-medium text-zinc-900">${order.amount.toFixed(2)}</td>
                      <td className="px-6 py-3">
                        <StatusBadge status={order.status} />
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
          
          <div className="px-6 py-4 border-t border-zinc-100 bg-white flex justify-between items-center">
             <span className="text-xs text-zinc-500">Showing {filteredOrders.length} results</span>
             <div className="flex gap-2">
                <button className="px-3 py-1 border border-zinc-200 rounded-md text-xs text-zinc-600 hover:bg-zinc-50 disabled:opacity-50">Previous</button>
                <button className="px-3 py-1 border border-zinc-200 rounded-md text-xs text-zinc-600 hover:bg-zinc-50 disabled:opacity-50">Next</button>
             </div>
          </div>
        </div>
      </div>

      {/* Slide-over / Drawer for Order Details */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-zinc-900/20 backdrop-blur-sm transition-opacity" onClick={closeDrawer}></div>
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md transform transition ease-in-out duration-300 bg-white shadow-xl flex flex-col h-full overflow-y-auto border-l border-zinc-200">
              
              {/* Drawer Header */}
              <div className="px-6 py-5 bg-white border-b border-zinc-100 flex items-center justify-between sticky top-0 z-10">
                <div>
                   <h2 className="text-sm font-semibold text-zinc-900">Order Details</h2>
                   <p className="text-xs text-zinc-500 mt-0.5">{selectedOrder?.id}</p>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                     onClick={closeDrawer}
                     className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md hover:bg-zinc-100"
                   >
                     <X size={20} />
                   </button>
                </div>
              </div>

              {/* Drawer Content */}
              {selectedOrder && (
                <div className="flex-1 p-6 space-y-8">
                  
                  {/* Status Section */}
                  <div className="flex justify-between items-center">
                     <StatusBadge status={selectedOrder.status} />
                     <span className="text-xs text-zinc-400">{selectedOrder.date}</span>
                  </div>

                  {/* Line Items */}
                  <div>
                     <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-4">Summary</h3>
                     <div className="flex gap-4 mb-4">
                        <div className="h-16 w-16 bg-zinc-100 rounded-md border border-zinc-200 flex items-center justify-center flex-shrink-0">
                           <Package className="text-zinc-300" size={24} />
                        </div>
                        <div className="flex-1">
                           <p className="text-sm font-medium text-zinc-900">{selectedOrder.products}</p>
                           <p className="text-xs text-zinc-500 mt-1">Variant: Default</p>
                           <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-zinc-500">1 x ${selectedOrder.amount.toFixed(2)}</span>
                              <span className="text-sm font-medium text-zinc-900">${selectedOrder.amount.toFixed(2)}</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="border-t border-zinc-100 pt-4 space-y-2">
                        <div className="flex justify-between text-xs">
                           <span className="text-zinc-500">Subtotal</span>
                           <span className="text-zinc-900">${(selectedOrder.amount * 0.8).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                           <span className="text-zinc-500">Shipping</span>
                           <span className="text-zinc-900">$10.00</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium pt-2">
                           <span className="text-zinc-900">Total</span>
                           <span className="text-zinc-900">${(selectedOrder.amount + 10).toFixed(2)}</span>
                        </div>
                     </div>
                  </div>

                  {/* Customer */}
                  <div>
                     <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-4">Customer</h3>
                     <div className="flex items-start gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600">
                           {selectedOrder.customerName.charAt(0)}
                        </div>
                        <div>
                           <p className="text-sm font-medium text-zinc-900">{selectedOrder.customerName}</p>
                           <p className="text-xs text-zinc-500">{selectedOrder.customerName.toLowerCase().replace(' ', '.')}@example.com</p>
                        </div>
                     </div>
                     
                     <div className="space-y-4">
                        <div>
                           <p className="text-xs font-medium text-zinc-500 mb-1">Shipping Address</p>
                           <p className="text-sm text-zinc-700">Calle Principal 123, Piso 4<br/>28001, Madrid, Spain</p>
                        </div>
                        <div>
                           <p className="text-xs font-medium text-zinc-500 mb-1">Billing Address</p>
                           <p className="text-sm text-zinc-700">Same as shipping address</p>
                        </div>
                     </div>
                  </div>

                </div>
              )}
              
              {/* Drawer Footer */}
              <div className="border-t border-zinc-100 px-6 py-4 bg-zinc-50 flex gap-3 shrink-0 justify-end">
                 <button 
                    onClick={() => addToast('Invoice downloaded', 'success')}
                    className="px-4 py-2 bg-white border border-zinc-200 rounded-md text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                 >
                   Invoice
                 </button>
                 <button 
                   onClick={() => alert('Not implemented')}
                   className="px-4 py-2 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 shadow-sm"
                 >
                   Fulfill Order
                 </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* New Manual Order Modal Instance */}
      <NewOrderModal 
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onSave={handleCreateOrder}
        selectedCompanyId={selectedCompanyId}
      />
    </div>
  );
};
