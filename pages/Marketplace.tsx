
import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ShoppingBag, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Package, 
  Truck,
  Globe,
  Settings,
  Link as LinkIcon,
  LayoutGrid,
  FileImage,
  Palette,
  Search,
  Filter,
  Plus,
  Image as ImageIcon,
  Edit,
  Eye,
  Box,
  Printer,
  FileText,
  X,
  MoreVertical,
  Download,
  Save,
  Trash2,
  AlignLeft,
  Move,
  Maximize,
  Folder,
  Grid,
  List,
  ChevronDown,
  Type,
  Video
} from 'lucide-react';
import { MOCK_MARKETPLACE_ORDERS, MOCK_PRODUCTS } from '../constants';
import { Status, MarketplaceOrder, Product } from '../types';

// --- NOTIFICATION SYSTEM COMPONENTS ---

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
        {toast.type === 'info' && <Printer size={18} className="text-blue-500" />}
        <span className="text-sm font-medium">{toast.message}</span>
        <button onClick={() => removeToast(toast.id)} className="ml-4 text-gray-400 hover:text-gray-600">
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

// --- GENERIC MODAL COMPONENT ---
interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | 'full';
}

const MarketplaceModal: React.FC<MarketplaceModalProps> = ({ isOpen, onClose, title, children, footer, size = 'lg' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-5xl',
    full: 'max-w-[95vw] h-[90vh]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      <div className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all scale-100 flex flex-col max-h-[90vh]`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0 bg-gray-50/50 rounded-t-xl">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-0 overflow-y-auto flex-1 bg-gray-50">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end gap-3 flex-shrink-0 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// --- CREATIVE ASSETS LIBRARY COMPONENT ---

interface CreativeAsset {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'video';
  size?: string;
  dimensions?: string;
  url?: string;
  itemCount?: number; // for folders
}

const MOCK_CREATIVE_ASSETS: CreativeAsset[] = [
  { id: 'f1', name: 'Amazon-Auto-Translated', type: 'folder', itemCount: 2 },
  { id: 'f2', name: 'A+ Premium Julie 2 Bot...', type: 'folder', itemCount: 0 },
  { id: 'f3', name: 'Cabeceros_madera', type: 'folder', itemCount: 73 },
  { id: 'f4', name: 'A+ Premium Manhattan', type: 'folder', itemCount: 13 },
  { id: 'img1', name: 'ee3edcbe-3238-4c4e...jpg', type: 'image', size: '753.6 KB', dimensions: '1500 x 1500', url: 'https://images.unsplash.com/photo-1505693416388-b034680c5006?auto=format&fit=crop&w=400&q=80' },
  { id: 'img2', name: '721c2aef-e3f5-472d...jpg', type: 'image', size: '859.6 KB', dimensions: '1500 x 1500', url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80' },
  { id: 'img3', name: '487feb1d-865e-49fb...png', type: 'image', size: '2.9 MB', dimensions: '1801 x 1351', url: 'https://images.unsplash.com/photo-1522771753035-4a500025fa42?auto=format&fit=crop&w=400&q=80' },
  { id: 'img4', name: 'colchon_para_camio...mp4', type: 'video', size: '16.5 MB', dimensions: '1464 x 600' },
  { id: 'img5', name: '81apcASF9zL.jpg', type: 'image', size: '401.9 KB', dimensions: '2500 x 2500', url: 'https://images.unsplash.com/photo-1584621159576-142a68689322?auto=format&fit=crop&w=400&q=80' },
  { id: 'img6', name: '811FT+Y1e3L.jpg', type: 'image', size: '396.1 KB', dimensions: '2500 x 2500', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80' },
  { id: 'img7', name: 'Manhattan_Lifestyle.jpg', type: 'image', size: '1.2 MB', dimensions: '1920 x 1080', url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=400&q=80' },
  { id: 'img8', name: 'Texture_Detail_Zoom.png', type: 'image', size: '2.1 MB', dimensions: '2000 x 2000', url: 'https://images.unsplash.com/photo-1517817748493-49ec54a32465?auto=format&fit=crop&w=400&q=80' },
];

const CreativeAssetsLibrary = ({ onSelect }: { onSelect: (url: string) => void }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center bg-white">
         <div className="flex gap-2">
            <button className="bg-primary-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary-700 transition-colors">
              Cargar recursos
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-200">
              Obtener más recursos
            </button>
         </div>
         <div className="flex gap-2 items-center flex-1 justify-end">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por nombre, etiqueta o ASIN" 
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
               <Filter size={18} />
            </button>
            <div className="flex border border-gray-300 rounded overflow-hidden">
               <button className="p-2 bg-gray-100 text-gray-800"><Grid size={18} /></button>
               <button className="p-2 bg-white text-gray-500 hover:bg-gray-50"><List size={18} /></button>
            </div>
         </div>
      </div>

      <div className="px-6 py-2 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
         <div className="text-sm font-bold text-gray-800">614 recursos <span className="text-primary-600 ml-2 font-normal cursor-pointer hover:underline">Seleccionar todo</span></div>
         <div className="flex items-center gap-2">
           <span className="text-sm text-gray-500">Ordenar por:</span>
           <select className="text-sm border-none bg-transparent font-medium text-gray-800 focus:ring-0 cursor-pointer">
             <option>Añadido: Del más reciente al más antiguo</option>
             <option>Nombre: A-Z</option>
             <option>Tamaño: Mayor a Menor</option>
           </select>
         </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {MOCK_CREATIVE_ASSETS.map((asset) => (
              <div 
                key={asset.id} 
                onClick={() => {
                  setSelectedId(asset.id);
                  if(asset.type === 'image' && asset.url) onSelect(asset.url);
                }}
                className={`group bg-white rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer relative flex flex-col ${selectedId === asset.id ? 'ring-2 ring-primary-500 border-transparent' : 'border-gray-200'}`}
              >
                {/* Checkbox Overlay */}
                <div className="absolute top-2 left-2 z-10">
                   <input 
                     type="checkbox" 
                     checked={selectedId === asset.id}
                     readOnly
                     className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer" 
                   />
                </div>
                
                {/* Options Menu */}
                <button className="absolute top-2 right-2 z-10 p-1 bg-white/80 rounded hover:bg-white text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                   <MoreVertical size={14} />
                </button>

                {/* Content */}
                <div className="aspect-square flex items-center justify-center bg-gray-50 border-b border-gray-100 overflow-hidden relative">
                   {asset.type === 'folder' ? (
                     <Folder size={64} className="text-gray-400 fill-gray-200" />
                   ) : asset.type === 'video' ? (
                     <div className="flex flex-col items-center text-gray-400">
                        <Video size={48} className="mb-2" />
                        <span className="text-xs font-mono">MP4</span>
                     </div>
                   ) : (
                     <img src={asset.url} alt={asset.name} className="w-full h-full object-contain" />
                   )}
                </div>

                {/* Footer Meta */}
                <div className="p-3">
                   <p className="text-xs font-medium text-gray-900 truncate mb-1" title={asset.name}>{asset.name}</p>
                   {asset.type === 'folder' ? (
                     <p className="text-[10px] text-gray-500">{asset.itemCount} Activos • 0 Grupos</p>
                   ) : (
                     <div className="flex justify-between items-center text-[10px] text-gray-400">
                        <span>{asset.size}</span>
                        <span>{asset.dimensions}</span>
                     </div>
                   )}
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const MarketplaceDashboard = ({ platform, isMiravia }: { platform: string, isMiravia: boolean }) => {
  const colorClass = isMiravia ? 'text-pink-600 bg-pink-50 border-pink-100' : 'text-orange-600 bg-orange-50 border-orange-100';
  const bgHeader = isMiravia ? 'bg-gradient-to-r from-pink-600 to-purple-600' : 'bg-gradient-to-r from-orange-500 to-yellow-500';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Banner */}
      <div className={`${bgHeader} rounded-xl p-8 text-white shadow-lg relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <ShoppingBag size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Integración {platform}</h2>
              <p className="text-white/80">Gestión centralizada de catálogo y pedidos.</p>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
             <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium">
                <CheckCircle size={16} className="text-green-300" /> Conexión Activa
             </div>
             <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium">
                <RefreshCw size={16} className="text-blue-200" /> Sincronización: 5 min
             </div>
          </div>
        </div>
        {/* Background Decorative Pattern */}
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Pedidos Hoy</h3>
            <div className="flex items-center justify-between">
               <span className="text-2xl font-bold text-gray-900">{isMiravia ? 24 : 156}</span>
               <span className={`text-xs font-bold px-2 py-1 rounded-full ${isMiravia ? 'bg-green-100 text-green-700' : 'bg-green-100 text-green-700'}`}>+12%</span>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Ingresos {platform}</h3>
            <div className="flex items-center justify-between">
               <span className="text-2xl font-bold text-gray-900">${isMiravia ? '1,240' : '12,450'}</span>
               <TrendingUp size={20} className="text-gray-400" />
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Errores Sincro</h3>
            <div className="flex items-center justify-between">
               <span className="text-2xl font-bold text-gray-900">0</span>
               <CheckCircle size={20} className="text-green-500" />
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Buy Box Win</h3>
            <div className="flex items-center justify-between">
               <span className="text-2xl font-bold text-gray-900">94%</span>
               <div className="h-2 w-16 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 w-[94%]"></div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sync Status Column */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Estado de Sincronización</h3>
              <button className="text-sm text-primary-600 font-medium hover:underline">Ver Logs</button>
           </div>
           <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                 <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Package size={20}/></div>
                    <div>
                       <p className="font-bold text-gray-900">Inventario</p>
                       <p className="text-xs text-gray-500">Última actualización: Hace 2 min</p>
                    </div>
                 </div>
                 <span className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Sincronizado
                 </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                 <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-2 rounded-full text-purple-600"><Settings size={20}/></div>
                    <div>
                       <p className="font-bold text-gray-900">Precios y Ofertas</p>
                       <p className="text-xs text-gray-500">Última actualización: Hace 15 min</p>
                    </div>
                 </div>
                 <span className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Sincronizado
                 </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                 <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-2 rounded-full text-orange-600"><Truck size={20}/></div>
                    <div>
                       <p className="font-bold text-gray-900">Pedidos y Tracking</p>
                       <p className="text-xs text-gray-500">Última actualización: En tiempo real</p>
                    </div>
                 </div>
                 <span className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Escuchando
                 </span>
              </div>
           </div>
        </div>

        {/* Configuration Column */}
        <div className="space-y-6">
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Configuración Rápida</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Sincronizar Stock 0</span>
                    <div className="relative inline-block w-10 h-5 bg-green-500 rounded-full cursor-pointer transition-colors">
                       <span className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow"></span>
                    </div>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Multiplicador Precio</span>
                    <input type="number" className="w-20 px-2 py-1 text-sm border border-gray-300 rounded text-right" defaultValue="1.05" />
                 </div>
                 <hr className="border-gray-100" />
                 <button className={`w-full py-2 rounded-lg text-sm font-bold border ${colorClass} hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}>
                    <Globe size={16} /> Ir a panel de {platform}
                 </button>
                 <button className="w-full py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 flex items-center justify-center gap-2">
                    <LinkIcon size={16} /> Mapeo de Categorías
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const MarketplaceOrders = ({ platform, addToast }: { platform: string, addToast: (msg: string, type: 'success' | 'error' | 'info') => void }) => {
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate Fetch
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      // Filter by platform logic would normally be here
      setOrders(MOCK_MARKETPLACE_ORDERS.filter(o => o.platform === platform || (platform === 'Amazon' && o.platform !== 'Miravia')));
      setIsLoading(false);
    }, 500);
  }, [platform]);

  const handlePrintLabel = (orderId: string, externalId: string) => {
    addToast(`Generando etiqueta para ${externalId}...`, 'info');
    setTimeout(() => {
      addToast(`Etiqueta generada exitosamente para ${externalId}`, 'success');
    }, 1500);
  };

  const handleShipOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, shippingStatus: 'Shipped' as const } : o));
    addToast(`Pedido ${orderId} marcado como ENVIADO`, 'success');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in">
       {/* Toolbar */}
       <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center bg-gray-50 gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input type="text" placeholder="Buscar ID pedido externo..." className="w-full sm:w-64 pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
             </div>
             <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50">
               <Filter size={14} /> Filtros
             </button>
          </div>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2 shadow-sm">
             <Download size={16} /> Exportar
          </button>
       </div>

       <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm">
             <thead className="bg-gray-100 text-gray-600 font-medium uppercase text-xs">
                <tr>
                   <th className="px-6 py-3">ID {platform}</th>
                   <th className="px-6 py-3">Producto</th>
                   <th className="px-6 py-3">Cliente</th>
                   <th className="px-6 py-3">Fecha</th>
                   <th className="px-6 py-3 text-center">Estado Envío</th>
                   <th className="px-6 py-3 text-right">Total</th>
                   <th className="px-6 py-3 text-right">Gestión</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={7} className="text-center py-10">Cargando pedidos...</td></tr>
                ) : orders.map(order => (
                   <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <img 
                              src={platform === 'Amazon' ? "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Logo_of_Miravia.png/220px-Logo_of_Miravia.png"} 
                              className="w-4 h-4 object-contain"
                              alt=""
                           />
                           <span className="font-mono text-xs font-bold text-gray-700">{order.externalOrderId}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 ml-6">{order.id}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate" title={order.products}>{order.products}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                              {order.customerName.charAt(0)}
                           </div>
                           <span className="text-gray-700">{order.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 text-center">
                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                            order.shippingStatus === 'Pending Shipment' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                            order.shippingStatus === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            order.shippingStatus === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                            'bg-red-50 text-red-700 border-red-100'
                         }`}>
                            {order.shippingStatus === 'Pending Shipment' && <Box size={12}/>}
                            {order.shippingStatus === 'Shipped' && <Truck size={12}/>}
                            {order.shippingStatus === 'Delivered' && <CheckCircle size={12}/>}
                            {order.shippingStatus === 'Pending Shipment' ? 'Pendiente' : 
                             order.shippingStatus === 'Shipped' ? 'Enviado' : 
                             order.shippingStatus === 'Delivered' ? 'Entregado' : order.shippingStatus}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">${order.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2 opacity-100">
                            {order.shippingStatus === 'Pending Shipment' ? (
                               <>
                                 <button 
                                   onClick={() => handlePrintLabel(order.id, order.externalOrderId)}
                                   className="p-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors shadow-sm"
                                   title="Imprimir Etiqueta"
                                 >
                                    <Printer size={16} />
                                 </button>
                                 <button 
                                   onClick={() => handleShipOrder(order.id)}
                                   className="p-1.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors shadow-sm"
                                   title="Marcar como Enviado"
                                 >
                                    <Truck size={16} />
                                 </button>
                               </>
                            ) : (
                               <button 
                                  onClick={() => addToast('Descargando comprobante...', 'info')}
                                  className="p-1.5 bg-white border border-gray-200 text-gray-400 rounded-lg hover:bg-gray-50 hover:text-gray-600 transition-colors"
                                  title="Ver Albarán"
                               >
                                  <FileText size={16} />
                               </button>
                            )}
                            <button className="p-1.5 bg-white border border-gray-200 text-gray-400 rounded-lg hover:bg-gray-50 hover:text-gray-600 transition-colors">
                               <MoreVertical size={16} />
                            </button>
                         </div>
                      </td>
                   </tr>
                ))}
                {!isLoading && orders.length === 0 && (
                   <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-400 flex flex-col items-center justify-center">
                         <div className="bg-gray-50 p-4 rounded-full mb-3">
                            <Box size={24} className="text-gray-300" />
                         </div>
                         <p>No hay pedidos recientes en {platform}</p>
                      </td>
                   </tr>
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
};

// --- A+ CONTENT MANAGER ENHANCED ---

interface APlusModule {
  id: string;
  type: 'Banner Principal' | 'Texto con Imagen' | 'Grid 3 Columnas' | 'Comparativa' | 'Texto Estándar' | 'Imagen Estándar';
  content: string;
  image?: string;
  icon: any;
}

const APlusManager = ({ platform }: { platform: string }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<'edit' | 'preview' | null>(null);
  
  // State for Editing
  const [activeModules, setActiveModules] = useState<APlusModule[]>([]);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [isAssetsLibraryOpen, setIsAssetsLibraryOpen] = useState(false);

  const initialModules: APlusModule[] = [
    { id: '1', type: 'Banner Principal', content: 'Cabecero de alta gama con acabados premium', image: 'https://images.unsplash.com/photo-1505693416388-b034680c5006?auto=format&fit=crop&w=800&q=80', icon: FileImage },
    { id: '2', type: 'Texto Estándar', content: 'Descripción detallada de las características técnicas del producto.', icon: AlignLeft },
    { id: '3', type: 'Grid 3 Columnas', content: 'Características técnicas', icon: LayoutGrid },
  ];

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setActiveModules([...initialModules]); // Load mock data
    setModalMode('edit');
    setEditingModuleId(initialModules[0].id); // Select first by default
  };

  const handlePreview = (product: Product) => {
    setSelectedProduct(product);
    setActiveModules([...initialModules]);
    setModalMode('preview');
  };

  const handleClose = () => {
    setModalMode(null);
    setSelectedProduct(null);
    setEditingModuleId(null);
    setIsAssetsLibraryOpen(false);
  };

  const handleAddModule = (type: APlusModule['type'], icon: any) => {
    const newModule: APlusModule = {
      id: Date.now().toString(),
      type,
      content: 'Nuevo contenido...',
      icon
    };
    setActiveModules([...activeModules, newModule]);
    setEditingModuleId(newModule.id);
  };

  const handleUpdateContent = (text: string) => {
    if (!editingModuleId) return;
    setActiveModules(prev => prev.map(m => m.id === editingModuleId ? { ...m, content: text } : m));
  };

  const handleSelectImage = (url: string) => {
    if (!editingModuleId) return;
    setActiveModules(prev => prev.map(m => m.id === editingModuleId ? { ...m, image: url } : m));
    setIsAssetsLibraryOpen(false);
  };

  const currentModule = activeModules.find(m => m.id === editingModuleId);

  return (
    <div className="animate-in fade-in">
       <div className="flex justify-between items-center mb-6">
          <div>
             <h3 className="text-lg font-bold text-gray-900">Gestor de Contenido A+</h3>
             <p className="text-sm text-gray-500">Enriquece las fichas de producto con banners y descripciones visuales.</p>
          </div>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2">
             <Plus size={16} /> Crear Nuevo Proyecto
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PRODUCTS.slice(0, 3).map((product, idx) => (
             <div key={product.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="h-32 bg-gray-100 relative overflow-hidden">
                   {/* Mock Banner */}
                   <img 
                     src={`https://images.unsplash.com/photo-${idx === 0 ? '1505693416388-b034680c5006' : idx === 1 ? '1584621159576-142a68689322' : '1550684848-fac1c5b4e853'}?auto=format&fit=crop&w=600&q=80`} 
                     className="w-full h-full object-cover opacity-80" 
                     alt="" 
                   />
                   <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold shadow-sm text-green-600 flex items-center gap-1">
                      <CheckCircle size={10} /> Publicado
                   </div>
                </div>
                <div className="p-4">
                   <h4 className="font-bold text-gray-900 mb-1 truncate">{product.name}</h4>
                   <p className="text-xs text-gray-500 mb-4">SKU: {product.sku}</p>
                   
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                         <FileImage size={14} className="text-gray-400" /> Banner Principal (970x600)
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                         <LayoutGrid size={14} className="text-gray-400" /> Módulo Comparativo
                      </div>
                   </div>

                   <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="flex-1 py-1.5 text-xs font-bold text-gray-700 border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
                      >
                         <Edit size={12} /> Editar
                      </button>
                      <button 
                        onClick={() => handlePreview(product)}
                        className="flex-1 py-1.5 text-xs font-bold text-gray-700 border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
                      >
                         <Eye size={12} /> Previsualizar
                      </button>
                   </div>
                </div>
             </div>
          ))}
          
          {/* Add Placeholder */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center min-h-[300px] text-gray-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer">
             <Plus size={32} className="mb-2" />
             <span className="font-medium">Asignar Contenido a Producto</span>
          </div>
       </div>

       {/* MODAL IMPLEMENTATION */}
       <MarketplaceModal
         isOpen={!!selectedProduct}
         onClose={handleClose}
         title={modalMode === 'edit' ? `Editar Contenido A+: ${selectedProduct?.name}` : `Vista Previa: ${selectedProduct?.name}`}
         size="xl"
         footer={
            modalMode === 'edit' ? (
               <>
                 <button onClick={handleClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                 <button onClick={handleClose} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 shadow-sm flex items-center gap-2">
                    <Save size={16} /> Guardar y Publicar
                 </button>
               </>
            ) : (
               <button onClick={handleClose} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">Cerrar Vista Previa</button>
            )
         }
       >
          {modalMode === 'edit' && (
             <div className="flex flex-col md:flex-row h-[700px]">
                {/* Module List Sidebar */}
                <div className="w-full md:w-1/4 border-r border-gray-200 bg-white flex flex-col">
                   <div className="p-4 border-b border-gray-100">
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Módulos Activos</h4>
                      <div className="space-y-2 overflow-y-auto max-h-[400px]">
                        {activeModules.map((mod, i) => (
                            <div 
                              key={mod.id} 
                              onClick={() => setEditingModuleId(mod.id)}
                              className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer border transition-all ${editingModuleId === mod.id ? 'bg-primary-50 border-primary-200 ring-1 ring-primary-100' : 'bg-white border-gray-200 hover:border-primary-300'}`}
                            >
                              <div className="text-gray-400 cursor-grab"><Move size={14}/></div>
                              <div className={`p-2 rounded ${editingModuleId === mod.id ? 'bg-white text-primary-600' : 'bg-gray-100 text-gray-500'}`}><mod.icon size={16}/></div>
                              <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium truncate ${editingModuleId === mod.id ? 'text-primary-900' : 'text-gray-900'}`}>{mod.type}</p>
                                  <p className="text-[10px] text-gray-400 truncate">Módulo #{i+1}</p>
                              </div>
                            </div>
                        ))}
                      </div>
                   </div>
                   
                   <div className="p-4 mt-auto bg-gray-50 border-t border-gray-200">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">Añadir Módulo</p>
                      <div className="grid grid-cols-2 gap-2">
                         <button onClick={() => handleAddModule('Texto Estándar', AlignLeft)} className="p-2 bg-white border border-gray-200 rounded text-xs hover:border-primary-400 hover:text-primary-600 flex flex-col items-center gap-1">
                            <AlignLeft size={16} /> Texto
                         </button>
                         <button onClick={() => handleAddModule('Imagen Estándar', FileImage)} className="p-2 bg-white border border-gray-200 rounded text-xs hover:border-primary-400 hover:text-primary-600 flex flex-col items-center gap-1">
                            <FileImage size={16} /> Imagen
                         </button>
                         <button onClick={() => handleAddModule('Grid 3 Columnas', LayoutGrid)} className="p-2 bg-white border border-gray-200 rounded text-xs hover:border-primary-400 hover:text-primary-600 flex flex-col items-center gap-1">
                            <LayoutGrid size={16} /> Grid
                         </button>
                         <button onClick={() => handleAddModule('Comparativa', Maximize)} className="p-2 bg-white border border-gray-200 rounded text-xs hover:border-primary-400 hover:text-primary-600 flex flex-col items-center gap-1">
                            <Maximize size={16} /> Tabla
                         </button>
                      </div>
                   </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                    {currentModule ? (
                       <div className="max-w-2xl mx-auto space-y-6">
                          
                          {/* Dynamic Editor Based on Type */}
                          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                             <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Edit size={18} className="text-primary-600"/> Editando: {currentModule.type}
                             </h3>

                             {/* TEXT EDITOR */}
                             <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">Contenido de Texto</label>
                                <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
                                   <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2">
                                      <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><Type size={14}/></button>
                                      <button className="p-1 hover:bg-gray-200 rounded text-gray-600 font-bold">B</button>
                                      <button className="p-1 hover:bg-gray-200 rounded text-gray-600 italic">I</button>
                                      <div className="w-px h-4 bg-gray-300 mx-1 self-center"></div>
                                      <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><AlignLeft size={14}/></button>
                                   </div>
                                   <textarea 
                                      value={currentModule.content}
                                      onChange={(e) => handleUpdateContent(e.target.value)}
                                      rows={5}
                                      className="w-full p-3 border-none focus:ring-0 text-sm text-gray-700 resize-none"
                                      placeholder="Escribe aquí el contenido del módulo..."
                                   />
                                </div>
                             </div>

                             {/* IMAGE SELECTOR TRIGGER */}
                             {(currentModule.type.includes('Imagen') || currentModule.type.includes('Banner')) && (
                                <div className="mt-6">
                                   <label className="block text-sm font-medium text-gray-700 mb-2">Recurso Gráfico</label>
                                   
                                   {currentModule.image ? (
                                      <div className="relative group rounded-lg overflow-hidden border border-gray-200">
                                         <img src={currentModule.image} alt="Selected" className="w-full h-48 object-cover" />
                                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button 
                                              onClick={() => setIsAssetsLibraryOpen(true)}
                                              className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100 flex items-center gap-1"
                                            >
                                               <RefreshCw size={12}/> Cambiar
                                            </button>
                                            <button 
                                              onClick={() => handleSelectImage('')}
                                              className="bg-white text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 flex items-center gap-1"
                                            >
                                               <Trash2 size={12}/> Quitar
                                            </button>
                                         </div>
                                      </div>
                                   ) : (
                                      <div 
                                        onClick={() => setIsAssetsLibraryOpen(true)}
                                        className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center text-gray-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all cursor-pointer"
                                      >
                                         <ImageIcon size={24} className="mb-2" />
                                         <span className="text-sm font-medium">Seleccionar de Galería Creativa</span>
                                      </div>
                                   )}
                                </div>
                             )}
                          </div>

                          {/* PREVIEW BOX */}
                          <div className="border-t border-gray-200 pt-6">
                             <p className="text-xs font-bold text-gray-400 uppercase mb-2">Vista Previa en Vivo</p>
                             <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                                {currentModule.image && (
                                   <img src={currentModule.image} alt="" className="w-full h-40 object-cover rounded mb-3" />
                                )}
                                <p className="text-gray-800 text-sm whitespace-pre-wrap">{currentModule.content}</p>
                             </div>
                          </div>

                       </div>
                    ) : (
                       <div className="h-full flex flex-col items-center justify-center text-gray-400">
                          <Edit size={48} className="text-gray-300 mb-4" />
                          <p>Selecciona un módulo a la izquierda para editarlo</p>
                       </div>
                    )}
                </div>
             </div>
          )}

          {modalMode === 'preview' && (
             <div className="bg-gray-100 p-8 rounded-lg min-h-full">
                <div className="bg-white max-w-4xl mx-auto shadow-sm border border-gray-200">
                   {/* Fake Marketplace Header */}
                   <div className="border-b border-gray-200 p-4 flex items-start gap-6">
                      <div className="w-32 h-32 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                         <img src="https://images.unsplash.com/photo-1505693416388-b034680c5006?auto=format&fit=crop&w=200&q=80" alt="" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1">
                         <h2 className="text-xl font-medium text-gray-900 leading-tight mb-2">{selectedProduct?.name} - {platform} Edition</h2>
                         <div className="flex items-center gap-1 text-yellow-400 mb-2">
                            {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
                            <span className="text-sm text-blue-600 ml-1 hover:underline cursor-pointer">452 valoraciones</span>
                         </div>
                         <div className="text-2xl font-bold text-gray-900 mb-2">${selectedProduct?.price.toFixed(2)}</div>
                         <p className="text-sm text-gray-600">Envío GRATIS. Entrega mañana.</p>
                      </div>
                   </div>

                   {/* A+ Content Simulation */}
                   <div className="p-8 space-y-8">
                      <div className="text-center">
                         <h3 className="text-xl font-bold text-orange-600 mb-4">Desde el fabricante</h3>
                         {activeModules.map((mod, i) => (
                           <div key={i} className="mb-8 last:mb-0">
                              {mod.image && (
                                <div className="w-full h-64 bg-gray-100 rounded mb-4 overflow-hidden relative">
                                    <img src={mod.image} alt="" className="w-full h-full object-cover" />
                                </div>
                              )}
                              {mod.content && <p className="text-gray-700 leading-relaxed text-left">{mod.content}</p>}
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          )}
       </MarketplaceModal>

       {/* ASSETS LIBRARY MODAL OVERLAY */}
       {isAssetsLibraryOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAssetsLibraryOpen(false)}></div>
             <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                   <h3 className="font-bold text-gray-900">Seleccionar Recurso Creativo</h3>
                   <button onClick={() => setIsAssetsLibraryOpen(false)}><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-hidden">
                   <CreativeAssetsLibrary onSelect={handleSelectImage} />
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

const VariationManager = ({ platform }: { platform: string }) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Mock variations
  const attributes = [
     { label: 'Color', values: ['Blanco', 'Gris', 'Azul Marino'] },
     { label: 'Medida', values: ['90x190', '135x190', '150x200'] },
     { label: 'Material', values: ['Viscoelástica', 'Látex', 'Muelles'] }
  ];

  return (
    <div className="animate-in fade-in flex flex-col lg:flex-row gap-6 h-[calc(100vh-250px)]">
       {/* Product Selector Sidebar */}
       <div className="w-full lg:w-1/4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input type="text" placeholder="Buscar producto..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm" />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
             {MOCK_PRODUCTS.map(p => (
                <button 
                  key={p.id}
                  onClick={() => setSelectedProduct(p.id)}
                  className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3 ${selectedProduct === p.id ? 'bg-primary-50 border-l-4 border-l-primary-600' : ''}`}
                >
                   <div className="h-10 w-10 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center text-gray-400">
                      <Box size={16} />
                   </div>
                   <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${selectedProduct === p.id ? 'text-primary-800' : 'text-gray-900'}`}>{p.name}</p>
                      <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                   </div>
                </button>
             ))}
          </div>
       </div>

       {/* Editor Area */}
       <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-y-auto">
          {!selectedProduct ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Palette size={48} className="mb-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-600">Selecciona un producto para gestionar sus variaciones</p>
                <p className="text-sm">Configura imágenes específicas por color y dimensiones.</p>
             </div>
          ) : (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-lg font-bold text-gray-900">Matriz de Imágenes</h3>
                      <p className="text-sm text-gray-500">Asigna imágenes principales que cambiarán según la selección del usuario en {platform}.</p>
                   </div>
                   <button className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700">Guardar Cambios</button>
                </div>

                {/* Attribute Selector Mock */}
                <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                   {attributes.map((attr, idx) => (
                      <div key={idx} className="min-w-[150px]">
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{attr.label}</label>
                         <select className="w-full border-gray-300 rounded-md text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500">
                            {attr.values.map(v => <option key={v}>{v}</option>)}
                         </select>
                      </div>
                   ))}
                </div>

                {/* Image Grid for Selected Variation */}
                <div>
                   <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <ImageIcon size={18} className="text-primary-600" />
                      Imágenes para: <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded text-sm font-normal">Blanco / 150x200 / Visco</span>
                   </h4>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {/* Main Image */}
                      <div className="relative aspect-square bg-gray-100 rounded-lg border-2 border-primary-500 overflow-hidden group">
                         <img src="https://images.unsplash.com/photo-1505693416388-b034680c5006?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="" />
                         <div className="absolute top-2 left-2 bg-primary-600 text-white text-[10px] font-bold px-2 py-1 rounded">PRINCIPAL</div>
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button className="p-1.5 bg-white rounded-full text-gray-700 hover:text-primary-600"><Edit size={14}/></button>
                         </div>
                      </div>
                      
                      {/* Secondary Images */}
                      {[1,2,3].map(i => (
                         <div key={i} className="relative aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden group hover:border-gray-400 transition-colors">
                            <img src={`https://images.unsplash.com/photo-${i === 1 ? '1584621159576-142a68689322' : '1550684848-fac1c5b4e853'}?auto=format&fit=crop&w=300&q=80`} className="w-full h-full object-cover" alt="" />
                            <div className="absolute top-2 left-2 bg-gray-800/70 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">#{i+1}</div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button className="p-1.5 bg-white rounded-full text-gray-700 hover:text-primary-600"><Edit size={14}/></button>
                             </div>
                         </div>
                      ))}

                      {/* Add Button */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer aspect-square">
                         <Plus size={24} />
                         <span className="text-xs font-medium mt-1">Añadir</span>
                      </div>
                   </div>
                </div>
             </div>
          )}
       </div>
    </div>
  );
};

// --- MAIN PAGE ---

export const Marketplace: React.FC = () => {
  const { platform } = useParams();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'aplus' | 'variations'>('dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Normalize platform string
  const currentPlatform = platform && platform.toLowerCase() === 'miravia' ? 'Miravia' : 'Amazon';
  const isMiravia = currentPlatform === 'Miravia';

  // Toast Handler
  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6 relative">
       <ToastNotification toasts={toasts} removeToast={removeToast} />
       
       {/* Tab Navigation */}
       <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <LayoutGrid size={18} /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ShoppingBag size={18} /> Gestión de Pedidos
            </button>
            <button
              onClick={() => setActiveTab('aplus')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'aplus'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileImage size={18} /> Contenido A+
            </button>
            <button
              onClick={() => setActiveTab('variations')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'variations'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Palette size={18} /> Imágenes por Variación
            </button>
          </nav>
       </div>

       {/* Tab Content */}
       <div className="min-h-[500px]">
          {activeTab === 'dashboard' && <MarketplaceDashboard platform={currentPlatform} isMiravia={isMiravia} />}
          {activeTab === 'orders' && <MarketplaceOrders platform={currentPlatform} addToast={addToast} />}
          {activeTab === 'aplus' && <APlusManager platform={currentPlatform} />}
          {activeTab === 'variations' && <VariationManager platform={currentPlatform} />}
       </div>
    </div>
  );
};
