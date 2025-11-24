import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import Barcode from 'react-barcode';
import { 
  Truck, 
  Package, 
  MapPin, 
  Calendar, 
  Search, 
  Filter, 
  ChevronRight, 
  MoreHorizontal, 
  FileText, 
  Printer, 
  CheckCircle, 
  AlertCircle,
  X,
  History,
  TrendingUp,
  DollarSign,
  User,
  Send,
  AlertTriangle,
  QrCode,
  Scan,
  Download
} from 'lucide-react';
import { MOCK_SHIPMENTS, MOCK_ORDERS, MOCK_PRODUCTS } from '../constants';
import { Shipment, ShipmentAction } from '../types';

// --- Helper Components ---

const StatusBadge = ({ status }: { status: Shipment['status'] }) => {
  const styles = {
    'Ready': 'bg-gray-100 text-gray-700 border-gray-200',
    'In Transit': 'bg-blue-50 text-blue-700 border-blue-200',
    'Delivered': 'bg-green-50 text-green-700 border-green-200',
    'Exception': 'bg-red-50 text-red-700 border-red-200',
  };

  const icons = {
    'Ready': <Package size={12} />,
    'In Transit': <Truck size={12} />,
    'Delivered': <CheckCircle size={12} />,
    'Exception': <AlertCircle size={12} />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {icons[status]}
      {status === 'Ready' ? 'Listo' : status === 'In Transit' ? 'En Tránsito' : status === 'Delivered' ? 'Entregado' : 'Incidencia'}
    </span>
  );
};

// --- Modal for Label Preview (Real Codes) ---
interface LabelPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
}

const LabelPreviewModal: React.FC<LabelPreviewModalProps> = ({ isOpen, onClose, shipment }) => {
  if (!isOpen || !shipment) return null;

  // Find linked data
  const order = MOCK_ORDERS.find(o => o.id === shipment.orderId);
  const productInfo = MOCK_PRODUCTS.find(p => order?.products.includes(p.name)) || MOCK_PRODUCTS[0];
  const sku = productInfo?.sku || 'GEN-SKU-001';
  const productName = order?.products || 'Producto Genérico';
  
  // Data for codes
  const trackingData = shipment.trackingNumber || shipment.id;
  const qrData = JSON.stringify({
    id: shipment.id,
    order: shipment.orderId,
    sku: sku,
    action: 'scan_lookup'
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all scale-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Printer size={18} className="text-gray-500"/> Etiqueta Generada
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Label Content - Styled to look like a Shipping Label */}
        <div className="p-8 bg-gray-200 overflow-y-auto flex justify-center">
           <div className="bg-white w-full max-w-[380px] border-2 border-gray-800 p-4 shadow-sm relative text-gray-900">
              
              {/* Header Label */}
              <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-4">
                 <div className="font-black text-3xl uppercase italic tracking-tighter">
                    {shipment.provider}
                 </div>
                 <div className="text-right">
                    <div className="font-bold text-xs">PRIORITY EXPRESS</div>
                    <div className="font-mono text-xl font-bold">{shipment.weight} KG</div>
                 </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 gap-4 mb-4 border-b border-gray-300 pb-4">
                 <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Origen (From):</span>
                    <p className="text-xs font-medium">{shipment.originAddress}</p>
                    <p className="text-xs">Madrid, ES 28001</p>
                 </div>
                 <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Destino (To):</span>
                    <p className="text-sm font-bold">{shipment.customerName}</p>
                    <p className="text-sm">{shipment.destinationAddress}</p>
                    <p className="text-sm font-bold">{shipment.city}, {shipment.zipCode}</p>
                 </div>
              </div>

              {/* Details Section */}
              <div className="bg-gray-50 border border-gray-200 p-3 mb-4 rounded-sm">
                 <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>
                       <span className="text-gray-400 block text-[9px] uppercase">Nº Orden</span>
                       <span className="font-mono font-bold">{shipment.orderId}</span>
                    </div>
                    <div>
                       <span className="text-gray-400 block text-[9px] uppercase">Fecha Solicitud</span>
                       <span className="font-medium">{shipment.shippingDate || new Date().toISOString().split('T')[0]}</span>
                    </div>
                 </div>
                 <div className="mb-2">
                     <span className="text-gray-400 block text-[9px] uppercase">Producto</span>
                     <span className="font-medium block truncate">{productName}</span>
                 </div>
                 <div>
                     <span className="text-gray-400 block text-[9px] uppercase">SKU / Ref</span>
                     <span className="font-mono font-bold bg-gray-200 px-1">{sku}</span>
                 </div>
              </div>

              {/* Real QR and Barcode Section */}
              <div className="flex flex-col items-center justify-center pt-2">
                 <div className="flex w-full justify-between items-end mb-4">
                    <div className="flex-1 overflow-hidden">
                       <div className="w-full">
                         <Barcode 
                            value={trackingData} 
                            width={1.5} 
                            height={40} 
                            fontSize={10}
                            displayValue={true}
                            margin={0}
                         />
                       </div>
                    </div>
                    <div className="ml-2 border-2 border-black p-1 bg-white">
                       <QRCode 
                        value={qrData} 
                        size={80} 
                        level="M"
                       />
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2 text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    <Scan size={12} />
                    <span>Código QR apto para escáner móvil</span>
                 </div>
              </div>

           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
           <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center gap-2">
              <Download size={16} /> PDF
           </button>
           <button 
             onClick={() => alert('Enviando comando a impresora térmica...')}
             className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-black flex items-center justify-center gap-2 shadow-lg"
           >
              <Printer size={16} /> Imprimir Etiqueta
           </button>
        </div>
      </div>
    </div>
  );
};


