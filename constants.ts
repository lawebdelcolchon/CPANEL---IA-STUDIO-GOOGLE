

import { Customer, Order, Status, Product, StockMovement, Company, SystemUser, ActivityLog, AbandonedCart, WishlistStat, TrafficStat, MarketplaceOrder, NotificationItem, Shipment, SupplierOrder } from './types';

export const COMPANIES: Company[] = [
  { id: 'c1', name: 'DreamRest', color: 'bg-blue-600', logo: 'DR' },
  { id: 'c2', name: 'EcoSleep', color: 'bg-green-600', logo: 'ES' },
  { id: 'c3', name: 'LuxeBed', color: 'bg-purple-600', logo: 'LB' },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'C001', companyId: 'c1', name: 'Jorge Pirela', email: 'jorge@example.com', phone: '+34 600 000 000', totalOrders: 12, totalSpent: 2450.00, status: Status.Active, joinDate: '2025-10-20' },
  { id: 'C002', companyId: 'c2', name: 'Ana García', email: 'ana@example.com', phone: '+34 600 123 456', totalOrders: 5, totalSpent: 890.50, status: Status.Active, joinDate: '2025-11-01' },
  { id: 'C003', companyId: 'c3', name: 'Carlos Ruiz', email: 'carlos@example.com', phone: '+34 600 999 888', totalOrders: 1, totalSpent: 150.00, status: Status.Inactive, joinDate: '2025-09-15' },
  { id: 'C004', companyId: 'c1', name: 'María Rodriguez', email: 'maria@example.com', phone: '+34 600 777 666', totalOrders: 8, totalSpent: 1200.00, status: Status.Active, joinDate: '2025-10-05' },
  { id: 'C005', companyId: 'c2', name: 'Pedro Sanchez', email: 'pedro@example.com', phone: '+34 600 555 444', totalOrders: 0, totalSpent: 0.00, status: Status.Pending, joinDate: '2025-11-10' },
  { id: 'C006', companyId: 'c3', name: 'Sofía Martínez', email: 'sofia@example.com', phone: '+34 611 222 333', totalOrders: 3, totalSpent: 450.00, status: Status.Active, joinDate: '2025-11-12' },
  { id: 'C007', companyId: 'c1', name: 'Luis Fernández', email: 'luis@example.com', phone: '+34 622 333 444', totalOrders: 15, totalSpent: 3200.00, status: Status.Active, joinDate: '2025-08-20' },
  { id: 'C008', companyId: 'c2', name: 'Elena Gómez', email: 'elena@example.com', phone: '+34 633 444 555', totalOrders: 2, totalSpent: 180.00, status: Status.Inactive, joinDate: '2025-10-30' },
  { id: 'C009', companyId: 'c3', name: 'Roberto Díaz', email: 'roberto@example.com', phone: '+34 644 555 666', totalOrders: 6, totalSpent: 950.00, status: Status.Active, joinDate: '2025-09-01' },
  { id: 'C010', companyId: 'c1', name: 'Carmen López', email: 'carmen@example.com', phone: '+34 655 666 777', totalOrders: 1, totalSpent: 89.00, status: Status.Pending, joinDate: '2025-11-14' },
  { id: 'C011', companyId: 'c2', name: 'Miguel Ángel', email: 'miguel@example.com', phone: '+34 666 777 888', totalOrders: 20, totalSpent: 5600.00, status: Status.Active, joinDate: '2025-07-15' },
  { id: 'C012', companyId: 'c3', name: 'Lucía Torres', email: 'lucia@example.com', phone: '+34 677 888 999', totalOrders: 4, totalSpent: 620.00, status: Status.Active, joinDate: '2025-10-10' },
  { id: 'C013', companyId: 'c1', name: 'Antonio Ruiz', email: 'antonio@example.com', phone: '+34 688 999 000', totalOrders: 0, totalSpent: 0.00, status: Status.Inactive, joinDate: '2025-11-05' },
  { id: 'C014', companyId: 'c2', name: 'Isabel Romero', email: 'isabel@example.com', phone: '+34 699 000 111', totalOrders: 7, totalSpent: 1100.00, status: Status.Active, joinDate: '2025-09-25' },
  { id: 'C015', companyId: 'c3', name: 'Francisco Gil', email: 'francisco@example.com', phone: '+34 600 111 222', totalOrders: 9, totalSpent: 1350.00, status: Status.Active, joinDate: '2025-08-10' },
];

