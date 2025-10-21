// Product Types
export interface ProductVariant {
  name: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  hasVariants: boolean;
  variants: ProductVariant[];
  createdAt: string;
}

// Cart Types
export interface CartItem {
  cartItemKey: string;
  productId: string;
  quantity: number;
  variantName?: string | null;
}

// Sale Types
export interface SaleItem {
  productId: string;
  productName: string;
  variant: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'efectivo' | 'tarjeta';
  timestamp: number;
}

// Return Types
export interface ReturnItem {
  productId: string;
  productName: string;
  variant: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  originalSaleId: string;
}

export interface Return {
  id: string;
  date: string;
  items: ReturnItem[];
  totalAmount: number;
  reason: string;
  originalSaleId: string;
  timestamp: number;
}

export interface ReturnResult extends ApiResponse {
  return?: Return;
  updatedProducts?: boolean;
}

// Daily Cash Register Types
export interface DailyReport {
  date: string;
  totalSales: number;
  totalAmount: number;
  salesCount: number;
  totalItems: number;
  sales: Sale[];
  paymentMethods: {
    efectivo: number;
    tarjeta: number;
  };
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

export interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color?: string;
}

// App State Types
export interface AppState {
  lastSaved?: string;
  hasProducts?: boolean;
  productsCount?: number;
  hasCartItems?: boolean;
  cartItemsCount?: number;
  appStarted?: boolean;
  lastStartTime?: string;
  lastClosedTime?: string;
  appState?: string;
}

// Email Config Types
export interface EmailConfig {
  defaultEmail: string;
  enableEmailNotifications: boolean;
  autoSendReceipts: boolean;
  emailServiceProvider: 'mailto' | 'gmail' | 'custom';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PurchaseResult extends ApiResponse {
  sale?: Sale;
  emptyCart?: boolean;
}

export interface EmailResult extends ApiResponse {
  method?: string;
  link?: string;
}

// Component Props Types
export interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string, variantName?: string | null) => void;
  onAddToCartWithQuantity?: (productId: string, quantity: number, variantName?: string | null) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  showAddToCart?: boolean;
  showActions?: boolean;
  cartQuantity?: number;
}

export interface CartProps {
  cart: CartItem[];
  products: Product[];
  onUpdateQuantity: (cartItemKey: string, newQuantity: number) => void;
  onRemove: (cartItemKey: string) => void;
  onCheckout: () => void;
  total: number;
}

export interface NavigationProps {
  currentTab: 'products' | 'store' | 'register' | 'about';
  onTabChange: (tab: 'products' | 'store' | 'register' | 'about') => void;
  children: React.ReactNode;
}

// Utility Types
export type PaymentMethod = 'efectivo' | 'tarjeta';
export type TabType = 'products' | 'store' | 'register' | 'about';

// Store Screen Types
export interface StoreScreenState {
  products: Product[];
  cart: CartItem[];
  showCart: boolean;
  refreshing: boolean;
  lastUpdated: Date | null;
}

// Data Management Panel Types
export interface DataManagementPanelProps {
  onClose: () => void;
}

export interface BackupData {
  products: Product[];
  sales: Sale[];
  emailConfig: EmailConfig;
  timestamp: string;
  version: string;
}
