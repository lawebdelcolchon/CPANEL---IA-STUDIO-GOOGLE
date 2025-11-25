
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
  Globe,
  Calendar,
  Layers,
  Image as ImageIcon,
  Upload,
  Ruler,
  Palette,
  FileText,
  ExternalLink,
  Check,
  ChevronDown
} from 'lucide-react';
import { MOCK_PRODUCTS, COMPANIES } from '../constants';
import { Status, Product } from '../types';
import { useCompany } from '../CompanyContext';

// --- Reusable Modal Component ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  type?: 'default' | 'danger';
  size?: 'md' | 'lg' | 'xl';
  zIndex?: string; // Allow custom z-index for nested modals
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, type = 'default', size = 'md', zIndex = 'z-50' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-5xl'
  };

  return (
    <div className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 sm:p-0`}>
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      <div className={`relative bg-white rounded-lg shadow-medusa w-full ${sizeClasses[size]} transform transition-all scale-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between flex-shrink-0 border-zinc-100 bg-zinc-50/30`}>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              {title}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Manage your data</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md hover:bg-zinc-100"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-0 overflow-y-auto bg-white flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Add Variant Modal Component ---
interface AddVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (variant: any) => void;
}

const AddVariantModal: React.FC<AddVariantModalProps> = ({ isOpen, onClose, onSave }) => {
  const [newVariant, setNewVariant] = useState({
    size: '',
    material: '',
    price: '',
    stock: '',
    sku: ''
  });

  const handleSubmit = () => {
    if (!newVariant.size || !newVariant.price) return; // Basic validation
    
    const variantData = {
      id: `var-new-${Date.now()}`,
      sku: newVariant.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
      size: newVariant.size,
      material: newVariant.material || 'Standard',
      price: Number(newVariant.price),
      stock: Number(newVariant.stock) || 0,
      images: [
        // Mock default image for new variants
        'https://images.unsplash.com/photo-1505693416388-b034680c5006?auto=format&fit=crop&w=100&q=80' 
      ]
    };
    
    onSave(variantData);
    setNewVariant({ size: '', material: '', price: '', stock: '', sku: '' }); // Reset
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Variation"
      size="md"
      zIndex="z-[60]" // Higher than the product modal
      footer={
        <>
          <button onClick={onClose} className="px-3 py-2 border border-zinc-200 rounded-md text-xs font-medium text-zinc-700 hover:bg-white bg-white shadow-sm transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-3 py-2 bg-zinc-900 text-white rounded-md text-xs font-medium hover:bg-zinc-800 shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus size={14} /> Create Variant
          </button>
        </>
      }
    >
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Size / Dimension</label>
          <input 
            type="text" 
            placeholder="e.g. 150x200 or XL"
            className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white"
            value={newVariant.size}
            onChange={(e) => setNewVariant({...newVariant, size: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Material / Finish</label>
          <input 
            type="text" 
            placeholder="e.g. Visco, Cotton, Wood"
            className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white"
            value={newVariant.material}
            onChange={(e) => setNewVariant({...newVariant, material: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Price</label>
              <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                 <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full border border-zinc-200 rounded-md pl-6 pr-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white"
                    value={newVariant.price}
                    onChange={(e) => setNewVariant({...newVariant, price: e.target.value})}
                 />
              </div>
           </div>
           <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Stock Quantity</label>
              <input 
                type="number" 
                placeholder="0"
                className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white"
                value={newVariant.stock}
                onChange={(e) => setNewVariant({...newVariant, stock: e.target.value})}
              />
           </div>
        </div>

        <div>
           <label className="block text-xs font-medium text-zinc-500 mb-1.5">SKU (Optional)</label>
           <input 
             type="text" 
             placeholder="Leave empty to auto-generate"
             className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white"
             value={newVariant.sku}
             onChange={(e) => setNewVariant({...newVariant, sku: e.target.value})}
           />
        </div>

        <div>
           <label className="block text-xs font-medium text-zinc-500 mb-1.5">Media</label>
           <div className="border-2 border-dashed border-zinc-200 rounded-md p-4 flex flex-col items-center justify-center text-zinc-400 bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer">
              <Upload size={16} className="mb-2" />
              <span className="text-xs">Drag image or click to upload</span>
           </div>
        </div>
      </div>
    </Modal>
  );
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

// Mock data generator for variations based on product category
const generateMockVariations = (category: string) => {
  const sizes = category === 'Almohadas' ? ['70cm', '75cm', '90cm'] : ['90x190', '135x190', '150x200'];
  const materials = ['Viscoelástica', 'Látex', 'Espuma HR'];
  
  return sizes.map((size, index) => ({
    id: `var-${index}`,
    sku: `SKU-${Math.floor(Math.random() * 1000)}-${size}`,
    size,
    material: materials[index % materials.length],
    price: Math.floor(Math.random() * 200) + 50,
    stock: Math.floor(Math.random() * 50),
    images: [
      `https://images.unsplash.com/photo-${index % 2 === 0 ? '1505693416388-b034680c5006' : '1584621159576-142a68689322'}?auto=format&fit=crop&w=100&q=80`,
      `https://images.unsplash.com/photo-${index % 2 !== 0 ? '1505693416388-b034680c5006' : '1584621159576-142a68689322'}?auto=format&fit=crop&w=100&q=80`
    ]
  }));
};