export const MOCK_ORDERS: Order[] = [
  { id: '#ORD-7782', companyId: 'c1', customerName: 'Jorge Pirela', products: 'Colchón Visco Energy 2', amount: 210.00, status: Status.Completed, date: '2025-11-01', paymentMethod: 'Tarjeta' },
  { id: '#ORD-7783', companyId: 'c2', customerName: 'Ana García', products: 'Almohada Viscoelástica', amount: 45.00, status: Status.Completed, date: '2025-11-01', paymentMethod: 'PayPal' },
  { id: '#ORD-7784', companyId: 'c3', customerName: 'Carlos Ruiz', products: 'Cabecero Tapizado', amount: 149.99, status: Status.Pending, date: '2025-11-02', paymentMethod: 'Transferencia' },
  { id: '#ORD-7785', companyId: 'c1', customerName: 'María Rodriguez', products: 'Juego de Sábanas', amount: 69.90, status: Status.Cancelled, date: '2025-11-02', paymentMethod: 'Tarjeta' },
  { id: '#ORD-7786', companyId: 'c1', customerName: 'Jorge Pirela', products: 'Protector Truck', amount: 210.00, status: Status.Completed, date: '2025-11-03', paymentMethod: 'Tarjeta' },
  { id: '#ORD-7787', companyId: 'c3', customerName: 'Sofía Martínez', products: 'Edredón Nórdico', amount: 120.00, status: Status.Completed, date: '2025-11-03', paymentMethod: 'PayPal' },
  { id: '#ORD-7788', companyId: 'c1', customerName: 'Luis Fernández', products: 'Canapé Abatible Madera', amount: 350.00, status: Status.Completed, date: '2025-11-04', paymentMethod: 'Tarjeta' },
  { id: '#ORD-7789', companyId: 'c2', customerName: 'Elena Gómez', products: 'Pack 2 Almohadas', amount: 80.00, status: Status.Pending, date: '2025-11-04', paymentMethod: 'Tarjeta' },
  { id: '#ORD-7790', companyId: 'c3', customerName: 'Roberto Díaz', products: 'Colchón Muelle Ensacado', amount: 450.00, status: Status.Completed, date: '2025-11-05', paymentMethod: 'Transferencia' },
  { id: '#ORD-7791', companyId: 'c1', customerName: 'Carmen López', products: 'Protector de Colchón', amount: 35.00, status: Status.Completed, date: '2025-11-05', paymentMethod: 'Tarjeta' },
  { id: '#ORD-7792', companyId: 'c2', customerName: 'Miguel Ángel', products: 'Base Tapizada 3D', amount: 110.00, status: Status.Completed, date: '2025-11-06', paymentMethod: 'PayPal' },
  { id: '#ORD-7793', companyId: 'c3', customerName: 'Lucía Torres', products: 'Sábanas de Algodón', amount: 55.00, status: Status.Cancelled, date: '2025-11-06', paymentMethod: 'Tarjeta' },
  { id: '#ORD-7794', companyId: 'c1', customerName: 'Antonio Ruiz', products: 'Cabecero Madera', amount: 180.00, status: Status.Pending, date: '2025-11-07', paymentMethod: 'Transferencia' },
  { id: '#ORD-7795', companyId: 'c2', customerName: 'Isabel Romero', products: 'Cojín Decorativo', amount: 25.00, status: Status.Completed, date: '2025-11-07', paymentMethod: 'Tarjeta' },
  { id: '#ORD-7796', companyId: 'c3', customerName: 'Francisco Gil', products: 'Colchón Látex 100%', amount: 600.00, status: Status.Completed, date: '2025-11-08', paymentMethod: 'PayPal' },
  { id: '#ORD-7797', companyId: 'c1', customerName: 'Jorge Pirela', products: 'Relleno Nórdico Plumón', amount: 200.00, status: Status.Pending, date: '2025-11-08', paymentMethod: 'Tarjeta' },
  { id: '#ORD-7798', companyId: 'c2', customerName: 'Ana García', products: 'Funda de Almohada', amount: 15.00, status: Status.Completed, date: '2025-11-09', paymentMethod: 'Tarjeta' },
  { id: '#ORD-7799', companyId: 'c3', customerName: 'Carlos Ruiz', products: 'Topper Viscoelástico', amount: 130.00, status: Status.Completed, date: '2025-11-09', paymentMethod: 'PayPal' },
  { id: '#ORD-7800', companyId: 'c1', customerName: 'María Rodriguez', products: 'Manta Polar', amount: 40.00, status: Status.Completed, date: '2025-11-10', paymentMethod: 'Tarjeta' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'P001', companyId: 'c1', name: 'Protector Truck Transpirable', category: 'Colchones para Camiones', price: 210.00, stock: 45, status: Status.Inactive, sku: 'ptti' },
  { id: 'P002', companyId: 'c1', name: 'Colchón Visco Energy 2', category: 'Colchones', price: 210.00, stock: 120, status: Status.Featured, sku: 'Energy' },
  { id: 'P003', companyId: 'c1', name: 'Sillón Relax Blanco', category: 'Colección Real Madrid', price: 210.00, stock: 12, status: Status.Hidden, sku: 'Sillon-RM-W' },
  { id: 'P004', companyId: 'c1', name: 'Cojín Azul', category: 'Colección Real Madrid', price: 45.00, stock: 200, status: Status.Hidden, sku: 'Cojin-RM-B' },
  { id: 'P005', companyId: 'c2', name: 'Somier Multiláminas', category: 'Somieres', price: 120.00, stock: 50, status: Status.Featured, sku: 'Lumbar' },
  { id: 'P006', companyId: 'c2', name: 'Almohada Cervical Gel', category: 'Almohadas', price: 55.00, stock: 80, status: Status.Active, sku: 'Alm-Cerv-Gel' },
  { id: 'P007', companyId: 'c3', name: 'Canapé Abatible Gran Capacidad', category: 'Canapés', price: 350.00, stock: 25, status: Status.Featured, sku: 'Can-Abat-GC' },
  { id: 'P008', companyId: 'c2', name: 'Cubrecolchón Impermeable', category: 'Protectores', price: 35.00, stock: 150, status: Status.Active, sku: 'Cub-Imp' },
  { id: 'P009', companyId: 'c3', name: 'Edredón Nórdico 4 Estaciones', category: 'Ropa de Cama', price: 120.00, stock: 60, status: Status.Active, sku: 'Edr-Nord-4E' },
  { id: 'P010', companyId: 'c2', name: 'Base Tapizada 3D Reforzada', category: 'Bases', price: 110.00, stock: 40, status: Status.Active, sku: 'Base-Tap-3D' },
  { id: 'P011', companyId: 'c1', name: 'Cabecero Tapizado Capitoné', category: 'Cabeceros', price: 180.00, stock: 15, status: Status.Inactive, sku: 'Cab-Tap-Cap' },
  { id: 'P012', companyId: 'c3', name: 'Sábanas Algodón Egipcio', category: 'Ropa de Cama', price: 90.00, stock: 100, status: Status.Featured, sku: 'Sab-Alg-Egi' },
  { id: 'P013', companyId: 'c3', name: 'Colchón Muelle Ensacado Premium', category: 'Colchones', price: 550.00, stock: 30, status: Status.Active, sku: 'Col-Mue-Pre' },
  { id: 'P014', companyId: 'c3', name: 'Topper Viscoelástico 5cm', category: 'Toppers', price: 130.00, stock: 70, status: Status.Active, sku: 'Top-Vis-5' },
  { id: 'P015', companyId: 'c1', name: 'Manta Pelo Largo Suave', category: 'Mantas', price: 45.00, stock: 90, status: Status.Active, sku: 'Man-Pel-Lar' },
  { id: 'P016', companyId: 'c2', name: 'Pack 2 Almohadas Visco', category: 'Almohadas', price: 70.00, stock: 200, status: Status.Featured, sku: 'Pac-2-Alm-Vis' },
  { id: 'P017', companyId: 'c1', name: 'Protector de Colchón Acolchado', category: 'Protectores', price: 40.00, stock: 120, status: Status.Active, sku: 'Pro-Col-Aco' },
  { id: 'P018', companyId: 'c2', name: 'Juego de Cama Infantil', category: 'Infantil', price: 30.00, stock: 50, status: Status.Active, sku: 'Jue-Cam-Inf' },
  { id: 'P019', companyId: 'c2', name: 'Colchón Cuna Bebé', category: 'Infantil', price: 80.00, stock: 20, status: Status.Active, sku: 'Col-Cun-Beb' },
  { id: 'P020', companyId: 'c3', name: 'Sillón Lactancia', category: 'Muebles', price: 250.00, stock: 5, status: Status.Hidden, sku: 'Sil-Lac' },
];

