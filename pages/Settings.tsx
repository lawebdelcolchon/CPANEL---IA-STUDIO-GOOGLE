
import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  History, 
  Globe, 
  Save, 
  Plus, 
  Search, 
  MoreHorizontal,
  Trash2,
  Edit,
  Check,
  Smartphone,
  Mail,
  LogOut,
  Activity,
  AlertTriangle,
  Building
} from 'lucide-react';
import { MOCK_SYSTEM_USERS, MOCK_ACTIVITY_LOG } from '../constants';
import { Status, SystemUser } from '../types';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'history' | 'system'>('profile');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
        <p className="text-sm text-gray-500">Administra tu cuenta, equipo y preferencias del sistema.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User size={18} /> Mi Perfil
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'team' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Shield size={18} /> Equipo y Roles
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'history' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <History size={18} /> Historial de Uso
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'system' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building size={18} /> Sistema
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'team' && <TeamSettings />}
          {activeTab === 'history' && <HistoryLogs />}
          {activeTab === 'system' && <SystemSettings />}
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const ProfileSettings = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Personal Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Información Personal</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">Editar</button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                JP
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50">
                <Edit size={14} className="text-gray-500" />
              </button>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Jorge Pirela</h4>
              <p className="text-sm text-gray-500">Administrador Global</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input type="text" defaultValue="Jorge Pirela" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" defaultValue="jorge@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="tel" defaultValue="+34 600 000 000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                <option>Español</option>
                <option>English</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
             <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
               <Save size={16} /> Guardar Cambios
             </button>
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Lock size={18} className="text-gray-400" /> Seguridad
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
               <p className="font-medium text-gray-900">Contraseña</p>
               <p className="text-sm text-gray-500">Último cambio hace 3 meses</p>
            </div>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              Cambiar contraseña
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
               <p className="font-medium text-gray-900">Autenticación de dos factores (2FA)</p>
               <p className="text-sm text-gray-500">Añade una capa extra de seguridad a tu cuenta.</p>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full border border-gray-200 bg-gray-100 cursor-pointer">
               <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></span>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
             <Smartphone size={20} className="text-blue-600 mt-0.5" />
             <div>
               <p className="text-sm font-medium text-blue-900">Sesiones Activas</p>
               <p className="text-xs text-blue-700 mt-1">
                 Actualmente conectado desde Chrome (Windows) en Madrid, ES.
               </p>
             </div>
             <button className="text-xs font-bold text-blue-700 hover:underline ml-auto">
               Cerrar otras sesiones
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamSettings = () => {
  const [users, setUsers] = useState<SystemUser[]>(MOCK_SYSTEM_USERS);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-center">
        <div>
           <h3 className="text-lg font-bold text-gray-900">Administrador de Usuarios</h3>
           <p className="text-sm text-gray-500">Gestiona accesos y permisos del panel.</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
          <Plus size={16} /> Invitar Usuario
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Buscar usuario..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Usuario</th>
                <th className="px-6 py-3">Rol</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Último Acceso</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                         {user.name.charAt(0)}
                       </div>
                       <div>
                         <p className="font-medium text-gray-900">{user.name}</p>
                         <p className="text-xs text-gray-500">{user.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${user.status === Status.Active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.status === Status.Active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {user.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.lastLogin}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded transition-colors" title="Editar Permisos">
                          <Shield size={16} />
                       </button>
                       <button className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors" title="Revocar Acceso">
                          <Trash2 size={16} />
                       </button>
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

const HistoryLogs = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
         <h3 className="text-lg font-bold text-gray-900 mb-6">Historial de Actividad</h3>
         
         <div className="relative border-l border-gray-200 ml-3 space-y-8">
            {MOCK_ACTIVITY_LOG.map((log) => (
               <div key={log.id} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white 
                    ${log.type === 'success' ? 'bg-green-500' : 
                      log.type === 'warning' ? 'bg-yellow-500' : 
                      log.type === 'danger' ? 'bg-red-500' : 'bg-blue-500'}`} 
                  ></div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                     <div>
                        <p className="text-sm font-bold text-gray-900">{log.action}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{log.details}</p>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                             {log.userName}
                           </span>
                           {log.type === 'danger' && (
                             <span className="flex items-center gap-1 text-xs text-red-600 font-bold">
                               <AlertTriangle size={10} /> Alerta Seguridad
                             </span>
                           )}
                        </div>
                     </div>
                     <span className="text-xs text-gray-400 font-mono whitespace-nowrap">
                        {log.date}
                     </span>
                  </div>
               </div>
            ))}
         </div>

         <button className="w-full mt-8 py-2 text-sm text-gray-500 hover:text-gray-900 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-all">
            Ver historial completo
         </button>
      </div>
    </div>
  );
};

const SystemSettings = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 text-white">
         <div className="flex items-start justify-between">
            <div>
               <h3 className="text-xl font-bold mb-2">Configuración Global</h3>
               <p className="text-gray-300 text-sm max-w-lg">
                 Ajustes que afectan a toda la instancia de la aplicación. Los cambios aquí se reflejarán para todos los usuarios.
               </p>
            </div>
            <Globe className="text-blue-400 opacity-20" size={64} />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
               <Building size={18} className="text-gray-400"/> Datos de Empresa
            </h4>
            <div className="space-y-4">
               <div>
                 <label className="text-xs text-gray-500 block mb-1">Nombre Comercial</label>
                 <input type="text" defaultValue="Grupo Empresarial S.L." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
               </div>
               <div>
                 <label className="text-xs text-gray-500 block mb-1">Moneda Principal</label>
                 <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                 </select>
               </div>
               <div>
                 <label className="text-xs text-gray-500 block mb-1">Zona Horaria</label>
                 <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>(GMT+01:00) Madrid</option>
                    <option>(GMT-05:00) New York</option>
                 </select>
               </div>
            </div>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
               <Bell size={18} className="text-gray-400"/> Notificaciones del Sistema
            </h4>
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Alertas de Stock Bajo</span>
                  <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out rounded-full bg-primary-600 cursor-pointer">
                     <span className="absolute right-1 top-1 w-3 h-3 rounded-full bg-white shadow-sm"></span>
                  </div>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Resumen Diario de Ventas</span>
                  <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out rounded-full bg-primary-600 cursor-pointer">
                     <span className="absolute right-1 top-1 w-3 h-3 rounded-full bg-white shadow-sm"></span>
                  </div>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Nuevos Usuarios (Admin)</span>
                  <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out rounded-full bg-gray-200 cursor-pointer">
                     <span className="absolute left-1 top-1 w-3 h-3 rounded-full bg-white shadow-sm"></span>
                  </div>
               </div>
            </div>
         </div>
      </div>
      
      <div className="flex justify-end pt-4 border-t border-gray-200">
         <button className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg">
           Guardar Configuración Global
         </button>
      </div>
    </div>
  );
};
