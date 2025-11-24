
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  ArrowUpDown, 
  MoreHorizontal, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Boxes, 
  X, 
  Save, 
  AlertTriangle, 
  Minus, 
  Package,
  Store,
  Globe,
  ShoppingBag,
  Calendar,
  Layers,
  Image as ImageIcon,
  Upload,
  Ruler,
  Palette,
  Check
} from 'lucide-react';
import { MOCK_PRODUCTS, COMPANIES } from '../constants';
import { Status, Product } from '../types';
import { useCompany } from '../CompanyContext';

// Componente Modal Reutilizable
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  type?: 'default' | 'danger';
  size?: 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, type = 'default', size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      <div className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all scale-100 overflow-hidden flex flex-col max-h-[90vh]`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between flex-shrink-0 ${type === 'danger' ? 'bg-red-50 border-red-100' : 'border-gray-100'}`}>
          <h3 className={`text-lg font-bold ${type === 'danger' ? 'text-red-700' : 'text-gray-900'}`}>
            {title}
          </h3>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full transition-colors ${type === 'danger' ? 'hover:bg-red-100 text-red-500' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
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

// Helper para obtener info del canal
const getChannelInfo = (companyId: string) => {
  switch (companyId) {
    case 'c1':
      return {
        name: 'Amazon',
        icon: <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-4 h-4 object-contain" />,
        style: 'bg-orange-50 text-orange-700 border-orange-200'
      };
    case 'c2':
      return {
        name: 'Miravia',
        icon: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Logo_of_Miravia.png/220px-Logo_of_Miravia.png" alt="Miravia" className="w-4 h-4 object-contain" />,
        style: 'bg-pink-50 text-pink-700 border-pink-200'
      };
    default:
      return {
        name: 'Directo',
        icon: <Globe size={14} />,
        style: 'bg-blue-50 text-blue-700 border-blue-200'
      };
  }
};

export const Products: React.FC = () => {
  const { selectedCompanyId } = useCompany();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [activeModal, setActiveModal] = useState<'edit' | 'stock' | 'preview' | 'delete' | 'advanced' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({});

  // Advanced Management State (Local Mock)
  const [advancedTab, setAdvancedTab] = useState<'info' | 'variants' | 'images'>('info');
  const [extendedData, setExtendedData] = useState({
    createdAt: '',
    description: '',
    materials: [] as string[],
    sizes: [] as string[],
    images: [] as string[]
  });
  const [newTagInput, setNewTagInput] = useState('');

  // Reset products on context change (simulating fetch)
  useEffect(() => {
    setProducts(MOCK_PRODUCTS);
  }, [selectedCompanyId]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('.product-actions-menu') === null) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
       const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             p.category.toLowerCase().includes(searchTerm.toLowerCase());
       
       const matchesCompany = selectedCompanyId === 'all' || p.companyId === selectedCompanyId;
       
       return matchesSearch && matchesCompany;
    });
  }, [searchTerm, products, selectedCompanyId]);

  const handleOpenModal = (type: 'edit' | 'stock' | 'preview' | 'delete' | 'advanced', product: Product) => {
    setSelectedProduct(product);
    setFormData({ ...product });
    
    // Reset Advanced Data Mock
    if (type === 'advanced') {
      setExtendedData({
        createdAt: new Date().toISOString().split('T')[0],
        description: 'Descripción detallada del producto para el portal de ventas...',
        materials: ['Viscoelástica', 'Tejido Stretch', 'Núcleo HR'],
        sizes: ['90x190', '135x190', '150x200'],
        images: [
          'https://images.unsplash.com/photo-1505693416388-b034680c5006?auto=format&fit=crop&w=200&q=80',
          'https://images.unsplash.com/photo-1584621159576-142a68689322?auto=format&fit=crop&w=200&q=80'
        ]
      });
      setAdvancedTab('info');
    }

    setActiveModal(type);
    setOpenMenuId(null);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedProduct(null);
    setFormData({});
  };

  const handleSave = () => {
    if (!selectedProduct) return;

    const updatedProducts = products.map(p => 
      p.id === selectedProduct.id ? { ...p, ...formData } as Product : p
    );
    
    setProducts(updatedProducts);
    handleCloseModal();
  };

  const handleDelete = () => {
    if (!selectedProduct) return;
    const updatedProducts = products.filter(p => p.id !== selectedProduct.id);
    setProducts(updatedProducts);
    handleCloseModal();
  };

  // Advanced Handlers
  const handleAddTag = (type: 'materials' | 'sizes') => {
    if (!newTagInput) return;
    setExtendedData(prev => ({
      ...prev,
      [type]: [...prev[type], newTagInput]
    }));
    setNewTagInput('');
  };

  const handleRemoveTag = (type: 'materials' | 'sizes', tag: string) => {
    setExtendedData(prev => ({
      ...prev,
      [type]: prev[type].filter(t => t !== tag)
    }));
  };

  const handleRemoveImage = (index: number) => {
    setExtendedData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Render Modal Content Logic
  const renderModalContent = () => {
    if (!selectedProduct) return null;

    switch (activeModal) {
      case 'advanced':
        return (
          <div className="min-h-[400px] flex flex-col">
             {/* Tabs */}
             <div className="flex border-b border-gray-200 mb-6">
                <button 
                  onClick={() => setAdvancedTab('info')}
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${advancedTab === 'info' ? 'border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                   <Calendar size={16} /> General
                </button>
                <button 
                  onClick={() => setAdvancedTab('variants')}
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${advancedTab === 'variants' ? 'border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                   <Layers size={16} /> Variables
                </button>
                <button 
                  onClick={() => setAdvancedTab('images')}
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${advancedTab === 'images' ? 'border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                   <ImageIcon size={16} /> Galería Portal
                </button>
             </div>

             {/* Tab Content */}
             <div className="flex-1">
                {advancedTab === 'info' && (
                   <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-200">
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha de Creación</label>
                            <input 
                              type="date" 
                              value={extendedData.createdAt}
                              onChange={(e) => setExtendedData({...extendedData, createdAt: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Última Actualización</label>
                            <input 
                              type="date" 
                              disabled
                              value={new Date().toISOString().split('T')[0]}
                              className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                            />
                         </div>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción Comercial</label>
                         <textarea 
                           rows={6}
                           value={extendedData.description}
                           onChange={(e) => setExtendedData({...extendedData, description: e.target.value})}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 resize-none"
                           placeholder="Descripción para la ficha de producto..."
                         />
                      </div>
                   </div>
                )}

                {advancedTab === 'variants' && (
                   <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
                      {/* Materiales */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                         <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Palette size={16} className="text-purple-500"/> Materiales y Componentes
                         </h4>
                         <div className="flex flex-wrap gap-2 mb-3">
                            {extendedData.materials.map(mat => (
                               <span key={mat} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-purple-200 text-purple-700 rounded-md text-xs font-medium shadow-sm">
                                  {mat}
                                  <button onClick={() => handleRemoveTag('materials', mat)} className="hover:text-purple-900"><X size={12}/></button>
                               </span>
                            ))}
                         </div>
                         <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Añadir material..." 
                              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                              value={newTagInput}
                              onChange={(e) => setNewTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                 if(e.key === 'Enter') {
                                    handleAddTag('materials');
                                 }
                              }}
                            />
                            <button 
                              onClick={() => handleAddTag('materials')}
                              className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-purple-700"
                            >
                               <Plus size={16}/>
                            </button>
                         </div>
                      </div>

                      {/* Medidas */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                         <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Ruler size={16} className="text-blue-500"/> Medidas Disponibles
                         </h4>
                         <div className="flex flex-wrap gap-2 mb-3">
                            {extendedData.sizes.map(size => (
                               <span key={size} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-blue-200 text-blue-700 rounded-md text-xs font-medium shadow-sm">
                                  {size}
                                  <button onClick={() => handleRemoveTag('sizes', size)} className="hover:text-blue-900"><X size={12}/></button>
                               </span>
                            ))}
                         </div>
                         <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Añadir medida (ej. 90x190)..." 
                              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                              value={newTagInput}
                              onChange={(e) => setNewTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                 if(e.key === 'Enter') {
                                    handleAddTag('sizes');
                                 }
                              }}
                            />
                            <button 
                              onClick={() => handleAddTag('sizes')}
                              className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-blue-700"
                            >
                               <Plus size={16}/>
                            </button>
                         </div>
                      </div>
                   </div>
                )}

                {advancedTab === 'images' && (
                   <div className="animate-in fade-in duration-200">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                         {extendedData.images.map((img, idx) => (
                            <div key={idx} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                               <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                               <button 
                                 onClick={() => handleRemoveImage(idx)}
                                 className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                               >
                                  <Trash2 size={14}/>
                               </button>
                               {idx === 0 && (
                                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded backdrop-blur-sm">Principal</span>
                               )}
                            </div>
                         ))}
                         
                         <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all cursor-pointer">
                            <Upload size={24} className="mb-2"/>
                            <span className="text-xs font-bold">Subir Imagen</span>
                         </div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">Arrastra imágenes aquí o haz clic para seleccionar archivos. (JPG, PNG, WEBP)</p>
                   </div>
                )}
             </div>
          </div>
        );

      case 'edit':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input 
                  type="text" 
                  value={formData.sku} 
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                   <option>Colchones</option>
                   <option>Almohadas</option>
                   <option>Ropa de Cama</option>
                   <option>Muebles</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as Status})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        );

      case 'stock':
        return (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center p-4 bg-primary-50 rounded-full mb-4">
               <Package size={32} className="text-primary-600" />
            </div>
            <h4 className="text-gray-900 font-medium mb-1">{formData.name}</h4>
            <p className="text-sm text-gray-500 mb-6">Ajuste manual de inventario</p>
            
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setFormData({...formData, stock: Math.max(0, (formData.stock || 0) - 1)})}
                className="h-10 w-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-transform"
              >
                <Minus size={18} />
              </button>
              <div className="w-24">
                <input 
                  type="number" 
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                  className="w-full text-center text-2xl font-bold text-gray-900 border-b-2 border-primary-500 focus:outline-none"
                />
                <span className="text-xs text-gray-500 block mt-1">Unidades</span>
              </div>
              <button 
                onClick={() => setFormData({...formData, stock: (formData.stock || 0) + 1})}
                className="h-10 w-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-transform"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <div className="aspect-video w-full bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                 <Package size={64} />
               </div>
               <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                 {selectedProduct.sku}
               </div>
            </div>
            <div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h4>
                <span className="text-lg font-bold text-primary-600">${selectedProduct.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Categoría: <span className="font-medium text-gray-700">{selectedProduct.category}</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="block text-xs text-gray-500 uppercase">Stock</span>
                  <span className="font-medium text-gray-900">{selectedProduct.stock} u.</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                   <span className="block text-xs text-gray-500 uppercase">Estado</span>
                   <span className={`inline-block w-2 h-2 rounded-full mr-2 ${selectedProduct.status === Status.Active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                   <span className="font-medium text-gray-900">{selectedProduct.status}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'delete':
        return (
          <div className="text-center">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
               <AlertTriangle size={32} className="text-red-600" />
             </div>
             <h3 className="text-gray-900 font-bold text-lg mb-2">¿Eliminar producto?</h3>
             <p className="text-gray-500 text-sm mb-6">
               Estás a punto de eliminar <span className="font-bold text-gray-800">"{selectedProduct.name}"</span>. Esta acción no se puede deshacer y se perderán todos los datos asociados al inventario.
             </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
        <button 
          onClick={() => alert('Función de crear producto pendiente de implementación')}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} />
          Crear Producto
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm relative min-h-[500px]">
        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
             <Filter size={16} />
             Filtros Avanzados
          </button>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, SKU o categoría..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
               <ArrowUpDown size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto pb-32">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3">Canal / Marketplace</th>
                {selectedCompanyId === 'all' && <th className="px-6 py-3">Empresa</th>}
                <th className="px-6 py-3">Categoría</th>
                <th className="px-6 py-3">Precio</th>
                <th className="px-6 py-3">Unidades</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                 <tr>
                   <td colSpan={selectedCompanyId === 'all' ? 8 : 7} className="px-6 py-8 text-center text-gray-500">
                     No se encontraron productos para la empresa seleccionada.
                   </td>
                 </tr>
              ) : (
                filteredProducts.map((product) => {
                  const channel = getChannelInfo(product.companyId);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-blue-600 mt-0.5 font-mono">sku: {product.sku}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${channel.style}`}>
                          {channel.icon}
                          {channel.name}
                        </span>
                      </td>
                      {selectedCompanyId === 'all' && (
                          <td className="px-6 py-4">
                            <CompanyBadge companyId={product.companyId} />
                          </td>
                      )}
                      <td className="px-6 py-4 text-gray-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`${product.stock < 20 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                            {product.stock}
                          </span>
                          {product.stock < 20 && (
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" title="Stock bajo"></span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${
                              product.status === Status.Featured ? 'bg-purple-500' :
                              product.status === Status.Active ? 'bg-green-500' :
                              product.status === Status.Hidden ? 'bg-gray-400' :
                              'bg-red-500'
                            }`}></div>
                            <span className="text-gray-700 capitalize text-xs">{product.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === product.id ? null : product.id);
                          }}
                          className={`p-2 rounded-lg transition-colors product-actions-menu ${openMenuId === product.id ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {openMenuId === product.id && (
                          <div className="absolute right-8 top-8 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden origin-top-right product-actions-menu animate-in fade-in zoom-in-95 duration-100">
                            <div className="p-1">
                              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-50 mb-1">
                                Gestión
                              </div>
                              <button 
                                onClick={() => handleOpenModal('edit', product)}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md flex items-center gap-2 transition-colors"
                              >
                                <Edit size={16} className="text-gray-400" />
                                Editar Detalles
                              </button>
                              <button 
                                onClick={() => handleOpenModal('advanced', product)}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md flex items-center gap-2 transition-colors"
                              >
                                <Layers size={16} className="text-purple-500" />
                                Gestión Avanzada
                              </button>
                              <button 
                                onClick={() => handleOpenModal('stock', product)}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md flex items-center gap-2 transition-colors"
                              >
                                <Boxes size={16} className="text-gray-400" />
                                Control Stock
                              </button>
                              <button 
                                onClick={() => handleOpenModal('preview', product)}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md flex items-center gap-2 transition-colors"
                              >
                                <Eye size={16} className="text-gray-400" />
                                Vista Previa
                              </button>
                              <div className="h-px bg-gray-100 my-1"></div>
                              <button 
                                onClick={() => handleOpenModal('delete', product)}
                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 transition-colors group/delete"
                              >
                                <Trash2 size={16} className="text-red-400 group-hover/delete:text-red-600" />
                                Eliminar
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white rounded-b-xl absolute bottom-0 left-0 right-0">
          <div className="text-sm text-gray-500">
            Mostrando <span className="font-medium">{filteredProducts.length > 0 ? 1 : 0} a {Math.min(20, filteredProducts.length)}</span> de <span className="font-medium">{filteredProducts.length}</span> registros
          </div>
           <div className="flex gap-1">
             <button className="w-8 h-8 flex items-center justify-center rounded bg-primary-600 text-white text-sm shadow-sm hover:bg-primary-700 transition-colors">1</button>
             <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 text-sm transition-colors">2</button>
             <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 text-sm transition-colors">3</button>
           </div>
        </div>
      </div>

      {/* Main Modal Instance */}
      <Modal
        isOpen={!!activeModal}
        onClose={handleCloseModal}
        title={
          activeModal === 'edit' ? 'Editar Producto' : 
          activeModal === 'stock' ? 'Gestionar Inventario' :
          activeModal === 'preview' ? 'Vista Previa' :
          activeModal === 'advanced' ? `Gestión Completa: ${selectedProduct?.name}` :
          'Eliminar Producto'
        }
        type={activeModal === 'delete' ? 'danger' : 'default'}
        size={activeModal === 'advanced' ? 'xl' : 'md'}
        footer={
          activeModal === 'preview' ? (
             <button onClick={handleCloseModal} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
               Cerrar
             </button>
          ) : (
            <>
              <button onClick={handleCloseModal} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancelar
              </button>
              {activeModal === 'delete' ? (
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 shadow-sm flex items-center gap-2">
                  <Trash2 size={16} /> Confirmar Eliminar
                </button>
              ) : (
                <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 shadow-sm flex items-center gap-2">
                  <Save size={16} /> Guardar Cambios
                </button>
              )}
            </>
          )
        }
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};