export const SALES_DATA = [
  { name: 'Lun', ventas: 4000, conversios: 2400 },
  { name: 'Mar', ventas: 3000, conversios: 1398 },
  { name: 'Mie', ventas: 2000, conversios: 9800 },
  { name: 'Jue', ventas: 2780, conversios: 3908 },
  { name: 'Vie', ventas: 1890, conversios: 4800 },
  { name: 'Sab', ventas: 2390, conversios: 3800 },
  { name: 'Dom', ventas: 3490, conversios: 4300 },
];

export const FUNNEL_DATA = [
  { name: 'Visitas', value: 12000 },
  { name: 'Carrito', value: 4500 },
  { name: 'Checkout', value: 3200 },
  { name: 'Compra', value: 2100 },
];

export const MOCK_STOCK_MOVEMENTS: StockMovement[] = [
  { id: 'MOV-001', companyId: 'c1', productId: 'P002', productName: 'Colchón Visco Energy 2', sku: 'Energy', type: 'in', quantity: 50, date: '2025-11-10 09:30', user: 'Jorge P.', reason: 'Reabastecimiento' },
  { id: 'MOV-002', companyId: 'c2', productId: 'P006', productName: 'Almohada Cervical Gel', sku: 'Alm-Cerv-Gel', type: 'out', quantity: 12, date: '2025-11-10 14:20', user: 'Sistema', reason: 'Pedido #ORD-7782' },
  { id: 'MOV-003', companyId: 'c3', productId: 'P013', productName: 'Colchón Muelle Ensacado', sku: 'Col-Mue-Pre', type: 'adjustment', quantity: -2, date: '2025-11-09 18:00', user: 'Almacén', reason: 'Dañado' },
  { id: 'MOV-004', companyId: 'c2', productId: 'P008', productName: 'Cubrecolchón Impermeable', sku: 'Cub-Imp', type: 'in', quantity: 100, date: '2025-11-09 11:00', user: 'Jorge P.', reason: 'Entrada Proveedor' },
  { id: 'MOV-005', companyId: 'c1', productId: 'P002', productName: 'Colchón Visco Energy 2', sku: 'Energy', type: 'out', quantity: 5, date: '2025-11-08 16:45', user: 'Sistema', reason: 'Pedido #ORD-7780' },
  { id: 'MOV-006', companyId: 'c3', productId: 'P020', productName: 'Sillón Lactancia', sku: 'Sil-Lac', type: 'return', quantity: 1, date: '2025-11-08 10:15', user: 'Atención C.', reason: 'Devolución Cliente' },
  { id: 'MOV-007', companyId: 'c1', productId: 'P004', productName: 'Cojín Azul', sku: 'Cojin-RM-B', type: 'out', quantity: 20, date: '2025-11-07 09:00', user: 'Marketing', reason: 'Regalo Evento' },
  { id: 'MOV-008', companyId: 'c3', productId: 'P012', productName: 'Sábanas Algodón Egipcio', sku: 'Sab-Alg-Egi', type: 'in', quantity: 50, date: '2025-11-06 13:30', user: 'Jorge P.', reason: 'Reabastecimiento' },
];

