import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, Plus, Monitor, Tag, Package, Check, X, Search, Filter, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Ruler, Maximize, Box } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';

interface GalleryImage {
  id: string;
  url: string;
  name: string;
  size?: string;
  isMain?: boolean;
}

// Mock initial data
const MOCK_IMAGES: Record<string, GalleryImage[]> = {
  'portal': [
    { id: 'img1', url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80', name: 'Hero Banner Principal', size: '1.2 MB' },
    { id: 'img2', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80', name: 'Banner Colección Verano', size: '850 KB' },
    { id: 'img3', url: 'https://images.unsplash.com/photo-1472851294608-41531268f719?auto=format&fit=crop&w=800&q=80', name: 'Sobre Nosotros - Equipo', size: '2.4 MB' },
  ],
  'promotions': [
    { id: 'p1', url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80', name: 'Black Friday Banner', size: '500 KB' },
    { id: 'p2', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', name: 'Descuento Bienvenida', size: '420 KB' },
  ]
};

// Generar imágenes mock para productos
const getMockProductImages = (sku: string) => [
  { id: `prod-${sku}-1`, url: `https://images.unsplash.com/photo-1505693416388-b034680c5006?auto=format&fit=crop&w=800&q=80`, name: `${sku} - Vista Frontal`, isMain: true, size: '1.1 MB' },
  { id: `prod-${sku}-2`, url: `https://images.unsplash.com/photo-1584621159576-142a68689322?auto=format&fit=crop&w=800&q=80`, name: `${sku} - Detalle Textura`, isMain: false, size: '900 KB' },
  { id: `prod-${sku}-3`, url: `https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80`, name: `${sku} - Ambiente`, isMain: false, size: '1.5 MB' },
];

// Helper para generar dimensiones ficticias basadas en categoría
const getProductDimensions = (category: string) => {
  const dims: Record<string, string> = {
    'Colchones': '150x190x28 cm',
    'Almohadas': '70x40 cm',
    'Muebles': '80x90x100 cm',
    'Ropa de Cama': '240x220 cm',
    'Bases': '150x190x35 cm',
    'Cabeceros': '160x120x8 cm'
  };
  return dims[category] || 'Estándar';
};

// Helper para obtener imagen miniatura ficticia
const getProductThumbnail = (sku: string) => 
  `https://images.unsplash.com/photo-1505693416388-b034680c5006?auto=format&fit=crop&w=100&q=80&text=${sku}`;

interface ImageCardProps {
  img: GalleryImage;
  section: string;
  index?: number;
  total?: number;
  onDelete: (section: string, id: string) => void;
  onSetMain: (id: string) => void;
  onMove?: (index: number, direction: 'left' | 'right') => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ img, section, index = 0, total = 0, onDelete, onSetMain, onMove }) => (
  <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col">
    {/* Image Area */}
    <div className="relative aspect-square overflow-hidden bg-gray-100">
      <img src={img.url} alt={img.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
      
      {/* Order Badge */}
      {section === 'products' && (
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md z-10 border border-white/10">
          #{index + 1}
        </div>
      )}

      {/* Main Badge */}
      {img.isMain && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm flex items-center gap-1">
          <Check size={10} /> Principal
        </div>
      )}

      {/* Overlay Actions */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
        <div className="flex justify-end">
          <button 
            onClick={() => onDelete(section, img.id)}
            className="p-1.5 bg-white text-red-500 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
            title="Eliminar imagen"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        {/* Move Controls for Products */}
        {section === 'products' && onMove && (
          <div className="flex justify-center gap-2 mb-2">
             <button 
                onClick={() => onMove(index, 'left')}
                disabled={index === 0}
                className="p-1.5 bg-white/90 rounded-full text-gray-700 hover:bg-white hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Mover antes"
             >
               <ChevronLeft size={18} />
             </button>
             <button 
                onClick={() => onMove(index, 'right')}
                disabled={index === total - 1}
                className="p-1.5 bg-white/90 rounded-full text-gray-700 hover:bg-white hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Mover después"
             >
               <ChevronRight size={18} />
             </button>
          </div>
        )}
      </div>
    </div>

    {/* Footer Info */}
    <div className="p-3 border-t border-gray-100">
       <p className="text-xs font-medium text-gray-800 truncate mb-1" title={img.name}>{img.name}</p>
       <div className="flex items-center justify-between">
         <p className="text-[10px] text-gray-400">{img.size}</p>
         {section === 'products' && !img.isMain && (
           <button 
             onClick={() => onSetMain(img.id)}
             className="text-[10px] font-bold text-primary-600 hover:text-primary-800 hover:underline"
           >
             Hacer Principal
           </button>
         )}
       </div>
    </div>
  </div>
);

const UploadZone = () => (
  <div className="border-2 border-dashed border-gray-300 rounded-xl h-full min-h-[200px] flex flex-col items-center justify-center text-gray-400 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 transition-all cursor-pointer bg-gray-50/50">
    <div className="p-3 rounded-full bg-white shadow-sm mb-3">
      <Upload size={24} />
    </div>
    <span className="text-sm font-medium">Arrastra imágenes</span>
    <span className="text-xs mt-1 text-center px-4">JPG, PNG o WebP</span>
  </div>
);

export const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'portal' | 'promotions'>('products');
  
  // Product Search State
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Images State
  const [productImages, setProductImages] = useState<GalleryImage[]>([]);
  const [generalImages, setGeneralImages] = useState(MOCK_IMAGES);

  // Derived Data
  const uniqueCategories = useMemo(() => {
    const cats = new Set(MOCK_PRODUCTS.map(p => p.category));
    return ['Todas', ...Array.from(cats)];
  }, []);

  // Products enriched with metadata for display
  const enrichedProducts = useMemo(() => {
    return MOCK_PRODUCTS.map(p => ({
      ...p,
      dimensions: getProductDimensions(p.category),
      thumbnail: getProductThumbnail(p.sku)
    }));
  }, []);

  const filteredProductList = useMemo(() => {
    if (!searchTerm && categoryFilter === 'Todas') return []; // Don't show full list by default

    return enrichedProducts.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'Todas' || p.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter, enrichedProducts]);

  const selectedProductData = useMemo(() => 
    enrichedProducts.find(p => p.id === selectedProductId), 
  [selectedProductId, enrichedProducts]);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setIsSearchFocused(false);
    setSearchTerm(''); // Clear search to show selected view cleanly
    if (productId) {
      const product = MOCK_PRODUCTS.find(p => p.id === productId);
      if (product) {
        setProductImages(getMockProductImages(product.sku));
      }
    } else {
      setProductImages([]);
    }
  };

  const handleDeleteImage = (section: string, imgId: string) => {
    if (section === 'products') {
      setProductImages(prev => prev.filter(img => img.id !== imgId));
    } else {
      setGeneralImages(prev => ({
        ...prev,
        [section]: prev[section as keyof typeof MOCK_IMAGES].filter(img => img.id !== imgId)
      }));
    }
  };

  const handleSetMain = (imgId: string) => {
    setProductImages(prev => prev.map(img => ({
      ...img,
      isMain: img.id === imgId
    })));
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= productImages.length) return;

    const newImages = [...productImages];
    const [movedItem] = newImages.splice(index, 1);
    newImages.splice(newIndex, 0, movedItem);
    
    setProductImages(newImages);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Galería Multimedia</h2>
          <p className="text-gray-500 mt-1">Gestiona las imágenes de productos, banners del portal y promociones.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'products'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package size={18} />
            Productos
          </button>
          <button
            onClick={() => setActiveTab('portal')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'portal'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Monitor size={18} />
            Portal Web
          </button>
          <button
            onClick={() => setActiveTab('promotions')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'promotions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Tag size={18} />
            Promociones
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[600px]">
        
        {/* PRODUCT GALLERY LOGIC */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Intelligent Search Bar */}
            {!selectedProductData ? (
              <div className="max-w-3xl mx-auto mt-8 mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Buscar Producto</h3>
                  <p className="text-gray-500">Encuentra el producto para gestionar sus recursos gráficos.</p>
                </div>
                
                <div ref={searchContainerRef} className="relative z-30">
                   <div className="flex flex-col md:flex-row gap-2 mb-4">
                      <div className="flex-1 relative group">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                         </div>
                         <input 
                           type="text" 
                           placeholder="Escribe SKU, Nombre o ID del producto..." 
                           value={searchTerm}
                           onFocus={() => setIsSearchFocused(true)}
                           onChange={(e) => {
                             setSearchTerm(e.target.value);
                             setIsSearchFocused(true);
                           }}
                           className="w-full pl-11 pr-4 py-4 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 text-base transition-all outline-none"
                         />
                      </div>
                      <div className="relative min-w-[180px]">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-4 w-4 text-gray-400" />
                         </div>
                         <select 
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full pl-10 pr-8 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none appearance-none text-sm font-medium text-gray-700 cursor-pointer hover:bg-white transition-colors"
                         >
                            {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                      </div>
                   </div>

                   {/* Smart Dropdown Results */}
                   {isSearchFocused && (
                     <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-96 overflow-y-auto z-50 divide-y divide-gray-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {filteredProductList.length > 0 ? (
                          filteredProductList.map(p => (
                            <div 
                              key={p.id} 
                              onClick={() => handleSelectProduct(p.id)}
                              className="flex items-start gap-4 p-4 hover:bg-blue-50/50 cursor-pointer transition-colors group"
                            >
                               {/* Thumbnail Mock */}
                               <div className="h-16 w-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                  <img src={p.thumbnail} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                               </div>
                               
                               <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-primary-700 truncate pr-2">{p.name}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                      {p.stock > 0 ? 'En Stock' : 'Agotado'}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">SKU: {p.sku}</span>
                                    <span>{p.category}</span>
                                  </div>

                                  {/* Technical Data / Dimensions */}
                                  <div className="flex items-center gap-4 mt-2 pt-2 border-t border-dashed border-gray-100">
                                     <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                        <Maximize size={12} className="text-gray-400"/>
                                        <span className="font-medium">Dimensiones:</span> {p.dimensions}
                                     </div>
                                     <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                        <Box size={12} className="text-gray-400"/>
                                        <span>Peso aprox. 12kg</span>
                                     </div>
                                  </div>
                               </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            {searchTerm ? 'No se encontraron productos con ese criterio.' : 'Escribe para buscar productos...'}
                          </div>
                        )}
                     </div>
                   )}
                </div>
                
                {/* Empty State Illustration */}
                {!isSearchFocused && !searchTerm && (
                   <div className="flex justify-center mt-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                      <div className="flex gap-4">
                         {[1,2,3].map(i => (
                           <div key={i} className="w-32 h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-200"></div>
                         ))}
                      </div>
                   </div>
                )}
              </div>
            ) : (
              // SELECTED PRODUCT VIEW
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Product Header Info */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="h-14 w-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img src={selectedProductData.thumbnail} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                         <h3 className="font-bold text-gray-900">{selectedProductData.name}</h3>
                         <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                            <span className="font-mono">SKU: {selectedProductData.sku}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{selectedProductData.category}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className="flex items-center gap-1"><Ruler size={10}/> {selectedProductData.dimensions}</span>
                         </div>
                      </div>
                   </div>
                   <button 
                     onClick={() => setSelectedProductId('')}
                     className="text-sm text-primary-600 hover:text-primary-800 font-medium hover:underline"
                   >
                     Cambiar Producto
                   </button>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="text-primary-600" size={20} />
                    Galería Activa ({productImages.length})
                  </h3>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                     <span className="bg-gray-100 p-1 rounded"><ChevronLeft size={12}/></span>
                     Ordena arrastrando o usando flechas
                     <span className="bg-gray-100 p-1 rounded"><ChevronRight size={12}/></span>
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <UploadZone />
                  {productImages.map((img, index) => (
                    <ImageCard 
                      key={img.id} 
                      img={img} 
                      section="products" 
                      index={index}
                      total={productImages.length}
                      onDelete={handleDeleteImage}
                      onSetMain={handleSetMain}
                      onMove={handleMoveImage}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PORTAL GALLERY LOGIC */}
        {activeTab === 'portal' && (
          <div className="space-y-4 animate-in fade-in duration-300">
             <div className="flex justify-between items-center">
               <h3 className="font-medium text-gray-900">Recursos Gráficos del Sitio Web</h3>
               <span className="text-xs text-gray-500">{generalImages['portal'].length} imágenes</span>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <UploadZone />
                {generalImages['portal'].map(img => (
                  <ImageCard 
                    key={img.id} 
                    img={img} 
                    section="portal" 
                    onDelete={handleDeleteImage}
                    onSetMain={handleSetMain}
                  />
                ))}
             </div>
          </div>
        )}

        {/* PROMOTIONS GALLERY LOGIC */}
        {activeTab === 'promotions' && (
          <div className="space-y-4 animate-in fade-in duration-300">
             <div className="flex justify-between items-center">
               <h3 className="font-medium text-gray-900">Flyers y Banners de Campaña</h3>
               <span className="text-xs text-gray-500">{generalImages['promotions'].length} imágenes</span>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <UploadZone />
                {generalImages['promotions'].map(img => (
                  <ImageCard 
                    key={img.id} 
                    img={img} 
                    section="promotions" 
                    onDelete={handleDeleteImage}
                    onSetMain={handleSetMain}
                  />
                ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
};