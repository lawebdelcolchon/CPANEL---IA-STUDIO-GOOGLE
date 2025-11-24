
import React, { useMemo, useState } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  Users, 
  Mail, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  UserX,
  UserCheck,
  Calendar,
  MessageSquare,
  Smartphone,
  Send,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { MOCK_ABANDONED_CARTS, MOCK_WISHLIST_STATS, MOCK_TRAFFIC_STATS, COMPANIES } from '../constants';
import { useCompany } from '../CompanyContext';
import { AbandonedCart } from '../types';

const CompanyBadge = ({ companyId }: { companyId: string }) => {
  const company = COMPANIES.find(c => c.id === companyId);
  if (!company) return null;
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${company.color} opacity-80`}>
      {company.logo}
    </span>
  );
};

// Modal Component for Scheduling
const ScheduleModal = ({ 
  isOpen, 
  onClose, 
  cart, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  cart: AbandonedCart | null; 
  onSave: (date: string, time: string, channel: 'Email' | 'WhatsApp' | 'SMS') => void;
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [channel, setChannel] = useState<'Email' | 'WhatsApp' | 'SMS'>('Email');

  if (!isOpen || !cart) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Clock size={18} className="text-primary-600"/> Programar Recuperación
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
           <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4">
              Estás programando un recordatorio para <strong>{cart.customerName || cart.guestId}</strong> por valor de <strong>${cart.totalValue}</strong>.
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Envío</label>
             <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
             <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="time" 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Canal de Notificación</label>
             <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => setChannel('Email')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all ${channel === 'Email' ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold ring-1 ring-blue-200' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                >
                  <Mail size={20} className="mb-1" /> Email
                </button>
                <button 
                  onClick={() => setChannel('WhatsApp')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all ${channel === 'WhatsApp' ? 'bg-green-50 border-green-200 text-green-700 font-bold ring-1 ring-green-200' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                >
                  <MessageSquare size={20} className="mb-1" /> WhatsApp
                </button>
                <button 
                  onClick={() => setChannel('SMS')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all ${channel === 'SMS' ? 'bg-orange-50 border-orange-200 text-orange-700 font-bold ring-1 ring-orange-200' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                >
                  <Smartphone size={20} className="mb-1" /> SMS
                </button>
             </div>
           </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
           <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
           <button 
             onClick={() => onSave(date, time, channel)}
             className="px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors"
           >
             <Send size={16} /> Programar Envío
           </button>
        </div>
      </div>
    </div>
  );
};

export const Marketing: React.FC = () => {
  const { selectedCompanyId } = useCompany();
  
  // State for Automated Scheduling
  const [carts, setCarts] = useState(MOCK_ABANDONED_CARTS);
  const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Data Filtering & Computation ---
  
  const filteredCarts = useMemo(() => {
    return selectedCompanyId === 'all' 
      ? carts 
      : carts.filter(c => c.companyId === selectedCompanyId);
  }, [selectedCompanyId, carts]);

  const wishlistItems = useMemo(() => {
    return selectedCompanyId === 'all' 
      ? MOCK_WISHLIST_STATS 
      : MOCK_WISHLIST_STATS.filter(w => w.companyId === selectedCompanyId);
  }, [selectedCompanyId]);

  const trafficData = useMemo(() => {
    return selectedCompanyId === 'all' 
      ? MOCK_TRAFFIC_STATS 
      : MOCK_TRAFFIC_STATS.filter(t => t.companyId === selectedCompanyId);
  }, [selectedCompanyId]);

  // Aggregated Stats
  const totalPotentialRevenue = filteredCarts.reduce((acc, c) => acc + c.totalValue, 0);
  const totalWishlistCount = wishlistItems.reduce((acc, w) => acc + w.count, 0);
  
  // Traffic Calculation for Chart
  const aggregatedTraffic = useMemo(() => {
    const totalRegistered = trafficData.reduce((acc, d) => acc + d.registeredVisitors, 0);
    const totalGuests = trafficData.reduce((acc, d) => acc + d.guestVisitors, 0);
    return [
      { name: 'Registrados', value: totalRegistered },
      { name: 'Invitados (Sin Registro)', value: totalGuests },
    ];
  }, [trafficData]);

  const topWishlist = [...wishlistItems].sort((a, b) => b.count - a.count).slice(0, 5);
  const COLORS = ['#3b82f6', '#94a3b8'];

  // --- Handlers ---

  const openScheduleModal = (cart: AbandonedCart) => {
    setSelectedCart(cart);
    setIsModalOpen(true);
  };

  const handleScheduleSave = (date: string, time: string, channel: 'Email' | 'WhatsApp' | 'SMS') => {
    if (!selectedCart) return;

    const updatedCarts = carts.map(c => {
      if (c.id === selectedCart.id) {
        return {
          ...c,
          recoveryStatus: 'Scheduled' as const,
          scheduledDate: date,
          scheduledTime: time,
          channel: channel
        };
      }
      return c;
    });

    setCarts(updatedCarts);
    setIsModalOpen(false);
    setSelectedCart(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Marketing y Conversión</h2>
          <p className="text-sm text-gray-500">Analiza oportunidades de venta perdidas y el comportamiento de visitantes.</p>
        </div>
        <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
          Exportar Informe
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Abandoned Carts KPI */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShoppingCart size={64} className="text-red-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
               <ShoppingCart size={20} />
            </div>
            <span className="text-sm font-medium text-gray-600">Carritos Abandonados</span>
          </div>
          <div className="flex items-baseline gap-2">
             <span className="text-3xl font-bold text-gray-900">{filteredCarts.length}</span>
             <span className="text-sm text-gray-500">usuarios</span>
          </div>
          <div className="mt-2 text-sm text-red-600 font-medium">
             ${totalPotentialRevenue.toFixed(2)} <span className="text-gray-400 font-normal">en ingresos potenciales</span>
          </div>
        </div>

        {/* Wishlist KPI */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Heart size={64} className="text-pink-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
               <Heart size={20} />
            </div>
            <span className="text-sm font-medium text-gray-600">En Favoritos</span>
          </div>
          <div className="flex items-baseline gap-2">
             <span className="text-3xl font-bold text-gray-900">{totalWishlistCount}</span>
             <span className="text-sm text-gray-500">intenciones de compra</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
             Top: <span className="font-medium text-gray-800">{topWishlist[0]?.productName || 'N/A'}</span>
          </div>
        </div>

        {/* Traffic KPI */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={64} className="text-blue-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
               <UserX size={20} />
            </div>
            <span className="text-sm font-medium text-gray-600">Visitantes sin Registro</span>
          </div>
          <div className="flex items-baseline gap-2">
             <span className="text-3xl font-bold text-gray-900">{aggregatedTraffic[1].value}</span>
             <span className="text-sm text-gray-500">esta semana</span>
          </div>
          <div className="mt-2 text-sm text-blue-600 font-medium flex items-center gap-1">
             <TrendingUp size={14} /> 12% <span className="text-gray-400 font-normal">vs semana pasada</span>
          </div>
        </div>
      </div>

      {/* --- FULL WIDTH ABANDONED CARTS TABLE --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
             <div>
                <h3 className="font-bold text-gray-900">Recuperación de Carritos</h3>
                <p className="text-sm text-gray-500">Gestiona y automatiza el contacto con clientes pendientes.</p>
             </div>
             <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold border border-red-200">
                {filteredCarts.filter(c => c.recoveryStatus === 'Pending').length} Pendientes
             </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                 <tr>
                   <th className="px-6 py-4">Usuario / Guest</th>
                   <th className="px-6 py-4">Productos en Carrito (Visual)</th>
                   {selectedCompanyId === 'all' && <th className="px-6 py-4">Empresa</th>}
                   <th className="px-6 py-4">Total</th>
                   <th className="px-6 py-4">Estado / Programación</th>
                   <th className="px-6 py-4 text-right">Acciones</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {filteredCarts.length === 0 ? (
                    <tr>
                      <td colSpan={selectedCompanyId === 'all' ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                         <div className="flex flex-col items-center justify-center gap-2">
                           <ShoppingCart className="text-gray-300" size={32} />
                           <p>No hay carritos abandonados pendientes.</p>
                         </div>
                      </td>
                    </tr>
                 ) : filteredCarts.map((cart) => (
                   <tr key={cart.id} className="hover:bg-blue-50/30 transition-colors group">
                     {/* Client Info */}
                     <td className="px-6 py-4">
                        {cart.customerName ? (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm">
                              {cart.customerName.charAt(0)}
                            </div>
                            <div>
                               <span className="font-bold text-gray-900 block">{cart.customerName}</span>
                               <span className="text-xs text-gray-500 block">Registrado</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center border-2 border-white shadow-sm">
                              <UserX size={18} />
                            </div>
                            <div>
                               <span className="font-medium text-gray-600 block italic">{cart.guestId}</span>
                               <span className="text-xs text-gray-400 block">Invitado</span>
                            </div>
                          </div>
                        )}
                     </td>

                     {/* Visual Products Stack */}
                     <td className="px-6 py-4">
                       <div className="flex items-center">
                          {cart.products.map((prod, idx) => (
                             <div 
                               key={idx} 
                               className={`relative w-10 h-10 rounded-lg border-2 border-white shadow-sm overflow-hidden bg-white -ml-3 first:ml-0 hover:z-10 hover:scale-110 transition-transform cursor-pointer`}
                               title={prod.name}
                             >
                                <img src={prod.image || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
                             </div>
                          ))}
                          {cart.products.length > 0 && (
                            <div className="ml-3">
                               <p className="text-xs font-medium text-gray-900 truncate w-32">{cart.products[0].name}</p>
                               {cart.products.length > 1 && <p className="text-[10px] text-gray-500">+{cart.products.length - 1} más</p>}
                            </div>
                          )}
                       </div>
                     </td>

                     {selectedCompanyId === 'all' && (
                        <td className="px-6 py-4"><CompanyBadge companyId={cart.companyId} /></td>
                     )}
                     
                     <td className="px-6 py-4 font-bold text-gray-900 text-base">${cart.totalValue.toFixed(2)}</td>
                     
                     {/* Status / Schedule */}
                     <td className="px-6 py-4">
                        {cart.recoveryStatus === 'Scheduled' ? (
                          <div className="flex flex-col">
                             <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded w-fit mb-1 border border-amber-100">
                                <Clock size={12} /> Programado
                             </span>
                             <span className="text-xs text-gray-500 flex items-center gap-1">
                                {cart.channel === 'WhatsApp' ? <MessageSquare size={10} className="text-green-500"/> : 
                                 cart.channel === 'SMS' ? <Smartphone size={10} className="text-orange-500"/> : 
                                 <Mail size={10} className="text-blue-500"/>}
                                {cart.scheduledDate} - {cart.scheduledTime}
                             </span>
                          </div>
                        ) : cart.recoveryStatus === 'Pending' ? (
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                             Pendiente de Acción
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 flex items-center gap-1 w-fit">
                             <UserCheck size={12} /> Recuperado
                          </span>
                        )}
                     </td>

                     {/* Actions */}
                     <td className="px-6 py-4 text-right">
                        {cart.recoveryStatus === 'Pending' && (
                           <button 
                             onClick={() => openScheduleModal(cart)}
                             className="text-xs bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-all shadow-sm flex items-center gap-2 ml-auto"
                           >
                              <Calendar size={14} /> Programar
                           </button>
                        )}
                        {cart.recoveryStatus === 'Scheduled' && (
                           <button className="text-xs text-gray-400 hover:text-gray-600 font-medium">Editar</button>
                        )}
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* TRAFFIC ANALYSIS CHART */}
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-2">Tráfico: Registrados vs Invitados</h3>
              <p className="text-sm text-gray-500 mb-6">Proporción de usuarios que navegan sin cuenta activa.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <div className="h-48 w-48 relative">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={aggregatedTraffic}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={80}
                         paddingAngle={5}
                         dataKey="value"
                       >
                         {aggregatedTraffic.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                       <Tooltip />
                     </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold text-gray-900">
                        {Math.round((aggregatedTraffic[1].value / (aggregatedTraffic[0].value + aggregatedTraffic[1].value)) * 100)}%
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Sin Registro</span>
                   </div>
                </div>
                
                <div className="space-y-3">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <div>
                         <p className="text-sm font-bold text-gray-900">{aggregatedTraffic[0].value}</p>
                         <p className="text-xs text-gray-500">Usuarios Registrados</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                      <div>
                         <p className="text-sm font-bold text-gray-900">{aggregatedTraffic[1].value}</p>
                         <p className="text-xs text-gray-500">Invitados (Guests)</p>
                      </div>
                   </div>
                </div>
              </div>
           </div>

           {/* TOP WISHLIST CHART */}
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <Heart className="text-pink-500" size={18} /> Top Productos en Favoritos
              </h3>
              
              <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topWishlist} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                       <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                       <XAxis type="number" hide />
                       <YAxis type="category" dataKey="productName" hide width={10} />
                       <Tooltip 
                         cursor={{fill: '#f8fafc'}}
                         contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                       />
                       <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>

              {/* Custom Legend/List underneath */}
              <div className="mt-4 space-y-3">
                 {topWishlist.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                       <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-gray-400 font-mono text-xs w-4">#{idx + 1}</span>
                          <span className="truncate text-gray-700">{item.productName}</span>
                          {selectedCompanyId === 'all' && <div className="scale-75"><CompanyBadge companyId={item.companyId} /></div>}
                       </div>
                       <div className="flex items-center gap-2 shrink-0">
                          <span className="font-bold text-gray-900">{item.count}</span>
                          <Heart size={12} className="text-pink-400 fill-pink-400" />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

      </div>

      {/* MODAL INJECTION */}
      <ScheduleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cart={selectedCart}
        onSave={handleScheduleSave}
      />
    </div>
  );
};