// Mock System Users
export const MOCK_SYSTEM_USERS: SystemUser[] = [
  { id: 'u1', name: 'Jorge Pirela', email: 'jorge@example.com', role: 'Admin', status: Status.Active, lastLogin: 'Hace 5 min' },
  { id: 'u2', name: 'María Venta', email: 'maria.v@example.com', role: 'Vendedor', status: Status.Active, lastLogin: 'Hace 2 horas' },
  { id: 'u3', name: 'Pedro Soporte', email: 'pedro.s@example.com', role: 'Soporte', status: Status.Inactive, lastLogin: 'Hace 3 días' },
  { id: 'u4', name: 'Laura Gerencia', email: 'laura.g@example.com', role: 'Gerente', status: Status.Active, lastLogin: 'Ayer' },
];

// Mock Activity Logs
export const MOCK_ACTIVITY_LOG: ActivityLog[] = [
  { id: 'l1', userId: 'u1', userName: 'Jorge Pirela', action: 'Actualización Stock', details: 'Agregó 50u a Colchón Visco', date: 'Hoy, 10:30 AM', type: 'success' },
  { id: 'l2', userId: 'u2', userName: 'María Venta', action: 'Nuevo Pedido', details: 'Creó pedido #ORD-7801', date: 'Hoy, 09:15 AM', type: 'info' },
  { id: 'l3', userId: 'u1', userName: 'Jorge Pirela', action: 'Cambio Precio', details: 'Cambió precio de P002 a $210', date: 'Ayer, 04:45 PM', type: 'warning' },
];

