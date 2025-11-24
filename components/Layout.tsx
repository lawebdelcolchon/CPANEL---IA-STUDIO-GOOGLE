import React, { ReactNode, useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  Settings, 
  Menu, 
  Bell, 
  Search,
  ChevronDown,
  Store,
  Image,
  Calculator,
  Briefcase,
  Megaphone,
  LifeBuoy,
  FileText,
  ChevronRight,
  X,
  ShoppingBag,
  Globe,
  Check,
  AlertTriangle,
  Info,
  MessageSquare,
  Truck,
  Scan,
  Factory
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCompany } from '../CompanyContext';
import { MOCK_PRODUCTS, MOCK_CUSTOMERS, MOCK_NOTIFICATIONS_DATA } from '../constants';
import { NotificationItem } from '../types';

// --- Mock Data for Support Search ---
const SUPPORT_TOPICS = [
  { id: 's1', title: 'Cómo realizar una devolución', category: 'Logística' },
  { id: 's2', title: 'Ajustar niveles de stock manual', category: 'Inventario' },
  { id: 's3', title: 'Contactar soporte técnico', category: 'General' },
  { id: 's4', title: 'Configurar pasarela de pagos', category: 'Finanzas' },
  { id: 's5', title: 'Exportar reportes de ventas', category: 'Reportes' },
];

