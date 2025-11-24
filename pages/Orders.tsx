
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
  FileSpreadsheet
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
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transform transition-all duration-300 animate-in slide-in-from-right-full ${
          toast.type === 'success' ? 'bg-white border-green-100 text-green-800' :
          toast.type === 'error' ? 'bg-white border-red-100 text-red-800' :
          'bg-white border-blue-100 text-blue-800'
        }`}
      >
        {toast.type === 'success' && <CheckCircle size={18} className="text-green-500" />}
        {toast.type === 'error' && <AlertCircle size={18} className="text-red-500" />}
        {toast.type === 'info' && <Clock size={18} className="text-blue-500" />}
        <span className="text-sm font-medium">{toast.message}</span>
        <button onClick={() => removeToast(toast.id)} className="ml-4 text-gray-400 hover:text-gray-600">
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

// --- Component: Status Badge ---
const StatusBadge = ({ status }: { status: Status }) => {
  const styles = {
    [Status.Active]: 'bg-green-100 text-green-700 border-green-200',
    [Status.Completed]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [Status.Pending]: 'bg-amber-50 text-amber-700 border-amber-200',
    [Status.Cancelled]: 'bg-red-50 text-red-700 border-red-200',
    [Status.Inactive]: 'bg-gray-100 text-gray-700 border-gray-200',
    [Status.Hidden]: 'bg-gray-100 text-gray-600 border-gray-200',
    [Status.Featured]: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
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
      platform: 'Venta Directa', 
      label: 'eCommerce Propio', 
      icon: Globe, 
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      logistics: 'Logística Propia',
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
    ? `${diffDays}d ${diffHours}h en tránsito`
    : diffDays === 0 && diffHours > 0 ? `${diffHours}h en tránsito`
    : 'Pendiente de Salida';

  return { trackingCode, provider, timeInTransit, shipDate };
};

// --- Modal: Factura (Invoice) ---
interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onDownload: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order, onDownload }) => {
  if (!isOpen || !order) return null;

  const subtotal = order.amount * 0.79;
  const tax = order.amount * 0.21;
  const supplier = getSupplierContext(order.companyId);
  const company = COMPANIES.find(c => c.id === order.companyId);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white shadow-2xl w-full max-w-3xl transform transition-all scale-100 flex flex-col h-[90vh] md:h-auto md:max-h-[90vh] rounded-none md:rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shrink-0">
           <h3 className="font-bold flex items-center gap-2">
             <FileText size={18}/> Vista Previa de Factura
           </h3>
           <div className="flex gap-3">
              <button onClick={() => window.print()} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Imprimir">
                 <Printer size={18} />
              </button>
              <button onClick={onDownload} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Descargar PDF">
                 <Download size={18} />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                 <X size={18} />
              </button>
           </div>
        </div>

        <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
           <div className="bg-white shadow-lg p-8 max-w-[210mm] mx-auto min-h-[297mm] text-sm text-gray-800 relative">
              
              <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
                 <div>
                    <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-widest mb-2">Factura</h1>
                    <p className="text-gray-500">#{order.id.replace('#', '')}-INV</p>
                    <p className="text-gray-500 mt-1">Fecha: {new Date().toLocaleDateString()}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-gray-100 text-xs text-gray-600">
                       <supplier.icon size={12} /> Venta vía {supplier.platform}
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-xl font-bold text-gray-900 mb-1">{company?.name || 'Global Factory'}</div>
                    <p className="text-gray-500">Calle Industrial 45</p>
                    <p className="text-gray-500">28001 Madrid, España</p>
                    <p className="text-gray-500">CIF: B-12345678</p>
                 </div>
              </div>

              <div className="flex justify-between mb-8">
                 <div className="w-1/2 pr-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Facturar a:</h4>
                    <p className="font-bold text-gray-900 text-base">{order.customerName}</p>
                    <p className="text-gray-600">Calle del Cliente 123</p>
                    <p className="text-gray-600">Ciudad, CP 00000</p>
                    <p className="text-gray-600">{order.customerName.split(' ')[0].toLowerCase()}@email.com</p>
                 </div>
                 <div className="w-1/2 pl-4 text-right">
                    <div className="inline-block text-left bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Detalles del Pago</h4>
                      <div className="flex justify-between gap-8 mb-1">
                         <span>Método:</span>
                         <span className="font-medium">{order.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between gap-8">
                         <span>Fecha Pedido:</span>
                         <span className="font-medium">{order.date}</span>
                      </div>
                    </div>
                 </div>
              </div>

              <table className="w-full mb-8">
                 <thead>
                    <tr className="border-b-2 border-gray-800">
                       <th className="text-left py-2 font-bold uppercase text-xs">Descripción</th>
                       <th className="text-center py-2 font-bold uppercase text-xs w-24">Cant.</th>
                       <th className="text-right py-2 font-bold uppercase text-xs w-32">Precio Unit.</th>
                       <th className="text-right py-2 font-bold uppercase text-xs w-32">Total</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr className="border-b border-gray-100">
                       <td className="py-4">
                          <p className="font-bold text-gray-900">{order.products}</p>
                          <p className="text-xs text-gray-500">Ref: SKU-GEN-001</p>
                       </td>
                       <td className="py-4 text-center">1</td>
                       <td className="py-4 text-right">${subtotal.toFixed(2)}</td>
                       <td className="py-4 text-right">${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                       <td className="py-4">
                          <p className="font-medium text-gray-700">Gastos de Envío ({supplier.logistics})</p>
                       </td>
                       <td className="py-4 text-center">1</td>
                       <td className="py-4 text-right">${(order.amount - subtotal - tax).toFixed(2)}</td>
                       <td className="py-4 text-right">${(order.amount - subtotal - tax).toFixed(2)}</td>
                    </tr>
                 </tbody>
              </table>

              <div className="flex justify-end">
                 <div className="w-64 space-y-2">
                    <div className="flex justify-between text-gray-600">
                       <span>Subtotal</span>
                       <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                       <span>IVA (21%)</span>
                       <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-800 mt-2">
                       <span>Total</span>
                       <span>${order.amount.toFixed(2)}</span>
                    </div>
                 </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
                 <p>Gracias por su confianza. Pedido procesado por {company?.name} a través de {supplier.platform}.</p>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
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
    // New Fields
    date: new Date().toISOString().split('T')[0],
    orderId: '',
    shippingProvider: 'DHL',
    address: ''
  });

  useEffect(() => {
    if (isOpen) {
       setFormData({
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
    }
  }, [isOpen, selectedCompanyId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 animate-in fade-in zoom-in-95 overflow-y-auto max-h-[90vh]">
         <div className="flex justify-between items-start mb-6">
            <div>
               <h3 className="text-lg font-bold text-gray-900">Crear Pedido Manual</h3>
               <p className="text-sm text-gray-500">Registrar un pedido telefónico, directo o personalizado</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
         </div>

         <div className="space-y-6">
             {/* General Info */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nº Orden (Opcional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">#</span>
                    <input 
                      type="text" 
                      value={formData.orderId}
                      onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500"
                      placeholder="Auto-generado si vacío"
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Pedido</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full border-gray-300 rounded-lg text-sm py-2 focus:ring-primary-500"
                  />
               </div>
               
               {selectedCompanyId === 'all' && (
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                    <select 
                      value={formData.companyId}
                      onChange={(e) => setFormData({...formData, companyId: e.target.value})}
                      className="w-full border-gray-300 rounded-lg text-sm focus:ring-primary-500 py-2"
                    >
                      {COMPANIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
               )}
             </div>

             <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Datos del Cliente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Cliente</label>
                      <input 
                         type="text" 
                         value={formData.customerName}
                         onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                         className="w-full border-gray-300 rounded-lg text-sm py-2"
                         placeholder="Ej. Juan Pérez"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opcional)</label>
                      <input 
                         type="email" 
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         className="w-full border-gray-300 rounded-lg text-sm py-2"
                         placeholder="cliente@email.com"
                      />
                   </div>
                </div>
             </div>

             <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Detalles de Venta</h4>
                <div className="space-y-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Producto(s)</label>
                      <input 
                         type="text" 
                         value={formData.products}
                         onChange={(e) => setFormData({...formData, products: e.target.value})}
                         className="w-full border-gray-300 rounded-lg text-sm py-2"
                         placeholder="Ej. Colchón Visco, Almohada..."
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Monto Total ($)</label>
                         <input 
                            type="number" 
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            className="w-full border-gray-300 rounded-lg text-sm py-2"
                            placeholder="0.00"
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Método Pago</label>
                         <select 
                            value={formData.paymentMethod}
                            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                            className="w-full border-gray-300 rounded-lg text-sm py-2"
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

             <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Logística y Entrega</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Empresa de Envío</label>
                        <select 
                           value={formData.shippingProvider}
                           onChange={(e) => setFormData({...formData, shippingProvider: e.target.value})}
                           className="w-full border-gray-300 rounded-lg text-sm py-2"
                        >
                           <option value="DHL">DHL Express</option>
                           <option value="SEUR">SEUR</option>
                           <option value="CORREOS">Correos Express</option>
                           <option value="GLS">GLS</option>
                           <option value="MRW">MRW</option>
                           <option value="AMAZON">Amazon Logistics</option>
                        </select>
                    </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Completa</label>
                   <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={3}
                      className="w-full border-gray-300 rounded-lg text-sm py-2 resize-none"
                      placeholder="Calle, Número, Piso, Ciudad, Código Postal..."
                   />
                </div>
             </div>
         </div>

         <div className="mt-8 flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button 
               onClick={() => onSave(formData)}
               disabled={!formData.customerName || !formData.amount || !formData.products}
               className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
               Crear Pedido
            </button>
         </div>
      </div>
    </div>
  );
};

// ... (Other existing modals: ShipmentConfigModal, AdjustOrderModal, CustomerResponseModal - keep them as is)
// For brevity, assuming they are here as in the previous file content. 
// I will include them to ensure the file is complete.

// --- Modal: Customer Response (New Feature) ---
interface CustomerResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSend: (message: string, isScheduled: boolean, scheduleData?: {date: string, time: string}) => void;
}

const RESPONSE_TEMPLATES = {
  status_update: "Hola {customerName}, te escribimos para informarte que tu pedido {orderId} ha cambiado de estado. Ahora está en proceso de preparación. Gracias por tu paciencia.",
  shipping_info: "¡Buenas noticias {customerName}! Tu pedido {orderId} que contiene {productName} ha sido enviado. Recibirás el tracking en breve.",
  delay_notice: "Hola {customerName}, lamentamos informarte que el pedido {orderId} sufrirá un ligero retraso. Estamos trabajando para enviarlo cuanto antes.",
  refund_info: "Hola {customerName}, hemos procesado el reembolso correspondiente a tu pedido {orderId}. Deberías verlo reflejado en 3-5 días hábiles.",
  thanks: "¡Gracias por tu compra {customerName}! Esperamos que disfrutes de tu {productName}. Si tienes alguna duda, estamos aquí para ayudarte."
};

const CustomerResponseModal: React.FC<CustomerResponseModalProps> = ({ isOpen, onClose, order, onSend }) => {
  const [message, setMessage] = useState('');
  const [templateType, setTemplateType] = useState('status_update');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  // Auto-generate message when template or order changes
  useEffect(() => {
    if (order) {
      const template = RESPONSE_TEMPLATES[templateType as keyof typeof RESPONSE_TEMPLATES];
      const compiledMessage = template
        .replace('{customerName}', order.customerName.split(' ')[0])
        .replace('{orderId}', order.id)
        .replace('{productName}', order.products);
      setMessage(compiledMessage);
      
      // Reset Scheduling
      setIsScheduled(false);
      setScheduleDate('');
      setScheduleTime('');
    }
  }, [order, templateType]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-primary-50">
          <h3 className="font-bold text-primary-900 flex items-center gap-2">
            <MessageSquare size={18} className="text-primary-600"/> Contactar Cliente
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
           
           {/* Context Card */}
           <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
              <div className="grid grid-cols-2 gap-4 mb-2">
                 <div>
                    <span className="text-xs text-gray-500 uppercase font-bold block">Cliente</span>
                    <span className="font-medium text-gray-900">{order.customerName}</span>
                 </div>
                 <div>
                    <span className="text-xs text-gray-500 uppercase font-bold block">Nº Pedido</span>
                    <span className="font-mono text-gray-700 bg-gray-200 px-1 rounded">{order.id}</span>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <span className="text-xs text-gray-500 uppercase font-bold block">Producto</span>
                    <span className="truncate block text-gray-700">{order.products}</span>
                 </div>
                 <div>
                     <span className="text-xs text-gray-500 uppercase font-bold block">Dirección</span>
                     <span className="text-gray-700 truncate block">Calle Principal 123...</span>
                 </div>
              </div>
           </div>

           {/* Selector */}
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plantilla de Respuesta</label>
              <select 
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                className="w-full border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 py-2"
              >
                 <option value="status_update">Actualización de Estado</option>
                 <option value="shipping_info">Confirmación de Envío</option>
                 <option value="delay_notice">Aviso de Retraso</option>
                 <option value="refund_info">Información de Reembolso</option>
                 <option value="thanks">Agradecimiento</option>
              </select>
           </div>

           {/* Message Area */}
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje Personalizado</label>
              <textarea 
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 rows={5}
                 className="w-full border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 p-3 resize-none shadow-sm"
              />
           </div>

           {/* Scheduling Options */}
           <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                 <input 
                   type="checkbox" 
                   id="scheduleCheck"
                   checked={isScheduled}
                   onChange={(e) => setIsScheduled(e.target.checked)}
                   className="rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                 />
                 <label htmlFor="scheduleCheck" className="text-sm font-bold text-gray-700 cursor-pointer select-none">Programar Envío del Mensaje</label>
              </div>
              
              {isScheduled && (
                 <div className="grid grid-cols-2 gap-3 mt-2 animate-in fade-in slide-in-from-top-1">
                    <div>
                       <label className="text-xs text-gray-500 block mb-1">Fecha</label>
                       <div className="relative">
                          <Calendar size={14} className="absolute left-2.5 top-2.5 text-gray-400"/>
                          <input 
                             type="date" 
                             value={scheduleDate}
                             onChange={(e) => setScheduleDate(e.target.value)}
                             className="w-full pl-8 py-1.5 text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          />
                       </div>
                    </div>
                    <div>
                       <label className="text-xs text-gray-500 block mb-1">Hora</label>
                       <div className="relative">
                          <Clock size={14} className="absolute left-2.5 top-2.5 text-gray-400"/>
                          <input 
                             type="time" 
                             value={scheduleTime}
                             onChange={(e) => setScheduleTime(e.target.value)}
                             className="w-full pl-8 py-1.5 text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          />
                       </div>
                    </div>
                 </div>
              )}
           </div>

           {/* Action Buttons */}
           <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => { navigator.clipboard.writeText(message); alert("Copiado al portapapeles"); }}
                className="flex items-center justify-center p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors text-sm font-medium gap-2"
              >
                 <Copy size={16} /> Copiar Texto
              </button>
              
              <button 
                onClick={() => onSend(message, isScheduled, {date: scheduleDate, time: scheduleTime})}
                disabled={isScheduled && (!scheduleDate || !scheduleTime)}
                className={`flex items-center justify-center p-2.5 rounded-lg text-white text-sm font-bold gap-2 transition-colors shadow-sm ${
                   isScheduled 
                     ? (scheduleDate && scheduleTime ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed')
                     : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                 {isScheduled ? <Clock size={16} /> : <Send size={16} />} 
                 {isScheduled ? 'Programar Envío' : 'Enviar Ahora'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Modal: Ajustar Pedido (Solo Pendientes) ---
interface AdjustOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirm: (newAmount: number, note: string) => void;
}

const AdjustOrderModal: React.FC<AdjustOrderModalProps> = ({ isOpen, onClose, order, onConfirm }) => {
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (order) {
       setAmount(order.amount);
       setNote('');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
         <div className="flex justify-between items-start mb-4">
            <div>
               <h3 className="text-lg font-bold text-gray-900">Ajustar Pedido</h3>
               <p className="text-sm text-gray-500">Modificar detalles de {order.id}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
         </div>

         <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg mb-4 flex gap-2 items-start">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">
               Estás editando un pedido pendiente. Cualquier cambio de precio notificará al cliente.
            </p>
         </div>

         <div className="space-y-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
               <input type="text" value={order.products} disabled className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500" />
            </div>
            
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Monto Total ($)</label>
               <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" 
                  />
               </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Motivo del Ajuste</label>
               <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ej: Cliente solicitó añadir accesorio..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
               />
            </div>
         </div>

         <div className="mt-6 flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button 
               onClick={() => onConfirm(amount, note)}
               className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
            >
               Confirmar Ajuste
            </button>
         </div>
      </div>
    </div>
  );
};

// --- Modal de Configuración de Envío ---
interface ShipmentConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSave: (data: any) => void;
}

const ShipmentConfigModal: React.FC<ShipmentConfigModalProps> = ({ isOpen, onClose, order, onSave }) => {
  const [formData, setFormData] = useState({
    provider: 'DHL',
    packages: 1,
    shippingDate: new Date().toISOString().split('T')[0],
    address: 'Calle Principal 123, Madrid, 28001',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        provider: 'DHL',
        packages: 1,
        shippingDate: new Date().toISOString().split('T')[0],
        address: 'Calle Principal 123, Madrid, 28001', 
        notes: ''
      });
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all scale-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Truck size={18} className="text-primary-600"/> Gestión de Logística
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Configurar envío para el pedido <span className="font-mono font-medium text-gray-700">{order.id}</span></p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
           
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Empresa de Envío</label>
                 <div className="relative">
                   <select 
                     value={formData.provider}
                     onChange={(e) => setFormData({...formData, provider: e.target.value})}
                     className="w-full pl-3 pr-8 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none outline-none"
                   >
                     <option value="DHL">DHL Express</option>
                     <option value="SEUR">SEUR</option>
                     <option value="CORREOS">Correos Express</option>
                     <option value="GLS">GLS</option>
                     <option value="MRW">MRW</option>
                   </select>
                   <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={14} />
                 </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Fecha de Salida</label>
                 <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="date"
                      value={formData.shippingDate}
                      onChange={(e) => setFormData({...formData, shippingDate: e.target.value})} 
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nº Bultos</label>
                 <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="number" 
                      min="1"
                      value={formData.packages}
                      onChange={(e) => setFormData({...formData, packages: parseInt(e.target.value)})}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                 </div>
              </div>
              <div className="col-span-2">
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Referencia Interna</label>
                 <input 
                   type="text" 
                   value={order.id} 
                   readOnly 
                   className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 cursor-not-allowed outline-none"
                 />
              </div>
           </div>

           <div>
              <div className="flex justify-between items-center mb-1.5">
                 <label className="block text-xs font-bold text-gray-500 uppercase">Dirección de Entrega</label>
                 <button className="text-[10px] text-primary-600 hover:underline flex items-center gap-1">
                   <Edit2 size={10} /> Editar
                 </button>
              </div>
              <div className="relative">
                 <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                 <textarea 
                   rows={3}
                   value={formData.address}
                   onChange={(e) => setFormData({...formData, address: e.target.value})}
                   className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                 />
              </div>
           </div>
           
           <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex gap-3 items-start">
              <AlertCircle size={16} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700">
                Al guardar, se generará una pre-alerta a la empresa de transporte seleccionada y se actualizará el estado logístico.
              </p>
           </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100">
             Cancelar
           </button>
           <button 
             onClick={() => onSave(formData)}
             className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black shadow-lg flex items-center gap-2"
           >
             <Save size={16} /> Guardar Cambios
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
  
  // State for Shipment Modal
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [orderForShipment, setOrderForShipment] = useState<Order | null>(null);

  // State for Invoice & Adjustment & Customer Response
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [incidentText, setIncidentText] = useState('');

  // NEW STATES: Export & New Order
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close export menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setOrders(MOCK_ORDERS);
  }, [selectedCompanyId]);

  // Filter logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCompany = selectedCompanyId === 'all' || order.companyId === selectedCompanyId;
      return matchesSearch && matchesCompany;
    });
  }, [orders, searchTerm, selectedCompanyId]);

  // Toast Logic
  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Handlers
  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedOrder(null), 300); // Wait for animation
  };

  const updateStatus = (e: React.MouseEvent | null, id: string, newStatus: Status) => {
    if (e) e.stopPropagation(); // Prevent row click
    
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    
    // Sync selected order if open
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }

    const message = newStatus === Status.Completed ? 'Pedido completado exitosamente' :
                    newStatus === Status.Cancelled ? 'Pedido cancelado' : 'Estado actualizado';
    const type = newStatus === Status.Completed ? 'success' :
                 newStatus === Status.Cancelled ? 'error' : 'info';
    
    addToast(message, type);
  };

  // Shipment Config Handlers
  const openShipmentModal = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    setOrderForShipment(order);
    setIsShipmentModalOpen(true);
  };

  const handleShipmentSave = (data: any) => {
    if (!orderForShipment) return;
    addToast(`Envío configurado con ${data.provider} (${data.packages} bultos)`, 'success');
    setIsShipmentModalOpen(false);
    setOrderForShipment(null);
  };

  // Invoice Handlers
  const handleDownloadInvoice = () => {
    addToast('Factura descargada exitosamente en PDF', 'success');
    setIsInvoiceOpen(false);
  };

  // Adjustment Handlers
  const handleAdjustOrder = (newAmount: number, note: string) => {
    if (selectedOrder) {
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, amount: newAmount } : o));
      setSelectedOrder(prev => prev ? { ...prev, amount: newAmount } : null);
      addToast(`Pedido ajustado: $${newAmount.toFixed(2)} (${note})`, 'info');
    }
    setIsAdjustOpen(false);
  };

  // Customer Response Handler
  const handleSendResponse = (message: string, isScheduled: boolean, scheduleData?: {date: string, time: string}) => {
    if (isScheduled && scheduleData) {
       addToast(`Mensaje programado para el ${scheduleData.date} a las ${scheduleData.time}`, 'info');
    } else {
       addToast(`Mensaje enviado al cliente exitosamente`, 'success');
    }
    setIsResponseModalOpen(false);
  };

  const handleSendReviewRequest = () => {
     addToast('Solicitud de reseña automática enviada por email.', 'success');
  };

  const handleConfirmReceipt = () => {
     if (selectedOrder) {
        updateStatus(null, selectedOrder.id, Status.Completed);
        addToast('Pedido marcado como entregado y recibido por cliente.', 'success');
     }
  };

  const handleReportIncident = () => {
     if (!incidentText) return;
     addToast('Incidencia registrada en sistema de calidad.', 'error');
     setIncidentText('');
  };

  // --- NEW HANDLERS: EXPORT & CREATE ---

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
    addToast(`Pedido manual ${newOrder.id} creado correctamente. Envío: ${orderData.shippingProvider}`, 'success');
  };

  const handleExportCSV = () => {
     // Prepare CSV Data
     const headers = ['ID', 'Cliente', 'Producto', 'Fecha', 'Monto', 'Estado', 'Empresa'];
     const rows = filteredOrders.map(o => [
        o.id,
        o.customerName,
        o.products,
        o.date,
        o.amount.toString(),
        o.status,
        COMPANIES.find(c => c.id === o.companyId)?.name || 'N/A'
     ]);

     const csvContent = [headers, ...rows]
       .map(e => e.join(","))
       .join("\n");

     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
     const url = URL.createObjectURL(blob);
     const link = document.createElement('a');
     link.setAttribute('href', url);
     link.setAttribute('download', `pedidos_export_${new Date().toISOString().split('T')[0]}.csv`);
     link.style.visibility = 'hidden';
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);

     setIsExportMenuOpen(false);
     addToast('Exportación CSV completada', 'success');
  };

  const handleExportExcel = () => {
     setIsExportMenuOpen(false);
     // Mock Excel download
     addToast('Generando archivo Excel (.xlsx)...', 'info');
     setTimeout(() => {
        addToast('Exportación Excel completada', 'success');
     }, 1000);
  };

  return (
    <div className="relative min-h-screen">
      <ToastNotification toasts={toasts} removeToast={removeToast} />

      {/* Header Section */}
      <div className="space-y-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h2 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h2>
             <p className="text-gray-500 text-sm">Administra las solicitudes y el estado de envíos.</p>
          </div>
          <div className="flex gap-2 relative">
            
            {/* Export Dropdown */}
            <div className="relative" ref={exportRef}>
               <button 
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2"
               >
                  Exportar
                  <ChevronDown size={14} className="text-gray-400"/>
               </button>
               {isExportMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-30 animate-in fade-in zoom-in-95 overflow-hidden">
                     <button 
                        onClick={handleExportCSV}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors border-b border-gray-50"
                     >
                        <FileText size={16} className="text-gray-400" /> Exportar CSV
                     </button>
                     <button 
                        onClick={handleExportExcel}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                     >
                        <FileSpreadsheet size={16} className="text-green-600" /> Exportar Excel
                     </button>
                  </div>
               )}
            </div>

            <button 
               onClick={() => setIsNewOrderModalOpen(true)}
               className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
            >
              <Plus size={18} />
              Nuevo Pedido
            </button>
          </div>
        </div>

        {/* Stats / Quick Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
             <div className="text-xs text-gray-500 font-semibold uppercase">Pendientes</div>
             <div className="text-2xl font-bold text-amber-600 mt-1">{filteredOrders.filter(o => o.status === Status.Pending).length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
             <div className="text-xs text-gray-500 font-semibold uppercase">Para Enviar</div>
             <div className="text-2xl font-bold text-blue-600 mt-1">{Math.floor(filteredOrders.length * 0.2)}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
             <div className="text-xs text-gray-500 font-semibold uppercase">Completados</div>
             <div className="text-2xl font-bold text-green-600 mt-1">{filteredOrders.filter(o => o.status === Status.Completed).length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
             <div className="text-xs text-gray-500 font-semibold uppercase">Ingresos Mes</div>
             <div className="text-2xl font-bold text-gray-900 mt-1">
               ${filteredOrders.reduce((acc, o) => acc + o.amount, 0).toLocaleString()}
             </div>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <Filter size={16} />
              Filtrar
            </button>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por ID o cliente..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Pedido</th>
                  {selectedCompanyId === 'all' && <th className="px-6 py-3">Empresa / Proveedor</th>}
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={selectedCompanyId === 'all' ? 7 : 6} className="px-6 py-8 text-center text-gray-500">
                        No se encontraron pedidos para los filtros seleccionados.
                      </td>
                    </tr>
                ) : filteredOrders.map((order) => {
                  const supplier = getSupplierContext(order.companyId);
                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => handleRowClick(order)}
                      className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4 font-medium text-primary-600">
                        {order.id}
                        <div className="text-xs text-gray-400 font-normal mt-0.5">{order.products.split(',')[0]}...</div>
                      </td>
                      {selectedCompanyId === 'all' && (
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <CompanyBadge companyId={order.companyId} />
                                {supplier.isMarketplace && (
                                   <div title={`Pedido vía ${supplier.platform}`} className="p-1 bg-gray-100 rounded-full text-gray-500">
                                      <supplier.icon size={12} />
                                   </div>
                                )}
                             </div>
                          </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            {order.customerName.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{order.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">${order.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {/* Shipment Config Button */}
                          <button 
                             onClick={(e) => openShipmentModal(e, order)}
                             className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-900 transition-colors"
                             title="Configurar Envío"
                          >
                             <Truck size={16} />
                          </button>
  
                          {order.status === Status.Pending ? (
                            <>
                              <button 
                                onClick={(e) => updateStatus(e, order.id, Status.Completed)}
                                className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors" 
                                title="Aprobar"
                              >
                                <Check size={16} />
                              </button>
                              <button 
                                onClick={(e) => updateStatus(e, order.id, Status.Cancelled)}
                                className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors" 
                                title="Rechazar"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors">
                              <ChevronRight size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-over / Drawer for Order Details */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeDrawer}></div>
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 bg-white shadow-xl flex flex-col h-full overflow-y-auto">
              
              {/* Drawer Header */}
              <div className="px-6 py-6 bg-gray-50 border-b border-gray-200 flex items-start justify-between shrink-0 sticky top-0 z-10">
                <div>
                   <h2 className="text-lg font-medium text-gray-900">Detalle del Pedido</h2>
                   <p className="text-sm text-gray-500 mt-1">{selectedOrder?.id}</p>
                </div>
                <div className="flex items-center gap-2">
                   {/* Conditional Adjust Button */}
                   {selectedOrder?.status === Status.Pending && (
                     <button 
                       onClick={() => setIsAdjustOpen(true)}
                       className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg font-bold hover:bg-amber-100 transition-colors"
                     >
                       Ajustar Pedido
                     </button>
                   )}
                   <button 
                     onClick={closeDrawer}
                     className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                   >
                     <X size={24} />
                   </button>
                </div>
              </div>

              {/* Drawer Content */}
              {selectedOrder && (
                <div className="flex-1">
                  
                  {/* --- NEW SECTION: Supplier/Marketplace Context --- */}
                  <div className="p-6 border-b border-gray-100">
                     <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Building size={16} className="text-gray-400"/> Relación Comercial & Proveedor
                     </h3>
                     {(() => {
                        const supplier = getSupplierContext(selectedOrder.companyId);
                        const companyName = COMPANIES.find(c => c.id === selectedOrder.companyId)?.name;
                        return (
                           <div className={`p-4 rounded-lg border flex flex-col gap-2 ${supplier.color}`}>
                              <div className="flex justify-between items-start">
                                 <div>
                                    <span className="text-xs font-bold uppercase opacity-70">Proveedor Asignado</span>
                                    <div className="font-bold text-lg flex items-center gap-2">
                                       {companyName}
                                    </div>
                                 </div>
                                 <div className="p-2 bg-white/50 rounded-lg">
                                    <supplier.icon size={20} />
                                 </div>
                              </div>
                              <div className="pt-2 border-t border-black/5 mt-1 flex justify-between text-xs font-medium">
                                 <span>Canal: {supplier.platform}</span>
                                 <span>Logística: {supplier.logistics}</span>
                              </div>
                           </div>
                        );
                     })()}
                  </div>

                  {/* --- SECCIÓN DE TRACKING & LOGISTICA DE SALIDA --- */}
                  <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                       <Truck size={16} className="text-primary-600"/> Seguimiento & Control
                    </h3>
                    
                    {(() => {
                       const { trackingCode, provider, timeInTransit } = getTrackingInfo(selectedOrder);
                       return (
                         <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
                            
                            {/* Tracking Code */}
                            <div className="flex items-center justify-between">
                               <div>
                                  <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Código de Rastreo ({provider})</span>
                                  <div className="flex items-center gap-2">
                                     <span className="font-mono text-base font-medium text-gray-900">{trackingCode}</span>
                                     <button 
                                       onClick={() => { navigator.clipboard.writeText(trackingCode); addToast('Tracking copiado', 'success'); }}
                                       className="text-gray-400 hover:text-primary-600"
                                     >
                                        <Copy size={14} />
                                     </button>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Estado Tiempo</span>
                                  <div className="flex items-center gap-1.5 justify-end text-sm font-medium text-blue-600">
                                     <Timer size={16} /> {timeInTransit}
                                  </div>
                               </div>
                            </div>

                            {/* Customer Actions */}
                            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                               <button 
                                 onClick={handleConfirmReceipt}
                                 className="flex items-center justify-center gap-2 py-2 px-3 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                               >
                                  <PackageCheck size={16} /> Confirmar Recepción
                               </button>
                               <button 
                                 onClick={handleSendReviewRequest}
                                 className="flex items-center justify-center gap-2 py-2 px-3 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
                               >
                                  <Star size={16} /> Solicitar Reseña
                               </button>
                            </div>

                            {/* Incident Reporting Section */}
                            <div className="pt-2">
                               <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                                  <div className="flex justify-between items-center mb-2">
                                     <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                                        <AlertOctagon size={12}/> Reportar Incidencia / Rotura
                                     </span>
                                  </div>
                                  <div className="flex gap-2">
                                     <input 
                                       type="text" 
                                       placeholder="Descripción del problema..." 
                                       className="flex-1 text-xs border border-red-200 rounded px-2 py-1 focus:outline-none focus:border-red-400"
                                       value={incidentText}
                                       onChange={(e) => setIncidentText(e.target.value)}
                                     />
                                     <button 
                                       onClick={handleReportIncident}
                                       className="text-xs bg-red-600 text-white px-3 py-1 rounded font-bold hover:bg-red-700"
                                     >
                                        Reportar
                                     </button>
                                  </div>
                               </div>
                            </div>
                         </div>
                       );
                    })()}
                  </div>

                  {/* Quick Status Action */}
                  <div className="p-6 border-b border-gray-100 bg-white">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado Actual</label>
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => updateStatus(null, selectedOrder.id, e.target.value as Status)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2 pl-3 pr-10 text-base"
                    >
                      {Object.values(Status).filter(s => [Status.Pending, Status.Completed, Status.Cancelled, Status.Active].includes(s)).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Customer Info */}
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <User size={16} className="text-gray-400"/> Datos del Cliente
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nombre</span>
                        <span className="font-medium text-gray-900">{selectedOrder.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email</span>
                        <span className="font-medium text-gray-900">{selectedOrder.customerName.toLowerCase().replace(' ', '.')}@example.com</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-500">Empresa</span>
                         <div className="scale-90 origin-right">
                             <CompanyBadge companyId={selectedOrder.companyId} />
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Product List */}
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Package size={16} className="text-gray-400"/> Productos
                    </h3>
                    <div className="space-y-4">
                       <div className="flex gap-4">
                          <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                            <Package className="text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{selectedOrder.products}</p>
                            <p className="text-xs text-gray-500 mt-1">SKU: PROD-001</p>
                            <div className="flex justify-between items-center mt-2">
                               <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">x1</span>
                               <span className="text-sm font-medium text-gray-900">${selectedOrder.amount.toFixed(2)}</span>
                            </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-900">${(selectedOrder.amount * 0.8).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Envío</span>
                        <span className="text-gray-900">$10.00</span>
                      </div>
                      <div className="flex justify-between text-base font-bold mt-4">
                        <span className="text-gray-900">Total</span>
                        <span className="text-primary-600">${(selectedOrder.amount + 10).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                   {/* Shipping & Payment */}
                   <div className="p-6 grid grid-cols-1 gap-6">
                      <div>
                         <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                           <MapPin size={16} className="text-gray-400"/> Dirección de Envío
                         </h3>
                         <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                           Calle Principal 123, Piso 4<br/>
                           28001, Madrid, España
                         </p>
                      </div>
                      <div>
                         <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                           <CreditCard size={16} className="text-gray-400"/> Método de Pago
                         </h3>
                         <div className="flex items-center gap-3 text-sm text-gray-900">
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 text-xs font-bold">
                               {selectedOrder.paymentMethod}
                            </span>
                            <span className="text-gray-500 text-xs">Pagado el {selectedOrder.date}</span>
                         </div>
                      </div>
                   </div>

                </div>
              )}
              
              {/* Drawer Footer */}
              <div className="border-t border-gray-200 px-6 py-4 bg-white flex gap-3 shrink-0">
                 <button 
                    onClick={() => setIsInvoiceOpen(true)}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                 >
                   <FileText size={16} /> Ver Factura
                 </button>
                 <button 
                    onClick={() => addToast('Descargando PDF...', 'info')}
                    className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200" title="Descargar"
                 >
                    <Download size={18} />
                 </button>
                 <button 
                   onClick={() => setIsResponseModalOpen(true)}
                   className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 shadow-sm flex items-center justify-center gap-2"
                 >
                   <MessageSquare size={16} /> Contactar
                 </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Shipment Config Modal Instance */}
      <ShipmentConfigModal 
        isOpen={isShipmentModalOpen}
        onClose={() => setIsShipmentModalOpen(false)}
        order={orderForShipment}
        onSave={handleShipmentSave}
      />

      {/* Invoice Modal Instance */}
      <InvoiceModal 
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={selectedOrder}
        onDownload={handleDownloadInvoice}
      />

      {/* Adjust Order Modal Instance */}
      <AdjustOrderModal 
        isOpen={isAdjustOpen}
        onClose={() => setIsAdjustOpen(false)}
        order={selectedOrder}
        onConfirm={handleAdjustOrder}
      />

      {/* Customer Response Modal Instance */}
      <CustomerResponseModal 
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        order={selectedOrder}
        onSend={handleSendResponse}
      />

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