// Marketing Data Mock
export const MOCK_ABANDONED_CARTS: AbandonedCart[] = [
  { 
    id: 'AC-101', 
    companyId: 'c1', 
    customerName: 'Laura Vega', 
    products: [
      { name: 'Colchón Visco Energy 2', price: 210.00, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=200&q=80' }, 
      { name: 'Protector Impermeable', price: 35.00, image: 'https://images.unsplash.com/photo-1522771753035-4a500025fa42?auto=format&fit=crop&w=200&q=80' }
    ], 
    totalValue: 245.00, 
    date: 'Hace 2 horas', 
    recoveryStatus: 'Pending' 
  },
  { 
    id: 'AC-102', 
    companyId: 'c2', 
    guestId: 'Guest-8821', 
    products: [
      { name: 'Almohada Cervical Gel', price: 55.00, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=200&q=80' }
    ], 
    totalValue: 55.00, 
    date: 'Hace 5 horas', 
    recoveryStatus: 'Email Sent',
    channel: 'Email',
    scheduledDate: '2025-11-20',
    scheduledTime: '09:00'
  },
  { 
    id: 'AC-103', 
    companyId: 'c3', 
    customerName: 'Roberto Carlos', 
    products: [
      { name: 'Canapé Abatible GC', price: 350.00, image: 'https://images.unsplash.com/photo-1505693416388-b034680c5006?auto=format&fit=crop&w=200&q=80' }
    ], 
    totalValue: 350.00, 
    date: 'Ayer', 
    recoveryStatus: 'Pending' 
  },
  { 
    id: 'AC-104', 
    companyId: 'c1', 
    guestId: 'Guest-9901', 
    products: [
      { name: 'Sillón Relax', price: 250.00, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80' }
    ], 
    totalValue: 250.00, 
    date: 'Hace 1 día', 
    recoveryStatus: 'Scheduled',
    scheduledDate: '2025-11-22',
    scheduledTime: '10:00',
    channel: 'WhatsApp'
  },
];

export const MOCK_WISHLIST_STATS: WishlistStat[] = [
  { productId: 'P002', companyId: 'c1', productName: 'Colchón Visco Energy 2', count: 45, price: 210.00 },
  { productId: 'P006', companyId: 'c2', productName: 'Almohada Cervical Gel', count: 32, price: 55.00 },
  { productId: 'P013', companyId: 'c3', productName: 'Colchón Muelle Ensacado', count: 28, price: 550.00 },
  { productId: 'P007', companyId: 'c3', productName: 'Canapé Abatible GC', count: 20, price: 350.00 },
  { productId: 'P012', companyId: 'c3', productName: 'Sábanas Algodón Egipcio', count: 15, price: 90.00 },
];

export const MOCK_TRAFFIC_STATS: TrafficStat[] = [
  { date: 'Lun', companyId: 'c1', registeredVisitors: 120, guestVisitors: 340 },
  { date: 'Lun', companyId: 'c2', registeredVisitors: 80, guestVisitors: 210 },
  { date: 'Lun', companyId: 'c3', registeredVisitors: 50, guestVisitors: 150 },
  // More mock data would be aggregated in real app
];

export const MOCK_MARKETPLACE_ORDERS: MarketplaceOrder[] = [
  { id: '#MP-001', companyId: 'c1', customerName: 'Juan Pérez', products: 'Colchón Visco Energy', amount: 210.00, status: Status.Pending, date: '2025-11-12', paymentMethod: 'Marketplace', platform: 'Amazon', externalOrderId: '114-1234567-1234567', shippingStatus: 'Pending Shipment' },
  { id: '#MP-002', companyId: 'c1', customerName: 'Maria Silva', products: 'Almohada Gel', amount: 45.00, status: Status.Completed, date: '2025-11-11', paymentMethod: 'Marketplace', platform: 'Miravia', externalOrderId: 'MRV-99887766', shippingStatus: 'Delivered', trackingNumber: 'ES123456789' },
  { id: '#MP-003', companyId: 'c1', customerName: 'Pedro Gomez', products: 'Pack 2 Almohadas', amount: 80.00, status: Status.Completed, date: '2025-11-10', paymentMethod: 'Marketplace', platform: 'Amazon', externalOrderId: '114-9876543-2109876', shippingStatus: 'Shipped', trackingNumber: 'DHL-555666777' },
];

export const MOCK_NOTIFICATIONS_DATA: NotificationItem[] = [
  { id: 'n1', title: 'Nuevo Pedido Amazon', message: 'Se ha recibido un nuevo pedido #114-1234 de Amazon ES.', time: 'Hace 5 min', read: false, type: 'order', link: '/marketplace/amazon' },
  { id: 'n2', title: 'Stock Bajo', message: 'El producto "Colchón Energy" está por debajo del mínimo (5 unids).', time: 'Hace 1 hora', read: false, type: 'alert', link: '/inventory' },
  { id: 'n3', title: 'Actualización Miravia', message: 'La sincronización de precios con Miravia se completó con éxito.', time: 'Hace 2 horas', read: true, type: 'system', link: '/marketplace/miravia' },
  { id: 'n4', title: 'Mensaje de Cliente', message: 'Ana García ha preguntado sobre su devolución.', time: 'Ayer', read: true, type: 'message', link: '/customers' },
];

// Mock Shipments for Transport Module
export const MOCK_SHIPMENTS: Shipment[] = [
  { 
    id: 'SH-001', 
    orderId: '#ORD-7782', 
    provider: 'DHL', 
    customerName: 'Jorge Pirela', 
    originAddress: 'Almacén Central, Madrid',
    destinationAddress: 'Calle Mayor 123, 3A', 
    city: 'Madrid', 
    zipCode: '28001', 
    weight: 25.5, 
    shippingCost: 35.50, 
    status: 'Delivered', 
    trackingNumber: 'DHL-9988776655', 
    shippingDate: '2025-11-01',
    arrivalDate: '2025-11-02', // Delivered recently
    history: [
      { id: 'h1', date: '2025-11-01 10:00', action: 'Label Created', user: 'System' },
      { id: 'h2', date: '2025-11-01 14:00', action: 'Picked Up', user: 'DHL Driver' },
      { id: 'h3', date: '2025-11-02 09:30', action: 'Delivered', user: 'DHL Driver' }
    ] 
  },
  {
    id: 'SH-OLD-ALERT', 
    orderId: '#ORD-OLD', 
    provider: 'DHL', 
    customerName: 'Cliente Antiguo', 
    originAddress: 'Almacén Norte, Bilbao',
    destinationAddress: 'Calle Olvidada 99', 
    city: 'Valencia', 
    zipCode: '46001', 
    weight: 10.0, 
    shippingCost: 15.00, 
    status: 'Delivered', 
    trackingNumber: 'DHL-OLD-123', 
    shippingDate: '2025-10-01',
    arrivalDate: '2025-10-05', // Delivered > 7 days ago
    history: [
      { id: 'hOld1', date: '2025-10-01', action: 'Delivered', user: 'System' }
    ]
  },
  { 
    id: 'SH-002', 
    orderId: '#ORD-7783', 
    provider: 'SEUR', 
    customerName: 'Ana García', 
    originAddress: 'Almacén Central, Madrid',
    destinationAddress: 'Av. Diagonal 45, 1B', 
    city: 'Barcelona', 
    zipCode: '08005', 
    weight: 1.2, 
    shippingCost: 5.90, 
    status: 'In Transit', 
    trackingNumber: 'SEUR-11223344', 
    shippingDate: '2025-11-01',
    history: [
      { id: 'h4', date: '2025-11-01 11:30', action: 'Label Created', user: 'Jorge P.' },
      { id: 'h5', date: '2025-11-01 16:00', action: 'In Hub', user: 'SEUR System' }
    ] 
  },
  { 
    id: 'SH-003', 
    orderId: '#ORD-7786', 
    provider: 'DHL', 
    customerName: 'Jorge Pirela', 
    originAddress: 'Almacén Central, Madrid',
    destinationAddress: 'Calle Mayor 123, 3A', 
    city: 'Madrid', 
    zipCode: '28001', 
    weight: 5.0, 
    shippingCost: 12.00, 
    status: 'Ready', 
    history: [
      { id: 'h6', date: '2025-11-03 09:00', action: 'Label Created', user: 'System' }
    ] 
  },
  { 
    id: 'SH-004', 
    orderId: '#ORD-7787', 
    provider: 'SEUR', 
    customerName: 'Sofía Martínez', 
    originAddress: 'Almacén Sur, Sevilla',
    destinationAddress: 'Plaza España 5', 
    city: 'Sevilla', 
    zipCode: '41001', 
    weight: 3.5, 
    shippingCost: 8.50, 
    status: 'Exception', 
    shippingDate: '2025-11-03',
    history: [
      { id: 'h7', date: '2025-11-03 10:00', action: 'Label Created', user: 'System' },
      { id: 'h8', date: '2025-11-04 12:00', action: 'Delivery Failed', user: 'SEUR Driver', note: 'Customer not home' }
    ] 
  }
];

export const MOCK_SUPPLIER_ORDERS: SupplierOrder[] = [
  { id: 'SUP-001', companyId: 'c1', supplierName: 'Textiles del Norte', productName: 'Tela Algodón Premium', sku: 'MAT-COT-01', contractedQty: 500, availableQty: 500, purchaseDate: '2025-10-15', status: 'Completo' },
  { id: 'SUP-002', companyId: 'c1', supplierName: 'Espumas Ibéricas', productName: 'Bloque Viscoelástica V50', sku: 'MAT-VIS-50', contractedQty: 200, availableQty: 150, purchaseDate: '2025-11-01', expectedDate: '2025-11-15', status: 'Parcial' },
  { id: 'SUP-003', companyId: 'c2', supplierName: 'Maderas y Estructuras', productName: 'Láminas de Haya', sku: 'MAT-WOO-05', contractedQty: 1000, availableQty: 1000, purchaseDate: '2025-10-20', status: 'Completo' },
  { id: 'SUP-004', companyId: 'c3', supplierName: 'Textiles del Norte', productName: 'Hilo de Coser Alta Resistencia', sku: 'MAT-THR-02', contractedQty: 50, availableQty: 0, purchaseDate: '2025-11-10', expectedDate: '2025-11-20', status: 'Pendiente' },
  { id: 'SUP-005', companyId: 'c1', supplierName: 'Embalajes Pack', productName: 'Plástico de Burbujas', sku: 'PKG-BUB-01', contractedQty: 20, availableQty: 5, purchaseDate: '2025-11-05', status: 'Parcial' },
  { id: 'SUP-006', companyId: 'c2', supplierName: 'Químicos Foam', productName: 'Adhesivo Base Agua', sku: 'CHE-ADH-01', contractedQty: 100, availableQty: 100, purchaseDate: '2025-10-01', status: 'Completo' },
  { id: 'SUP-007', companyId: 'c3', supplierName: 'Espumas Ibéricas', productName: 'Bloque HR Alta Densidad', sku: 'MAT-HR-35', contractedQty: 300, availableQty: 280, purchaseDate: '2025-10-25', status: 'Parcial' },
];