// --- Global Search Component ---
const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Logic
  const results = useMemo(() => {
    if (!query || query.length < 2) return { products: [], customers: [], support: [] };

    const lowerQuery = query.toLowerCase();

    return {
      products: MOCK_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || p.sku.toLowerCase().includes(lowerQuery)
      ).slice(0, 3),
      customers: MOCK_CUSTOMERS.filter(c => 
        c.name.toLowerCase().includes(lowerQuery) || c.email.toLowerCase().includes(lowerQuery)
      ).slice(0, 3),
      support: SUPPORT_TOPICS.filter(s => 
        s.title.toLowerCase().includes(lowerQuery)
      ).slice(0, 2)
    };
  }, [query]);

  const hasResults = results.products.length > 0 || results.customers.length > 0 || results.support.length > 0;

  const handleSelect = (path: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div className="px-4 py-2 relative z-50" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar prod, clientes, ayuda..." 
          className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 border border-gray-200 rounded px-1 hidden opacity-0">⌘K</span>
      </div>

      {/* Smart Dropdown Results */}
      {isOpen && query.length >= 2 && (
        <div className="absolute left-4 right-[-20px] md:w-[320px] top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
          
          {!hasResults ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-3">
                <Search size={18} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No se encontraron resultados para <span className="font-medium text-gray-900">"{query}"</span></p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              {/* Products Section */}
              {results.products.length > 0 && (
                <div className="py-2">
                  <h4 className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Package size={12} /> Productos
                  </h4>
                  <ul>
                    {results.products.map(p => (
                      <li key={p.id}>
                        <button 
                          onClick={() => handleSelect('/products')}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-start gap-3 transition-colors group"
                        >
                          <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-primary-500 transition-colors">
                            <Package size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="font-mono bg-gray-100 px-1 rounded">{p.sku}</span>
                              <span>Stock: {p.stock}</span>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-gray-300 mt-1" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Customers Section */}
              {results.customers.length > 0 && (
                <div className="py-2 border-t border-gray-50">
                  <h4 className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Users size={12} /> Clientes & Consultas
                  </h4>
                  <ul>
                    {results.customers.map(c => (
                      <li key={c.id}>
                        <button 
                          onClick={() => handleSelect('/customers')}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-start gap-3 transition-colors group"
                        >
                          <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 text-xs font-bold">
                            {c.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                            <p className="text-xs text-gray-500 truncate">{c.email}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Support Section */}
              {results.support.length > 0 && (
                <div className="py-2 border-t border-gray-50 bg-gray-50/50">
                  <h4 className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <LifeBuoy size={12} /> Ayuda & Soporte
                  </h4>
                  <ul>
                    {results.support.map(s => (
                      <li key={s.id}>
                        <button 
                          onClick={() => handleSelect('/settings')}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                        >
                          <FileText size={16} className="text-gray-400" />
                          <div className="flex-1">
                             <p className="text-sm text-gray-700">{s.title}</p>
                             <p className="text-[10px] text-gray-400">{s.category}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* Footer Quick Actions */}
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
             <span>Presiona Enter para buscar todo</span>
             <span className="font-mono border border-gray-200 px-1 rounded bg-white">ESC</span>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Notifications Component ---
const NotificationsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS_DATA);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'order': return <ShoppingCart size={16} className="text-green-600" />;
      case 'alert': return <AlertTriangle size={16} className="text-amber-600" />;
      case 'system': return <Info size={16} className="text-blue-600" />;
      case 'message': return <MessageSquare size={16} className="text-purple-600" />;
      default: return <Bell size={16} className="text-gray-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch(type) {
      case 'order': return 'bg-green-100';
      case 'alert': return 'bg-amber-100';
      case 'system': return 'bg-blue-100';
      case 'message': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
           <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-900 text-sm">Notificaciones</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Marcar leídas
                </button>
              )}
           </div>
           
           <div className="max-h-[350px] overflow-y-auto">
              {notifications.length === 0 ? (
                 <div className="p-8 text-center text-gray-500 text-sm">
                    No tienes notificaciones nuevas.
                 </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                   {notifications.map(notification => (
                      <li key={notification.id}>
                         <button 
                           onClick={() => handleNotificationClick(notification)}
                           className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex gap-3 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                         >
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(notification.type)}`}>
                               {getIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                  {notification.title}
                               </p>
                               <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                  {notification.message}
                               </p>
                               <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
                                  {notification.time}
                               </p>
                            </div>
                            {!notification.read && (
                               <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></div>
                            )}
                         </button>
                      </li>
                   ))}
                </ul>
              )}
           </div>
           
           <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
              <Link to="/settings" className="text-xs font-medium text-gray-500 hover:text-gray-900">
                 Ver historial completo
              </Link>
           </div>
        </div>
      )}
    </div>
  );
};

interface LayoutProps {
  children: ReactNode;
}

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors mb-1 ${
      active 
        ? 'bg-primary-50 text-primary-700' 
        : 'text-slate-600 hover:bg-gray-100 hover:text-slate-900'
    }`}
  >
    <Icon size={18} className={active ? 'text-primary-600' : 'text-slate-400'} />
    {label}
  </Link>
);

const SidebarDropdown = ({ 
  icon: Icon, 
  label, 
  active, 
  children 
}: { 
  icon: any; 
  label: string; 
  active: boolean; 
  children?: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(active);

  // Keep open if currently active on mount
  useEffect(() => {
    if (active) setIsOpen(true);
  }, [active]);

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          active || isOpen
            ? 'bg-gray-50 text-slate-900'
            : 'text-slate-600 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className={active ? 'text-primary-600' : 'text-slate-400'} />
          {label}
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className="pl-11 pr-2 mt-1 space-y-1 animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { selectedCompanyId, setSelectedCompanyId, companies, currentCompany } = useCompany();
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-50 hidden md:flex flex-col">
        <div className="p-6 relative z-[60]">
           {/* Company Switcher */}
           <div className="relative">
             <button 
               onClick={() => setIsCompanyMenuOpen(!isCompanyMenuOpen)}
               className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
             >
               <div className="flex items-center gap-3">
                 <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold shadow-sm ${currentCompany ? currentCompany.color : 'bg-gray-800'}`}>
                   {currentCompany ? currentCompany.logo : 'ALL'}
                 </div>
                 <div className="text-left">
                   <p className="text-sm font-bold text-slate-900 leading-tight">{currentCompany ? currentCompany.name : 'Todas las Empresas'}</p>
                   <p className="text-xs text-gray-500">Gestor Central</p>
                 </div>
               </div>
               <ChevronDown size={16} className="text-gray-400" />
             </button>

             {isCompanyMenuOpen && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                 <div className="p-2">
                   <div className="text-xs font-semibold text-gray-400 uppercase px-2 py-1 mb-1">Seleccionar Entidad</div>
                   <button 
                     onClick={() => { setSelectedCompanyId('all'); setIsCompanyMenuOpen(false); }}
                     className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 mb-1 ${selectedCompanyId === 'all' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
                   >
                     <div className="h-6 w-6 rounded bg-gray-800 flex items-center justify-center text-[10px] text-white font-bold">ALL</div>
                     Todas las Empresas
                   </button>
                   {companies.map(company => (
                     <button 
                       key={company.id}
                       onClick={() => { setSelectedCompanyId(company.id); setIsCompanyMenuOpen(false); }}
                       className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 mb-1 ${selectedCompanyId === company.id ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'}`}
                     >
                       <div className={`h-6 w-6 rounded flex items-center justify-center text-[10px] text-white font-bold ${company.color}`}>
                         {company.logo}
                       </div>
                       {company.name}
                     </button>
                   ))}
                 </div>
               </div>
             )}
           </div>
        </div>

        {/* Replaced simple input with GlobalSearch Component */}
        <GlobalSearch />

        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="mb-6">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Principal</p>
            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={currentPath === '/'} />
            <SidebarItem to="/orders" icon={ShoppingCart} label="Pedidos" active={currentPath === '/orders'} />
            <SidebarItem to="/customers" icon={Users} label="Clientes" active={currentPath === '/customers'} />
            <SidebarItem to="/marketing" icon={Megaphone} label="Marketing" active={currentPath === '/marketing'} />
            
            {/* New Marketplace Dropdown */}
            <SidebarDropdown 
              icon={Store} 
              label="Marketplace" 
              active={currentPath.includes('/marketplace')}
            >
              <Link 
                to="/marketplace/miravia" 
                className={`block px-3 py-2 rounded-md text-sm transition-colors ${currentPath === '/marketplace/miravia' ? 'bg-pink-50 text-pink-700 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Miravia
              </Link>
              <Link 
                to="/marketplace/amazon" 
                className={`block px-3 py-2 rounded-md text-sm transition-colors ${currentPath === '/marketplace/amazon' ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Amazon
              </Link>
            </SidebarDropdown>
            
            <SidebarItem to="/products" icon={Package} label="Productos" active={currentPath === '/products'} />
            <SidebarItem to="/gallery" icon={Image} label="Galería" active={currentPath === '/gallery'} />
            <SidebarItem to="/inventory" icon={Briefcase} label="Inventario" active={currentPath === '/inventory'} />
            <SidebarItem to="/suppliers" icon={Factory} label="Proveedores" active={currentPath === '/suppliers'} />
            
            {/* New Transport Dropdown */}
            <SidebarDropdown 
              icon={Truck} 
              label="Transporte" 
              active={currentPath.includes('/transport')}
            >
              <Link 
                to="/transport/dhl" 
                className={`block px-3 py-2 rounded-md text-sm transition-colors ${currentPath === '/transport/dhl' ? 'bg-yellow-50 text-yellow-700 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                DHL
              </Link>
              <Link 
                to="/transport/seur" 
                className={`block px-3 py-2 rounded-md text-sm transition-colors ${currentPath === '/transport/seur' ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                SEUR
              </Link>
            </SidebarDropdown>

            <SidebarItem to="/scanner" icon={Scan} label="Escáner Móvil" active={currentPath === '/scanner'} />
          </div>

          <div className="mb-6">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Finanzas</p>
            <SidebarItem to="/budget" icon={Calculator} label="Presupuesto" active={currentPath === '/budget'} />
          </div>
          
          <div>
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Configuración</p>
            <SidebarItem to="/settings" icon={Settings} label="Ajustes" active={currentPath === '/settings'} />
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
              JP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Jorge Pirela</p>
              <p className="text-xs text-gray-500 truncate">Admin Global</p>
            </div>
            <Settings size={16} className="text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-w-0 overflow-hidden bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-40">
           <div className="flex items-center gap-4 md:hidden">
             <button className="text-gray-500 hover:text-gray-700">
               <Menu size={24} />
             </button>
             <span className="font-bold text-lg">CPanel</span>
           </div>
           
           <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-500">Vista actual:</span>
              <span className={`text-sm font-bold px-2 py-0.5 rounded ${currentCompany ? 'bg-gray-100 text-gray-900' : 'bg-gray-100 text-gray-900'}`}>
                {currentCompany ? currentCompany.name : 'Consolidado Global'}
              </span>
           </div>

           <div className="flex items-center gap-6">
             
             {/* Integrated Notifications Menu */}
             <NotificationsMenu />

             <div className="h-8 w-8 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold shadow-sm cursor-pointer">
               JP
             </div>
           </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};