export const Products: React.FC = () => {
  const { selectedCompanyId } = useCompany();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [activeModal, setActiveModal] = useState<'master' | 'stock' | 'preview' | 'delete' | null>(null);
  const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState(false); // NEW STATE
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [advancedTab, setAdvancedTab] = useState<'info' | 'variants' | 'images'>('info');
  
  // Variations State
  const [currentVariations, setCurrentVariations] = useState<any[]>([]);

  useEffect(() => {
    setProducts(MOCK_PRODUCTS);
  }, [selectedCompanyId]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
       const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.sku.toLowerCase().includes(searchTerm.toLowerCase());
       const matchesCompany = selectedCompanyId === 'all' || p.companyId === selectedCompanyId;
       return matchesSearch && matchesCompany;
    });
  }, [searchTerm, products, selectedCompanyId]);

  const handleOpenMasterModal = (product: Product, initialTab: 'info' | 'variants' | 'images' = 'info') => {
    setSelectedProduct(product);
    setFormData({ ...product });
    setAdvancedTab(initialTab);
    setCurrentVariations(generateMockVariations(product.category)); // Load mock variations
    setActiveModal('master');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedProduct(null);
    setFormData({});
  };

  const handleSaveNewVariant = (variant: any) => {
    setCurrentVariations([...currentVariations, variant]);
  };

  const handleDeleteVariant = (id: string) => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      setCurrentVariations(currentVariations.filter(v => v.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-xl font-semibold text-zinc-900">Products</h2>
           <p className="text-xs text-zinc-500 mt-1">Manage your product catalog.</p>
        </div>
        <button 
          onClick={() => alert('Create Product')}
          className="bg-zinc-900 hover:bg-zinc-800 text-white px-3 py-2 rounded-md text-xs font-medium flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={14} />
          Create Product
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm relative min-h-[500px]">
        {/* Filters Bar */}
        <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..." 
                className="w-full pl-8 pr-4 py-1.5 border border-zinc-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
              />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-zinc-200 rounded-md text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
             <Filter size={14} /> Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto pb-12">
          <table className="w-full text-left">
            <thead className="bg-zinc-50/50 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Product</th>
                {selectedCompanyId === 'all' && <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Store</th>}
                <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Inventory</th>
                <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-zinc-900">{product.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono mt-0.5">{product.sku}</span>
                    </div>
                  </td>
                  {selectedCompanyId === 'all' && (
                      <td className="px-6 py-3">
                        <CompanyBadge companyId={product.companyId} />
                      </td>
                  )}
                  <td className="px-6 py-3 text-xs text-zinc-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-zinc-100 border border-zinc-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs font-medium text-zinc-900">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs ${product.stock < 20 ? 'text-red-600 font-medium' : 'text-zinc-600'}`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${product.status === Status.Active ? 'bg-emerald-500' : 'bg-zinc-300'}`}></div>
                        <span className="text-xs text-zinc-600">{product.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end relative group-hover:visible">
                      <button 
                        onClick={() => handleOpenMasterModal(product)}
                        className="text-zinc-400 hover:text-zinc-900 p-1.5 rounded hover:bg-zinc-100 transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Modal Instance */}
      <Modal
        isOpen={!!activeModal}
        onClose={handleCloseModal}
        title={selectedProduct?.name || 'Product'}
        size="xl"
        footer={
            <>
              <button onClick={handleCloseModal} className="px-3 py-2 border border-zinc-200 rounded-md text-xs font-medium text-zinc-700 hover:bg-white bg-white shadow-sm transition-colors">
                Cancel
              </button>
              <button onClick={() => { alert('Saved'); handleCloseModal(); }} className="px-3 py-2 bg-zinc-900 text-white rounded-md text-xs font-medium hover:bg-zinc-800 shadow-sm transition-colors flex items-center gap-2">
                <Save size={14} /> Save Changes
              </button>
            </>
        }
      >
        {selectedProduct && activeModal === 'master' && (
          <div className="flex flex-col h-[600px]">
             {/* Tabs Header */}
             <div className="flex border-b border-zinc-100 px-6 bg-zinc-50/50">
                <button 
                  onClick={() => setAdvancedTab('info')} 
                  className={`px-4 py-3 text-xs font-medium border-b-2 transition-all flex items-center gap-2 ${advancedTab === 'info' ? 'border-zinc-900 text-zinc-900 bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'}`}
                >
                   <FileText size={14} /> General Info
                </button>
                <button 
                  onClick={() => setAdvancedTab('variants')} 
                  className={`px-4 py-3 text-xs font-medium border-b-2 transition-all flex items-center gap-2 ${advancedTab === 'variants' ? 'border-zinc-900 text-zinc-900 bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'}`}
                >
                   <Layers size={14} /> Variants
                </button>
                <button 
                  onClick={() => setAdvancedTab('images')} 
                  className={`px-4 py-3 text-xs font-medium border-b-2 transition-all flex items-center gap-2 ${advancedTab === 'images' ? 'border-zinc-900 text-zinc-900 bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'}`}
                >
                   <ImageIcon size={14} /> Media
                </button>
             </div>
             
             {/* Tab Content */}
             <div className="flex-1 overflow-y-auto p-6 bg-white">
               
               {/* ---------------- GENERAL INFO TAB ---------------- */}
               {advancedTab === 'info' && (
                 <div className="flex gap-6 h-full">
                    {/* Left: Form */}
                    <div className="flex-1 space-y-5">
                       <div>
                         <label className="block text-xs font-medium text-zinc-500 mb-1.5">Product Title</label>
                         <input type="text" defaultValue={selectedProduct.name} className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white transition-shadow" />
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-xs font-medium text-zinc-500 mb-1.5">Base Price</label>
                             <div className="relative">
                               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                               <input type="number" defaultValue={selectedProduct.price} className="w-full border border-zinc-200 rounded-md pl-6 pr-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white transition-shadow" />
                             </div>
                          </div>
                          <div>
                             <label className="block text-xs font-medium text-zinc-500 mb-1.5">Total Stock</label>
                             <input type="number" defaultValue={selectedProduct.stock} className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white transition-shadow" />
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-xs font-medium text-zinc-500 mb-1.5">Category</label>
                             <select className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white transition-shadow">
                                <option>{selectedProduct.category}</option>
                                <option>Other</option>
                             </select>
                          </div>
                          <div>
                             <label className="block text-xs font-medium text-zinc-500 mb-1.5">Status</label>
                             <select className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white transition-shadow">
                                <option>{selectedProduct.status}</option>
                                <option>Active</option>
                                <option>Draft</option>
                             </select>
                          </div>
                       </div>

                       <div>
                         <label className="block text-xs font-medium text-zinc-500 mb-1.5">Description</label>
                         <textarea rows={6} className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 resize-none bg-white transition-shadow" defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."></textarea>
                       </div>
                    </div>

                    {/* Right: Visual Relationship */}
                    <div className="w-64 flex-shrink-0 border-l border-zinc-100 pl-6 hidden sm:block">
                       <h4 className="text-xs font-medium text-zinc-900 mb-3 flex items-center gap-2">
                          <ImageIcon size={14}/> Active Media
                       </h4>
                       <div className="space-y-3">
                          <div className="aspect-square w-full bg-zinc-50 border border-zinc-200 rounded-lg overflow-hidden relative group">
                             <img src="https://images.unsplash.com/photo-1505693416388-b034680c5006?auto=format&fit=crop&w=600&q=80" alt="Main" className="w-full h-full object-cover" />
                             <div className="absolute top-2 left-2 bg-zinc-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">MAIN</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                             {[1,2,3].map(i => (
                               <div key={i} className="aspect-square bg-zinc-50 border border-zinc-200 rounded-md overflow-hidden relative">
                                  <img src={`https://images.unsplash.com/photo-${i === 1 ? '1584621159576-142a68689322' : '1550684848-fac1c5b4e853'}?auto=format&fit=crop&w=200&q=80`} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                               </div>
                             ))}
                             <div className="aspect-square bg-zinc-50 border border-zinc-200 rounded-md flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 cursor-pointer transition-colors">
                                <Plus size={16} />
                             </div>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-2 italic">
                             Changes to images should be done in the Media tab. This is a preview.
                          </p>
                       </div>
                    </div>
                 </div>
               )}

               {/* ---------------- VARIANTS TAB ---------------- */}
               {advancedTab === 'variants' && (
                 <div className="space-y-6">
                    <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                       <div>
                          <h4 className="text-sm font-semibold text-zinc-900">Variables (Variants)</h4>
                          <p className="text-xs text-zinc-500">Manage sizes, materials, and specific images per variation.</p>
                       </div>
                       <button 
                         onClick={() => setIsAddVariantModalOpen(true)}
                         className="text-xs bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 px-3 py-2 rounded-md font-medium shadow-sm transition-all flex items-center gap-2"
                        >
                          <Plus size={14} /> Add Option
                       </button>
                    </div>

                    <div className="space-y-4">
                       {/* Headers */}
                       <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-zinc-50/50 border-b border-zinc-100 rounded-t-md text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                          <div className="col-span-4">Variation</div>
                          <div className="col-span-2">Price</div>
                          <div className="col-span-2">Stock</div>
                          <div className="col-span-3">Specific Media</div>
                          <div className="col-span-1 text-right"></div>
                       </div>

                       {/* List of Variations */}
                       {currentVariations.map((variant) => (
                          <div key={variant.id} className="grid grid-cols-12 gap-4 px-4 py-4 items-center border border-zinc-200 rounded-md hover:border-zinc-300 hover:shadow-sm transition-all bg-white group">
                             
                             {/* Size & Material */}
                             <div className="col-span-4">
                                <div className="flex flex-col gap-1">
                                   <div className="flex items-center gap-2">
                                      <span className="font-semibold text-sm text-zinc-900">{variant.size}</span>
                                      <span className="h-1 w-1 rounded-full bg-zinc-300"></span>
                                      <span className="text-xs text-zinc-600">{variant.material}</span>
                                   </div>
                                   <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                                      {variant.sku}
                                      <span className="cursor-pointer hover:text-zinc-600"><ExternalLink size={10}/></span>
                                   </div>
                                </div>
                             </div>

                             {/* Price */}
                             <div className="col-span-2">
                                <div className="relative">
                                   <input 
                                      type="number" 
                                      defaultValue={variant.price} 
                                      className="w-20 px-2 py-1 text-xs border border-transparent hover:border-zinc-200 focus:border-zinc-300 focus:ring-0 rounded bg-transparent font-medium text-zinc-900" 
                                   />
                                   <span className="text-[10px] text-zinc-400 absolute right-8 top-1.5 opacity-0 group-hover:opacity-100">USD</span>
                                </div>
                             </div>

                             {/* Stock */}
                             <div className="col-span-2">
                                <div className="flex items-center gap-2">
                                   <div className={`h-2 w-2 rounded-full ${variant.stock > 10 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                   <input 
                                      type="number" 
                                      defaultValue={variant.stock} 
                                      className="w-16 px-2 py-1 text-xs border border-transparent hover:border-zinc-200 focus:border-zinc-300 focus:ring-0 rounded bg-transparent text-zinc-600" 
                                   />
                                </div>
                             </div>

                             {/* Specific Images */}
                             <div className="col-span-3">
                                <div className="flex items-center gap-2">
                                   {variant.images.map((img: string, i: number) => (
                                      <div key={i} className="h-8 w-8 rounded border border-zinc-200 overflow-hidden relative cursor-pointer hover:ring-1 hover:ring-zinc-400 transition-all">
                                         <img src={img} alt="" className="w-full h-full object-cover" />
                                      </div>
                                   ))}
                                   <button className="h-8 w-8 rounded border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 transition-all">
                                      <Plus size={14} />
                                   </button>
                                </div>
                             </div>

                             {/* Actions */}
                             <div className="col-span-1 text-right">
                                <button 
                                  onClick={() => handleDeleteVariant(variant.id)}
                                  className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                   <Trash2 size={14} />
                                </button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
               )}

               {/* ---------------- IMAGES TAB ---------------- */}
               {advancedTab === 'images' && (
                 <div className="space-y-6">
                    <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-xl h-32 flex flex-col items-center justify-center text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all cursor-pointer">
                       <Upload size={24} className="mb-2" />
                       <span className="text-sm font-medium">Drag and drop images here</span>
                       <span className="text-xs mt-1">or click to upload</span>
                    </div>

                    <div>
                       <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">All Media ({selectedProduct.name})</h4>
                       <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                          {[1,2,3,4,5].map(i => (
                             <div key={i} className="aspect-square bg-zinc-100 rounded-lg border border-zinc-200 relative group overflow-hidden">
                                <img 
                                  src={`https://images.unsplash.com/photo-${i === 1 ? '1584621159576-142a68689322' : '1550684848-fac1c5b4e853'}?auto=format&fit=crop&w=300&q=80`} 
                                  className="w-full h-full object-cover" 
                                  alt=""
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                   <div className="flex justify-end">
                                      <button className="p-1 bg-white rounded text-zinc-900 hover:text-red-600"><Trash2 size={12}/></button>
                                   </div>
                                   <div className="flex justify-center">
                                      <span className="text-[10px] text-white bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">JPG</span>
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
               )}
             </div>
          </div>
        )}
      </Modal>

      {/* NEW: Add Variant Sub-Modal */}
      <AddVariantModal 
        isOpen={isAddVariantModalOpen} 
        onClose={() => setIsAddVariantModalOpen(false)}
        onSave={handleSaveNewVariant}
      />
    </div>
  );
};