// --- Modal for Shipment Details & Actions ---
interface ShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
  onAddAction: (id: string, action: string, note?: string) => void;
  onPrint: () => void; // New prop
}

const ShipmentModal: React.FC<ShipmentModalProps> = ({ isOpen, onClose, shipment, onAddAction, onPrint }) => {
  const [note, setNote] = useState('');

  if (!isOpen || !shipment) return null;

  const handleAddLog = (actionType: string) => {
    onAddAction(shipment.id, actionType, note);
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md transform transition ease-in-out duration-500 bg-white shadow-xl flex flex-col h-full animate-in slide-in-from-right">
          
          {/* Header */}
          <div className="px-6 py-6 bg-gray-50 border-b border-gray-200 flex items-start justify-between">
            <div>
               <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                 <Truck size={20} className="text-gray-500"/> Envío {shipment.id}
               </h2>
               <p className="text-sm text-gray-500 mt-1">Pedido Asoc: {shipment.orderId}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             {/* Info Cards */}
             <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Costo Generado</span>
                   <DollarSign size={16} className="text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-900">${shipment.shippingCost.toFixed(2)}</div>
                <div className="text-xs text-blue-700 mt-1">Base + {shipment.weight}kg x Tarifa {shipment.provider}</div>
             </div>

             {/* Dates Information */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <p className="text-xs text-gray-500 mb-1">Fecha Salida</p>
                   <p className="font-medium text-gray-900">{shipment.shippingDate || 'Pendiente'}</p>
                   <div className="mt-2 text-xs text-gray-400 flex items-start gap-1">
                      <MapPin size={10} className="mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{shipment.originAddress || 'Almacén Central'}</span>
                   </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <p className="text-xs text-gray-500 mb-1">Fecha Entrega</p>
                   <p className="font-medium text-gray-900">{shipment.arrivalDate || 'Pendiente'}</p>
                   <div className="mt-2 text-xs text-gray-400 flex items-start gap-1">
                      <MapPin size={10} className="mt-0.5 shrink-0" />
                      <div className="flex flex-col">
                         <span className="line-clamp-2">{shipment.destinationAddress}</span>
                         <span className="text-[10px] text-gray-300">{shipment.city}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Customer & Address */}
             <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                   <User size={16} className="text-gray-400" /> Datos de Entrega
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm space-y-2 shadow-sm">
                   <div className="font-medium text-gray-900">{shipment.customerName}</div>
                   <div className="text-gray-600">{shipment.destinationAddress}</div>
                   <div className="text-gray-600">{shipment.zipCode}, {shipment.city}</div>
                   <div className="pt-2 border-t border-gray-100 mt-2 flex justify-between text-xs text-gray-500">
                      <span>Tracking:</span>
                      <span className="font-mono font-bold text-gray-700">{shipment.trackingNumber || 'PENDIENTE'}</span>
                   </div>
                </div>
             </div>

             {/* Action Logs */}
             <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                   <History size={16} className="text-gray-400" /> Historial de Acciones
                </h3>
                <div className="relative border-l border-gray-200 ml-2 space-y-6 pl-6 pb-2">
                   {shipment.history.map((log) => (
                      <div key={log.id} className="relative">
                         <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-gray-300 border-2 border-white shadow-sm"></div>
                         <div className="flex justify-between items-start">
                            <div>
                               <p className="text-sm font-medium text-gray-900">{log.action}</p>
                               {log.note && <p className="text-xs text-gray-500 mt-0.5 bg-gray-50 p-1.5 rounded italic">"{log.note}"</p>}
                            </div>
                            <span className="text-[10px] text-gray-400">{log.date.split(' ')[1]}</span>
                         </div>
                         <p className="text-[10px] text-gray-400 mt-1">por {log.user} el {log.date.split(' ')[0]}</p>
                      </div>
                   ))}
                </div>
             </div>

             {/* Add Action Form */}
             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Registrar Gestión</h4>
                <textarea 
                  className="w-full text-sm border-gray-300 rounded-lg mb-3 p-2 focus:ring-2 focus:ring-primary-500 outline-none" 
                  rows={2} 
                  placeholder="Añadir nota o incidencia..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
                <div className="flex gap-2">
                   <button 
                     onClick={() => handleAddLog('Nota Interna')}
                     className="flex-1 bg-white border border-gray-300 text-gray-700 text-xs font-medium py-2 rounded hover:bg-gray-100"
                   >
                     Nota
                   </button>
                   <button 
                     onClick={() => handleAddLog('Reported Issue')}
                     className="flex-1 bg-white border border-red-200 text-red-600 text-xs font-medium py-2 rounded hover:bg-red-50"
                   >
                     Reportar Problema
                   </button>
                   <button 
                     onClick={() => handleAddLog('Manual Update')}
                     className="flex-1 bg-primary-600 text-white text-xs font-medium py-2 rounded hover:bg-primary-700"
                   >
                     Actualizar
                   </button>
                </div>
             </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
             <button 
               onClick={onPrint}
               className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-black flex items-center justify-center gap-2"
             >
                <Printer size={16} /> Imprimir Etiqueta
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export const Transport: React.FC = () => {
  const { provider } = useParams<{ provider: string }>();
  const currentProvider = provider?.toUpperCase() === 'DHL' ? 'DHL' : 'SEUR';
  const isDHL = currentProvider === 'DHL';

  // State
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  
  // State for Label Preview
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [shipmentForLabel, setShipmentForLabel] = useState<Shipment | null>(null);

  // Load Data
  useEffect(() => {
    // Filter Mock Data
    const filtered = MOCK_SHIPMENTS.filter(s => s.provider === currentProvider);
    setShipments(filtered);
  }, [currentProvider]);

  // Derived filtered list for UI
  const filteredList = useMemo(() => {
    return shipments.filter(s => 
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [shipments, searchTerm]);

  // Logic to check 7 days passed since arrival
  const isPendingFollowUp = (arrivalDate?: string) => {
    if (!arrivalDate) return false;
    // Mock date parsing, assuming YYYY-MM-DD
    const arrival = new Date(arrivalDate).getTime();
    const now = new Date('2025-11-13').getTime(); // Using a fixed mock 'now' consistent with MOCK_DATA context
    const diffDays = (now - arrival) / (1000 * 3600 * 24);
    return diffDays > 7;
  };

  // Calculate totals
  const totalCost = filteredList.reduce((acc, curr) => acc + curr.shippingCost, 0);
  const pendingCount = filteredList.filter(s => s.status === 'Ready' || s.status === 'In Transit').length;

  // Handlers
  const handleAddAction = (id: string, action: string, note?: string) => {
    const newLog: ShipmentAction = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      action: action,
      user: 'Jorge P.', // Current User Mock
      note: note
    };

    setShipments(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, history: [newLog, ...s.history] };
      }
      return s;
    }));
    
    // Update modal state if open
    if (selectedShipment && selectedShipment.id === id) {
       setSelectedShipment(prev => prev ? { ...prev, history: [newLog, ...prev.history] } : null);
    }
  };

  const handlePrintLabel = (shipment: Shipment) => {
     setShipmentForLabel(shipment);
     setLabelModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`rounded-xl p-8 text-white shadow-lg relative overflow-hidden ${isDHL ? 'bg-yellow-500' : 'bg-red-600'}`}>
         <div className="relative z-10 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Truck size={32} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold">Logística {currentProvider}</h2>
              </div>
              <p className="text-white/90 font-medium">Gestión de envíos, etiquetas y seguimiento de costes.</p>
            </div>
            <div className="text-right hidden sm:block">
               <p className="text-sm opacity-80">Gasto Total Acumulado</p>
               <p className="text-3xl font-bold">${totalCost.toFixed(2)}</p>
            </div>
         </div>
         {/* Pattern */}
         <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
         {/* Toolbar */}
         <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4 bg-gray-50/50">
            <div className="flex gap-2 flex-1">
               <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar envío, cliente o tracking..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  <Filter size={16} /> Filtros
               </button>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-sm text-gray-600">
                  <span className="font-bold">{pendingCount}</span> Envíos Activos
               </div>
               <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black shadow-sm">
                  Nueva Recogida
               </button>
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                  <tr>
                     <th className="px-6 py-3">ID Envío / Tracking</th>
                     <th className="px-6 py-3">Pedido / Cliente</th>
                     <th className="px-6 py-3">Salida / Origen</th>
                     <th className="px-6 py-3">Llegada / Destino</th>
                     <th className="px-6 py-3 text-center">Peso (Kg)</th>
                     <th className="px-6 py-3 text-right">Costo</th>
                     <th className="px-6 py-3 text-center">Estado</th>
                     <th className="px-6 py-3 text-right">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {filteredList.length === 0 ? (
                     <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                           No se encontraron envíos para {currentProvider}
                        </td>
                     </tr>
                  ) : filteredList.map((shipment) => {
                     const needsFollowUp = shipment.status === 'Delivered' && isPendingFollowUp(shipment.arrivalDate);
                     return (
                        <tr key={shipment.id} className="hover:bg-gray-50 transition-colors group">
                           <td className="px-6 py-4">
                              <div className="font-bold text-gray-900">{shipment.id}</div>
                              <div className="text-xs font-mono text-gray-500 mt-0.5">{shipment.trackingNumber || '---'}</div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="font-medium text-primary-600">{shipment.orderId}</div>
                              <div className="text-xs text-gray-500">{shipment.customerName}</div>
                           </td>
                           <td className="px-6 py-4 text-gray-600">
                              {shipment.shippingDate ? (
                                 <div className="flex items-center gap-1">
                                    <Calendar size={14} className="text-gray-400"/> {shipment.shippingDate}
                                 </div>
                              ) : <span className="text-gray-400 italic">Pendiente</span>}
                              <div className="text-xs text-gray-400 mt-1 flex items-start gap-1">
                                <MapPin size={10} className="mt-0.5 shrink-0" />
                                <span className="truncate max-w-[150px]">{shipment.originAddress || 'Almacén Central'}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-gray-600">
                              {shipment.arrivalDate ? (
                                 <div className="flex items-center gap-1">
                                    <Calendar size={14} className="text-gray-400"/> {shipment.arrivalDate}
                                 </div>
                              ) : <span className="text-gray-400 italic">---</span>}
                              <div className="text-xs text-gray-400 mt-1 flex items-start gap-1">
                                <MapPin size={10} className="mt-0.5 shrink-0" />
                                <div className="flex flex-col">
                                   <span className="truncate max-w-[150px]">{shipment.destinationAddress}</span>
                                   <span className="text-[10px] text-gray-300">{shipment.city}</span>
                                </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-center font-medium text-gray-700">
                              {shipment.weight}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <span className="font-bold text-gray-900">${shipment.shippingCost.toFixed(2)}</span>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <StatusBadge status={shipment.status} />
                              {needsFollowUp && (
                                 <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-orange-600 font-bold bg-orange-50 px-1 py-0.5 rounded border border-orange-100 animate-pulse">
                                    <AlertTriangle size={10} /> +7 Días sin Conf.
                                 </div>
                              )}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                 <button 
                                   onClick={() => setSelectedShipment(shipment)}
                                   className="p-1.5 border border-gray-200 rounded hover:bg-gray-100 text-gray-500 hover:text-primary-600 transition-colors" 
                                   title="Ver Detalles y Acciones"
                                 >
                                    <FileText size={16} />
                                 </button>
                                 <button 
                                   onClick={() => handlePrintLabel(shipment)}
                                   className="p-1.5 border border-gray-200 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors" title="Imprimir Etiqueta">
                                    <Printer size={16} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>

      {/* Slide-over Modal for Details */}
      <ShipmentModal 
        isOpen={!!selectedShipment} 
        onClose={() => setSelectedShipment(null)} 
        shipment={selectedShipment}
        onAddAction={handleAddAction}
        onPrint={() => selectedShipment && handlePrintLabel(selectedShipment)}
      />

      {/* New Label Preview Modal */}
      <LabelPreviewModal 
        isOpen={labelModalOpen}
        onClose={() => setLabelModalOpen(false)}
        shipment={shipmentForLabel}
      />
    </div>
  );
};