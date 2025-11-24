
import React, { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Activity,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SALES_DATA, MOCK_ORDERS, MOCK_PRODUCTS, COMPANIES } from '../constants';
import { Status } from '../types';
import { useCompany } from '../CompanyContext';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

const StatCard = ({ title, value, trend, trendValue, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {trendValue}
      </div>
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

const StatusIcon = ({ status }: { status: Status }) => {
  switch (status) {
    case Status.Completed: return <CheckCircle size={16} className="text-emerald-500" />;
    case Status.Pending: return <Clock size={16} className="text-amber-500" />;
    case Status.Cancelled: return <XCircle size={16} className="text-red-500" />;
    default: return <AlertCircle size={16} className="text-gray-400" />;
  }
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

export const Dashboard: React.FC = () => {
  const { selectedCompanyId } = useCompany();

  // Filter Data Logic
  const filteredOrders = useMemo(() => {
    if (selectedCompanyId === 'all') return MOCK_ORDERS;
    return MOCK_ORDERS.filter(o => o.companyId === selectedCompanyId);
  }, [selectedCompanyId]);

  const filteredProducts = useMemo(() => {
    if (selectedCompanyId === 'all') return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter(p => p.companyId === selectedCompanyId);
  }, [selectedCompanyId]);

  // 1. Calcular Datos de Categorías basados en Pedidos Reales (Filtrados)
  const categoryData = useMemo(() => {
    const stats: Record<string, number> = {};
    
    filteredOrders.forEach(order => {
      // Nota: Si el producto no está en filteredProducts (porque filtramos mal), lo ponemos en Otros
      // Pero como filtramos ambos por companyId, debería coincidir.
      const productInfo = filteredProducts.find(p => p.name === order.products) || MOCK_PRODUCTS.find(p => p.name === order.products);
      const category = productInfo ? productInfo.category : 'Otros';
      
      stats[category] = (stats[category] || 0) + 1;
    });

    return Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); 
  }, [filteredOrders, filteredProducts]);

  // 2. Calcular Totales Dinámicos
  const totalSalesValue = useMemo(() => filteredOrders.reduce((acc, curr) => acc + curr.amount, 0), [filteredOrders]);
  const newCustomersCount = useMemo(() => selectedCompanyId === 'all' ? 342 : Math.floor(342 / 3), [selectedCompanyId]); // Mock logic

  // 3. Obtener los últimos 5 pedidos filtrados
  const recentOrders = useMemo(() => {
    return [...filteredOrders].slice(0, 6); 
  }, [filteredOrders]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Panel de Métricas</h2>
          <p className="text-gray-500 mt-1">
            {selectedCompanyId === 'all' ? 'Monitoreo consolidado de todas las empresas.' : 'Monitoreo estratégico de la unidad seleccionada.'}
          </p>
        </div>
        <div className="flex gap-3">
           <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block px-4 py-2">
             <option>Últimos 7 días</option>
             <option>Últimos 30 días</option>
             <option>Este Año</option>
           </select>
           <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
             Exportar Reporte
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ventas Totales" 
          value={`$${totalSalesValue.toLocaleString()}`} 
          trend="up" 
          trendValue="+12.5%" 
          icon={DollarSign} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Pedidos Totales" 
          value={filteredOrders.length.toString()} 
          trend="up" 
          trendValue="+8.2%" 
          icon={ShoppingBag} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Nuevos Clientes" 
          value={newCustomersCount.toString()} 
          trend="down" 
          trendValue="-2.4%" 
          icon={Users} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Tasa Conversión" 
          value="3.2%" 
          trend="up" 
          trendValue="+1.1%" 
          icon={Activity} 
          color="bg-green-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart: Sales Performance */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Rendimiento de Ventas</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_DATA}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [`$${value}`, 'Monto']}
                />
                <Area type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Chart: Product Categories */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Categorías Vendidas</h3>
          <p className="text-sm text-gray-500 mb-6">Distribución por unidades vendidas</p>
          
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(value: number) => [`${value} Unds`, 'Cantidad']}
                   contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-gray-600 ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
               <div className="text-center">
                 <span className="block text-2xl font-bold text-gray-900">{filteredOrders.length}</span>
                 <span className="text-xs text-gray-500 uppercase">Pedidos</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
           <h3 className="text-lg font-bold text-gray-900">Últimos Pedidos Realizados</h3>
           <Link to="/orders" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 hover:underline">
             Ver todos <ArrowRight size={16} />
           </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
              <tr>
                <th className="px-6 py-3">ID Pedido</th>
                {selectedCompanyId === 'all' && <th className="px-6 py-3">Empresa</th>}
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Producto Principal</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Monto</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.id}
                  </td>
                  {selectedCompanyId === 'all' && (
                    <td className="px-6 py-4">
                      <CompanyBadge companyId={order.companyId} />
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-xs font-bold">
                        {order.customerName.charAt(0)}
                      </div>
                      <span className="text-gray-700">{order.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={order.products}>
                    {order.products}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">${order.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                     <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                       ${order.status === Status.Completed ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                         order.status === Status.Pending ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                         'bg-red-50 text-red-700 border-red-100'}`}>
                        <StatusIcon status={order.status} />
                        {order.status}
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
