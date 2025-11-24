
import React, { useMemo } from 'react';
import { Filter, MoreHorizontal, Mail, Phone, Search } from 'lucide-react';
import { MOCK_CUSTOMERS, COMPANIES } from '../constants';
import { Status } from '../types';
import { useCompany } from '../CompanyContext';

const CompanyBadge = ({ companyId }: { companyId: string }) => {
  const company = COMPANIES.find(c => c.id === companyId);
  if (!company) return null;
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${company.color} opacity-80`}>
      {company.logo}
    </span>
  );
};

export const Customers: React.FC = () => {
  const { selectedCompanyId } = useCompany();

  const filteredCustomers = useMemo(() => {
    if (selectedCompanyId === 'all') return MOCK_CUSTOMERS;
    return MOCK_CUSTOMERS.filter(c => c.companyId === selectedCompanyId);
  }, [selectedCompanyId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <p className="text-sm text-gray-500">Gestiona el directorio de usuarios y su historial.</p>
        </div>
        <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
          Exportar CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 flex gap-4">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por nombre, email o teléfono..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter size={16} />
            Filtros
          </button>
        </div>

        {/* Grid View for Customers (Card style can be nice, but Table is requested in screenshots for Admin) - sticking to table for consistency */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Cliente</th>
                {selectedCompanyId === 'all' && <th className="px-6 py-3">Empresa</th>}
                <th className="px-6 py-3">Contacto</th>
                <th className="px-6 py-3">Fecha Registro</th>
                <th className="px-6 py-3">Pedidos</th>
                <th className="px-6 py-3">Total Gastado</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                 <tr>
                   <td colSpan={selectedCompanyId === 'all' ? 8 : 7} className="px-6 py-8 text-center text-gray-500">
                     No se encontraron clientes para esta empresa.
                   </td>
                 </tr>
              ) : filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                        {customer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-xs text-gray-500">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  {selectedCompanyId === 'all' && (
                      <td className="px-6 py-4">
                         <CompanyBadge companyId={customer.companyId} />
                      </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-gray-500 text-xs">
                      <div className="flex items-center gap-2">
                        <Mail size={12} /> {customer.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} /> {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{customer.joinDate}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 text-center w-24">{customer.totalOrders}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">${customer.totalSpent.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === Status.Active ? 'bg-green-100 text-green-700' : 
                      customer.status === Status.Inactive ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <MoreHorizontal size={18} />
                    </button>
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
