
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

const COLORS = ['#18181b', '#52525b', '#a1a1aa', '#d4d4d8', '#f4f4f5']; // Grayscale palette

const StatCard = ({ title, value, trend, trendValue, icon: Icon }: any) => (
  <div className="bg-white p-4 rounded-lg border border-zinc-200 shadow-sm hover:shadow-medusa transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <span className="text-zinc-500 text-xs font-medium uppercase tracking-wide">{title}</span>
      <Icon size={16} className="text-zinc-400" />
    </div>
    <div className="flex items-end justify-between">
       <p className="text-2xl font-semibold text-zinc-900">{value}</p>
       <div className={`flex items-center gap-0.5 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trendValue}
      </div>
    </div>
  </div>
);

const StatusIcon = ({ status }: { status: Status }) => {
  switch (status) {
    case Status.Completed: return <div className="w-2 h-2 rounded-full bg-emerald-500" />;
    case Status.Pending: return <div className="w-2 h-2 rounded-full bg-amber-500" />;
    case Status.Cancelled: return <div className="w-2 h-2 rounded-full bg-red-500" />;
    default: return <div className="w-2 h-2 rounded-full bg-zinc-300" />;
  }
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
  const newCustomersCount = useMemo(() => selectedCompanyId === 'all' ? 342 : Math.floor(342 / 3), [selectedCompanyId]);

  // 3. Obtener los últimos 5 pedidos filtrados
  const recentOrders = useMemo(() => {
    return [...filteredOrders].slice(0, 6); 
  }, [filteredOrders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Overview</h2>
          <p className="text-xs text-zinc-500 mt-1">
            {selectedCompanyId === 'all' ? 'Consolidated metrics across all stores.' : 'Performance metrics for selected unit.'}
          </p>
        </div>
        <div className="flex gap-2">
           <select className="bg-white border border-zinc-200 text-zinc-700 text-xs rounded-md focus:ring-zinc-900 focus:border-zinc-900 block px-3 py-2 shadow-sm">
             <option>Last 7 days</option>
             <option>Last 30 days</option>
             <option>This Year</option>
           </select>
           <button className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 px-3 py-2 rounded-md text-xs font-medium transition-colors shadow-sm">
             Export Report
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Sales" 
          value={`$${totalSalesValue.toLocaleString()}`} 
          trend="up" 
          trendValue="+12.5%" 
          icon={DollarSign} 
        />
        <StatCard 
          title="Total Orders" 
          value={filteredOrders.length.toString()} 
          trend="up" 
          trendValue="+8.2%" 
          icon={ShoppingBag} 
        />
        <StatCard 
          title="New Customers" 
          value={newCustomersCount.toString()} 
          trend="down" 
          trendValue="-2.4%" 
          icon={Users} 
        />
        <StatCard 
          title="Conversion Rate" 
          value="3.2%" 
          trend="up" 
          trendValue="+1.1%" 
          icon={Activity} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Sales Performance */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-zinc-900">Sales Performance</h3>
            <button className="text-zinc-400 hover:text-zinc-600">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_DATA}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 11}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{borderRadius: '6px', border: '1px solid #e4e4e7', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '12px'}}
                  formatter={(value: number) => [`$${value}`, 'Amount']}
                />
                <Area type="monotone" dataKey="ventas" stroke="#18181b" strokeWidth={2} fillOpacity={1} fill="url(#colorVentas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Chart: Product Categories */}
        <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold text-zinc-900 mb-1">Sales by Category</h3>
          <p className="text-xs text-zinc-500 mb-6">Distribution by units sold</p>
          
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(value: number) => [`${value} Units`, 'Qty']}
                   contentStyle={{borderRadius: '6px', border: '1px solid #e4e4e7', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '12px'}}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-[10px] text-zinc-600 ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
               <div className="text-center">
                 <span className="block text-xl font-bold text-zinc-900">{filteredOrders.length}</span>
                 <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Orders</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
           <h3 className="text-sm font-semibold text-zinc-900">Recent Orders</h3>
           <Link to="/orders" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors">
             View all <ArrowRight size={12} />
           </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50/50 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Order ID</th>
                {selectedCompanyId === 'all' && <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Store</th>}
                <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
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
                      <div className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center text-[10px] font-bold">
                        {order.customerName.charAt(0)}
                      </div>
                      <span className="text-xs text-zinc-700">{order.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-xs text-zinc-600 max-w-xs truncate" title={order.products}>
                    {order.products}
                  </td>
                  <td className="px-6 py-3 text-xs text-zinc-500">{order.date}</td>
                  <td className="px-6 py-3 text-xs font-medium text-zinc-900">${order.amount.toFixed(2)}</td>
                  <td className="px-6 py-3">
                     <div className="flex items-center gap-2">
                        <StatusIcon status={order.status} />
                        <span className="text-xs text-zinc-600">{order.status}</span>
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