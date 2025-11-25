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
  Factory,
  Command
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
    <div className="px-3 py-2 relative z-50" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search..." 
          className="w-full pl-8 pr-8 py-1.5 bg-zinc-100/50 border border-zinc-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-zinc-300 focus:border-zinc-300 transition-all placeholder-zinc-400"
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            <X size={12} />
          </button>
        )}
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 border border-zinc-200 rounded px-1 hidden opacity-0">⌘K</span>
      </div>

      {/* Smart Dropdown Results */}
      {isOpen && query.length >= 2 && (
        <div className="absolute left-3 right-[-10px] md:w-[300px] top-full mt-2 bg-white rounded-lg shadow-medusa border border-zinc-200 overflow-hidden animate-in fade-in slide-in-from-top-1">
          
          {!hasResults ? (
            <div className="p-6 text-center">
              <p className="text-xs text-zinc-500">No results for <span className="font-medium text-zinc-900">"{query}"</span></p>
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              {/* Products Section */}
              {results.products.length > 0 && (
                <div className="py-1">
                  <h4 className="px-3 py-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Products</h4>
                  <ul>
                    {results.products.map(p => (
                      <li key={p.id}>
                        <button 
                          onClick={() => handleSelect('/products')}
                          className="w-full text-left px-3 py-2 hover:bg-zinc-50 flex items-center gap-3 transition-colors group"
                        >
                          <div className="h-6 w-6 rounded bg-zinc-100 flex items-center justify-center text-zinc-400">
                            <Package size={12} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-zinc-900 truncate">{p.name}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Customers Section */}
              {results.customers.length > 0 && (
                <div className="py-1 border-t border-zinc-50">
                  <h4 className="px-3 py-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Customers</h4>
                  <ul>
                    {results.customers.map(c => (
                      <li key={c.id}>
                        <button 
                          onClick={() => handleSelect('/customers')}
                          className="w-full text-left px-3 py-2 hover:bg-zinc-50 flex items-center gap-3 transition-colors group"
                        >
                          <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 text-[10px] font-bold">
                            {c.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-zinc-900 truncate">{c.name}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
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
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-zinc-500 hover:text-zinc-900 transition-colors focus:outline-none"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-lg shadow-medusa border border-zinc-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 origin-top-right">
           <div className="px-4 py-3 border-b border-zinc-100 flex justify-between items-center">
              <h3 className="font-medium text-zinc-900 text-xs">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-zinc-500 hover:text-zinc-900"
                >
                  Mark all as read
                </button>
              )}
           </div>
           
           <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                 <div className="p-6 text-center text-zinc-400 text-xs">
                    No new notifications
                 </div>
              ) : (
                <ul className="divide-y divide-zinc-50">
                   {notifications.map(notification => (
                      <li key={notification.id}>
                         <button 
                           onClick={() => handleNotificationClick(notification)}
                           className={`w-full text-left p-3 hover:bg-zinc-50 transition-colors flex gap-3 ${!notification.read ? 'bg-zinc-50/50' : ''}`}
                         >
                            <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-primary-600' : 'bg-transparent'}`}></div>
                            <div className="flex-1 min-w-0">
                               <p className="text-xs font-medium text-zinc-900">
                                  {notification.title}
                               </p>
                               <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">
                                  {notification.message}
                               </p>
                               <p className="text-[9px] text-zinc-400 mt-1">
                                  {notification.time}
                               </p>
                            </div>
                         </button>
                      </li>
                   ))}
                </ul>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ to, icon: Icon, label, active, onClick }: { to: string; icon: any; label: string; active: boolean, onClick?: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-all mb-0.5 ${
      active 
        ? 'bg-zinc-100 text-zinc-900' 
        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
    }`}
  >
    <Icon size={16} className={active ? 'text-zinc-900' : 'text-zinc-400'} />
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

  useEffect(() => {
    if (active) setIsOpen(true);
  }, [active]);

  return (
    <div className="mb-0.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-all ${
          active || isOpen
            ? 'bg-zinc-50 text-zinc-900'
            : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Icon size={16} className={(active || isOpen) ? 'text-zinc-900' : 'text-zinc-400'} />
          {label}
        </div>
        <ChevronDown 
          size={12} 
          className={`text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className="pl-9 pr-2 mt-0.5 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

// --- Reusable Sidebar Content ---
const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { selectedCompanyId, setSelectedCompanyId, companies, currentCompany } = useCompany();
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Sidebar Header */}
      <div className="p-3 relative z-[60] border-b border-zinc-100">
         <div className="relative">
           <button 
             onClick={() => setIsCompanyMenuOpen(!isCompanyMenuOpen)}
             className="w-full flex items-center gap-2 p-1.5 rounded-md hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all"
           >
             <div className={`h-6 w-6 rounded flex items-center justify-center text-white font-bold shadow-sm text-[10px] ${currentCompany ? 'bg-zinc-900' : 'bg-zinc-800'}`}>
               {currentCompany ? currentCompany.logo.substring(0,1) : 'A'}
             </div>
             <div className="flex-1 text-left min-w-0">
               <p className="text-xs font-semibold text-zinc-900 truncate leading-tight">{currentCompany ? currentCompany.name : 'Acme Inc.'}</p>
             </div>
             <ChevronDown size={12} className="text-zinc-400" />
           </button>

           {isCompanyMenuOpen && (
             <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-medusa border border-zinc-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
               <div className="p-1">
                 <div className="text-[10px] font-medium text-zinc-400 uppercase px-2 py-1.5">Switch Store</div>
                 <button 
                   onClick={() => { setSelectedCompanyId('all'); setIsCompanyMenuOpen(false); }}
                   className={`w-full text-left px-2 py-1.5 rounded-md text-xs flex items-center gap-2 mb-0.5 ${selectedCompanyId === 'all' ? 'bg-zinc-100 font-medium text-zinc-900' : 'text-zinc-600 hover:bg-zinc-50'}`}
                 >
                   <div className="h-5 w-5 rounded bg-zinc-800 flex items-center justify-center text-[8px] text-white">ALL</div>
                   All Stores
                 </button>
                 {companies.map(company => (
                   <button 
                     key={company.id}
                     onClick={() => { setSelectedCompanyId(company.id); setIsCompanyMenuOpen(false); }}
                     className={`w-full text-left px-2 py-1.5 rounded-md text-xs flex items-center gap-2 mb-0.5 ${selectedCompanyId === company.id ? 'bg-zinc-100 font-medium text-zinc-900' : 'text-zinc-600 hover:bg-zinc-50'}`}
                   >
                     <div className={`h-5 w-5 rounded flex items-center justify-center text-[8px] text-white ${company.id === 'c1' ? 'bg-zinc-900' : 'bg-zinc-500'}`}>
                       {company.logo.substring(0,1)}
                     </div>
                     {company.name}
                   </button>
                 ))}
               </div>
             </div>
           )}
         </div>
      </div>

      <GlobalSearch />

      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="mb-6">
          <p className="px-3 text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Store</p>
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={currentPath === '/'} onClick={onClose} />
          <SidebarItem to="/orders" icon={ShoppingCart} label="Orders" active={currentPath === '/orders'} onClick={onClose} />
          <SidebarItem to="/customers" icon={Users} label="Customers" active={currentPath === '/customers'} onClick={onClose} />
          <SidebarItem to="/products" icon={Package} label="Products" active={currentPath === '/products'} onClick={onClose} />
          <SidebarItem to="/inventory" icon={Briefcase} label="Inventory" active={currentPath === '/inventory'} onClick={onClose} />
          <SidebarItem to="/marketing" icon={Megaphone} label="Marketing" active={currentPath === '/marketing'} onClick={onClose} />
          
          <SidebarDropdown 
            icon={Store} 
            label="Sales Channels" 
            active={currentPath.includes('/marketplace')}
          >
            <Link 
              to="/marketplace/miravia" 
              onClick={onClose}
              className={`block px-3 py-1.5 rounded-md text-xs transition-colors ${currentPath === '/marketplace/miravia' ? 'text-zinc-900 bg-zinc-50 font-medium' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              Miravia
            </Link>
            <Link 
              to="/marketplace/amazon" 
              onClick={onClose}
              className={`block px-3 py-1.5 rounded-md text-xs transition-colors ${currentPath === '/marketplace/amazon' ? 'text-zinc-900 bg-zinc-50 font-medium' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              Amazon
            </Link>
          </SidebarDropdown>
          
          <SidebarItem to="/gallery" icon={Image} label="Media" active={currentPath === '/gallery'} onClick={onClose} />
          <SidebarItem to="/suppliers" icon={Factory} label="Suppliers" active={currentPath === '/suppliers'} onClick={onClose} />
          
          <SidebarDropdown 
            icon={Truck} 
            label="Logistics" 
            active={currentPath.includes('/transport')}
          >
            <Link 
              to="/transport/dhl" 
              onClick={onClose}
              className={`block px-3 py-1.5 rounded-md text-xs transition-colors ${currentPath === '/transport/dhl' ? 'text-zinc-900 bg-zinc-50 font-medium' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              DHL
            </Link>
            <Link 
              to="/transport/seur" 
              onClick={onClose}
              className={`block px-3 py-1.5 rounded-md text-xs transition-colors ${currentPath === '/transport/seur' ? 'text-zinc-900 bg-zinc-50 font-medium' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              SEUR
            </Link>
          </SidebarDropdown>

          <SidebarItem to="/scanner" icon={Scan} label="Scanner" active={currentPath === '/scanner'} onClick={onClose} />
        </div>

        <div>
          <p className="px-3 text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Settings</p>
          <SidebarItem to="/budget" icon={Calculator} label="Pricing" active={currentPath === '/budget'} onClick={onClose} />
          <SidebarItem to="/settings" icon={Settings} label="Settings" active={currentPath === '/settings'} onClick={onClose} />
        </div>
      </nav>

      <div className="p-3 border-t border-zinc-100">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-[10px]">
            JP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-900 truncate">Jorge P.</p>
            <p className="text-[10px] text-zinc-400 truncate">jorge@example.com</p>
          </div>
          <button className="text-zinc-400 hover:text-zinc-600" onClick={() => { navigate('/settings'); if(onClose) onClose(); }}>
             <Settings size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentCompany } = useCompany();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans text-zinc-900">
      {/* Mobile Sidebar Overlay & Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div 
            className="absolute inset-0 bg-zinc-900/20 backdrop-blur-sm transition-opacity animate-in fade-in" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="absolute top-0 left-0 bottom-0 w-64 bg-white shadow-xl z-[101] animate-in slide-in-from-left duration-300 border-r border-zinc-200">
             <div className="absolute top-2 right-2 z-50">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-md bg-white text-zinc-400 hover:text-zinc-900 border border-zinc-200"
                >
                   <X size={16} />
                </button>
             </div>
             <SidebarContent onClose={() => setIsMobileMenuOpen(false)} />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="w-60 bg-white border-r border-zinc-200 fixed inset-y-0 left-0 z-50 hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-60 flex flex-col min-w-0 overflow-hidden bg-[#F9FAFB]">
        {/* Mobile Header */}
        <header className="bg-white border-b border-zinc-200 h-14 flex items-center justify-between px-4 sticky top-0 z-40 md:hidden">
           <div className="flex items-center gap-3">
             <button 
               className="text-zinc-500 hover:text-zinc-900"
               onClick={() => setIsMobileMenuOpen(true)}
             >
               <Menu size={20} />
             </button>
             <span className="font-semibold text-sm text-zinc-900">Medusa Admin</span>
           </div>
           
           <div className="flex items-center gap-4">
             <NotificationsMenu />
             <div className="h-6 w-6 bg-zinc-900 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
               JP
             </div>
           </div>
        </header>

        {/* Desktop Header Actions (Floating or Integrated into page headers usually in Medusa, but we'll keep a slim top bar for utility) */}
        <div className="hidden md:flex h-14 items-center justify-between px-8 border-b border-zinc-200 bg-white sticky top-0 z-40">
            <div className="flex items-center text-xs text-zinc-500 gap-2">
               <span className="text-zinc-400">Organization</span>
               <ChevronRight size={12} />
               <span className="font-medium text-zinc-900">{currentCompany ? currentCompany.name : 'Acme Inc.'}</span>
            </div>
            <div className="flex items-center gap-4">
               <button className="text-zinc-400 hover:text-zinc-600 text-xs flex items-center gap-1">
                  <LifeBuoy size={14} /> Help
               </button>
               <div className="h-4 w-px bg-zinc-200"></div>
               <NotificationsMenu />
            </div>
        </div>

        <div className="flex-1 overflow-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};