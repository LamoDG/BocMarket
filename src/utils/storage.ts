import AsyncStorage from '@react-native-async-storage/async-storage';
import type { 
  Product, 
  CartItem, 
  Sale, 
  AppState, 
  EmailConfig, 
  PurchaseResult, 
  EmailResult,
  ApiResponse,
  Return,
  ReturnItem,
  ReturnResult
} from '../types';

// Storage Keys
const PRODUCTS_KEY = 'bocmarket_products';
const CART_KEY = 'bocmarket_cart';
const APP_STATE_KEY = 'bocmarket_app_state';
const SALES_KEY = 'bocmarket_sales';
const DAILY_SALES_KEY = 'bocmarket_daily_sales';
const EMAIL_CONFIG_KEY = 'bocmarket_email_config';
const RETURNS_KEY = 'bocmarket_returns';

// ============================================
// PRODUCT MANAGEMENT
// ============================================

export const getProducts = async (): Promise<Product[]> => {
  try {
    const products = await AsyncStorage.getItem(PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
};

export const saveProducts = async (products: Product[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    console.log('✅ Productos guardados:', products.length);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar productos:', error);
    return false;
  }
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product[]> => {
  try {
    const products = await getProducts();
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedProducts = [...products, newProduct];
    await saveProducts(updatedProducts);
    return updatedProducts;
  } catch (error) {
    console.error('❌ Error al añadir producto:', error);
    return await getProducts();
  }
};

export const updateProduct = async (productId: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null> => {
  try {
    const products = await getProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      console.error('Producto no encontrado para actualizar');
      return null;
    }

    const updatedProduct: Product = {
      ...products[productIndex],
      ...productData
    };

    const updatedProducts = [...products];
    updatedProducts[productIndex] = updatedProduct;
    
    await saveProducts(updatedProducts);
    console.log('✅ Producto actualizado:', updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    return null;
  }
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const products = await getProducts();
    const filteredProducts = products.filter(p => p.id !== productId);
    
    if (filteredProducts.length === products.length) {
      console.error('Producto no encontrado para eliminar');
      return false;
    }

    await saveProducts(filteredProducts);
    console.log('✅ Producto eliminado:', productId);
    return true;
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    return false;
  }
};

// ============================================
// CART MANAGEMENT
// ============================================

export const getCart = async (): Promise<CartItem[]> => {
  try {
    const cart = await AsyncStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    return [];
  }
};

export const saveCart = async (cart: CartItem[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    await saveAppState({ 
      hasCartItems: cart.length > 0, 
      cartItemsCount: cart.length 
    });
    return true;
  } catch (error) {
    console.error('❌ Error al guardar carrito:', error);
    return false;
  }
};

export const addToCart = async (
  productId: string, 
  quantity: number, 
  variantName?: string | null
): Promise<CartItem[] | null> => {
  try {
    const products = await getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      console.error('Producto no encontrado');
      return null;
    }

    // Check stock availability
    let availableStock = 0;
    if (variantName && product.hasVariants) {
      const variant = product.variants.find(v => v.name === variantName);
      if (!variant) {
        console.error('Variante no encontrada');
        return null;
      }
      availableStock = variant.quantity;
    } else {
      availableStock = product.quantity;
    }

    if (quantity > availableStock) {
      console.error('Stock insuficiente');
      return null;
    }

    const cart = await getCart();
    const cartKey = variantName ? `${productId}_${variantName}` : productId;
    const existingItemIndex = cart.findIndex(item => item.cartItemKey === cartKey);

    if (existingItemIndex >= 0) {
      const newQuantity = cart[existingItemIndex].quantity + quantity;
      if (newQuantity > availableStock) {
        console.error('Stock insuficiente para la cantidad total');
        return null;
      }
      cart[existingItemIndex].quantity = newQuantity;
    } else {
      cart.push({
        cartItemKey: cartKey,
        productId,
        quantity,
        variantName,
      });
    }

    await saveCart(cart);
    return cart;
  } catch (error) {
    console.error('❌ Error al añadir al carrito:', error);
    return null;
  }
};

export const removeFromCart = async (cartItemKey: string): Promise<CartItem[]> => {
  try {
    const cart = await getCart();
    const updatedCart = cart.filter(item => item.cartItemKey !== cartItemKey);
    await saveCart(updatedCart);
    return updatedCart;
  } catch (error) {
    console.error('❌ Error al eliminar del carrito:', error);
    return await getCart();
  }
};

export const clearCart = async (): Promise<CartItem[]> => {
  try {
    await AsyncStorage.removeItem(CART_KEY);
    await saveAppState({ hasCartItems: false, cartItemsCount: 0 });
    console.log('✅ Carrito vaciado completamente');
    return [];
  } catch (error) {
    console.error('❌ Error al vaciar carrito:', error);
    return [];
  }
};

export const updateCartItemQuantity = async (cartItemKey: string, newQuantity: number): Promise<CartItem[] | null> => {
  try {
    if (newQuantity <= 0) {
      return await removeFromCart(cartItemKey);
    }

    const cart = await getCart();
    const itemIndex = cart.findIndex(item => item.cartItemKey === cartItemKey);
    
    if (itemIndex === -1) {
      console.error('Producto no encontrado en el carrito');
      return null;
    }

    cart[itemIndex].quantity = newQuantity;
    await saveCart(cart);
    console.log('✅ Cantidad actualizada en el carrito');
    return cart;
  } catch (error) {
    console.error('❌ Error al actualizar cantidad:', error);
    return null;
  }
};

export const verifyCartEmpty = async (): Promise<{ isEmpty: boolean; cartLength: number }> => {
  try {
    const cart = await getCart();
    const isEmpty = cart.length === 0;
    console.log(`🔍 Verificación del carrito: ${isEmpty ? 'vacío' : 'con productos'} (${cart.length} items)`);
    return {
      isEmpty,
      cartLength: cart.length
    };
  } catch (error) {
    console.error('❌ Error al verificar carrito:', error);
    return {
      isEmpty: true,
      cartLength: 0
    };
  }
};

// ============================================
// PURCHASE PROCESSING
// ============================================

export const processPurchase = async (paymentMethod: 'efectivo' | 'tarjeta' = 'efectivo'): Promise<PurchaseResult> => {
  console.log('🏪 === PROCESANDO COMPRA ===');
  console.log('💳 Método de pago:', paymentMethod);
  
  try {
    const cart = await getCart();
    const products = await getProducts();
    
    console.log('🛒 Carrito cargado:', cart.length, 'items');
    console.log('📦 Productos cargados:', products.length, 'productos');
    
    if (cart.length === 0) {
      console.error('❌ El carrito está vacío');
      throw new Error('El carrito está vacío');
    }
    
    console.log('🔍 Verificando disponibilidad de stock...');
    
    // Verify availability
    for (const cartItem of cart) {
      const product = products.find(p => p.id === cartItem.productId);
      if (!product) {
        console.error(`❌ Producto no encontrado: ${cartItem.productId}`);
        throw new Error(`Producto no encontrado: ${cartItem.productId}`);
      }
      
      console.log(`📋 Verificando: ${product.name} - Cantidad solicitada: ${cartItem.quantity}`);
      
      if (cartItem.variantName) {
        const variant = product.variants?.find(v => v.name === cartItem.variantName);
        if (!variant) {
          console.error(`❌ Variante no encontrada: ${cartItem.variantName}`);
          throw new Error(`Variante no encontrada: ${product.name} - ${cartItem.variantName}`);
        }
        if (variant.quantity < cartItem.quantity) {
          console.error(`❌ Stock insuficiente para variante: ${variant.name}, disponible: ${variant.quantity}, solicitado: ${cartItem.quantity}`);
          throw new Error(`Stock insuficiente para ${product.name} - ${cartItem.variantName}. Disponible: ${variant.quantity}, solicitado: ${cartItem.quantity}`);
        }
        console.log(`✅ Stock OK para ${product.name} - ${variant.name}: ${variant.quantity} >= ${cartItem.quantity}`);
      } else {
        if (product.quantity < cartItem.quantity) {
          console.error(`❌ Stock insuficiente para producto: ${product.name}, disponible: ${product.quantity}, solicitado: ${cartItem.quantity}`);
          throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.quantity}, solicitado: ${cartItem.quantity}`);
        }
        console.log(`✅ Stock OK para ${product.name}: ${product.quantity} >= ${cartItem.quantity}`);
      }
    }
    
    console.log('✅ Verificación de stock completada');
    
    // Create sale record
    const saleId = Date.now().toString();
    const saleDate = new Date();
    
    console.log('📝 Creando registro de venta con ID:', saleId);
    
    const sale: Sale = {
      id: saleId,
      date: saleDate.toISOString(),
      items: cart.map(cartItem => {
        const product = products.find(p => p.id === cartItem.productId)!;
        return {
          productId: cartItem.productId,
          productName: product.name,
          variant: cartItem.variantName || null,
          quantity: cartItem.quantity,
          unitPrice: product.price,
          totalPrice: product.price * cartItem.quantity
        };
      }),
      totalAmount: cart.reduce((total, cartItem) => {
        const product = products.find(p => p.id === cartItem.productId)!;
        return total + (product.price * cartItem.quantity);
      }, 0),
      paymentMethod,
      timestamp: saleDate.getTime()
    };
    
    console.log('💰 Total de la venta:', sale.totalAmount);
    console.log('📦 Items de la venta:', sale.items.length);
    
    // Update inventory
    console.log('📦 Actualizando inventario...');
    
    const updatedProducts = products.map(product => {
      const cartItems = cart.filter(item => item.productId === product.id);
      
      if (cartItems.length > 0) {
        console.log(`🔄 Actualizando stock para: ${product.name}`);
        
        if (product.hasVariants) {
          const updatedVariants = product.variants.map(variant => {
            const variantCartItem = cartItems.find(item => item.variantName === variant.name);
            if (variantCartItem) {
              const newQuantity = variant.quantity - variantCartItem.quantity;
              console.log(`  - ${variant.name}: ${variant.quantity} → ${newQuantity}`);
              return {
                ...variant,
                quantity: newQuantity
              };
            }
            return variant;
          });
          
          const totalQuantity = updatedVariants.reduce((sum, v) => sum + v.quantity, 0);
          return {
            ...product,
            variants: updatedVariants,
            quantity: totalQuantity
          };
        } else {
          const cartItem = cartItems[0];
          const newQuantity = product.quantity - cartItem.quantity;
          console.log(`  - Stock: ${product.quantity} → ${newQuantity}`);
          return {
            ...product,
            quantity: newQuantity
          };
        }
      }
      return product;
    });
    
    console.log('💾 Guardando cambios...');
    
    // Save everything
    const productsSaved = await saveProducts(updatedProducts);
    const saleSaved = await saveSale(sale);
    const emptyCart = await clearCart();
    
    console.log('✅ Productos guardados:', productsSaved);
    console.log('✅ Venta guardada:', saleSaved);
    console.log('✅ Carrito vaciado:', emptyCart.length === 0);
    
    if (!productsSaved || !saleSaved) {
      throw new Error('Error al guardar los datos de la compra');
    }
    
    console.log('🎉 === COMPRA COMPLETADA EXITOSAMENTE ===');
    
    return { 
      success: true, 
      message: 'Compra realizada con éxito', 
      sale, 
      emptyCart: emptyCart.length === 0 
    };
  } catch (error) {
    console.error('❌ === ERROR EN PROCESAMIENTO DE COMPRA ===');
    console.error('❌ Error details:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error desconocido en el procesamiento de la compra'
    };
  }
};

// ============================================
// SALES MANAGEMENT
// ============================================

export const getSales = async (): Promise<Sale[]> => {
  try {
    const sales = await AsyncStorage.getItem(SALES_KEY);
    return sales ? JSON.parse(sales) : [];
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    return [];
  }
};

export const saveSale = async (sale: Sale): Promise<boolean> => {
  try {
    const sales = await getSales();
    const updatedSales = [...sales, sale];
    await AsyncStorage.setItem(SALES_KEY, JSON.stringify(updatedSales));
    console.log('✅ Venta guardada:', sale.id);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar venta:', error);
    return false;
  }
};

// ============================================
// DAILY SALES REPORTS
// ============================================

interface DailySalesReport {
  date: string;
  totalSales: number;
  totalAmount: number; // Alias para compatibilidad
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

export const getDailySalesReport = async (date: string): Promise<DailySalesReport> => {
  try {
    const sales = await getSales();
    const dateStr = date.split('T')[0]; // Get just the date part
    
    const dailySales = sales.filter(sale => {
      const saleDate = sale.date.split('T')[0];
      return saleDate === dateStr;
    });

    const totalAmount = dailySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalItems = dailySales.reduce((sum, sale) => 
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    // Calculate payment methods
    let efectivo = 0;
    let tarjeta = 0;
    
    dailySales.forEach(sale => {
      if (sale.paymentMethod === 'efectivo') {
        efectivo += sale.totalAmount;
      } else if (sale.paymentMethod === 'tarjeta') {
        tarjeta += sale.totalAmount;
      }
    });

    // Calculate top products
    const productStats: { [key: string]: { quantity: number; revenue: number } } = {};
    
    dailySales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productStats[item.productName]) {
          productStats[item.productName] = { quantity: 0, revenue: 0 };
        }
        productStats[item.productName].quantity += item.quantity;
        productStats[item.productName].revenue += item.totalPrice;
      });
    });

    const topProducts = Object.entries(productStats)
      .map(([name, stats]) => ({
        name,
        quantity: stats.quantity,
        revenue: stats.revenue
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      date: dateStr,
      totalSales: dailySales.length,
      totalAmount,
      salesCount: dailySales.length,
      totalItems,
      sales: dailySales,
      paymentMethods: {
        efectivo,
        tarjeta
      },
      topProducts
    };
  } catch (error) {
    console.error('❌ Error al obtener reporte diario:', error);
    return {
      date,
      totalSales: 0,
      totalAmount: 0,
      salesCount: 0,
      totalItems: 0,
      sales: [],
      paymentMethods: {
        efectivo: 0,
        tarjeta: 0
      },
      topProducts: []
    };
  }
};

export const exportDailySalesCSV = async (date: string): Promise<string> => {
  try {
    const report = await getDailySalesReport(date);
    
    let csv = 'Reporte de Ventas Diarias\n';
    csv += `Fecha,${report.date}\n`;
    csv += `Total de Ventas,€${report.totalAmount.toFixed(2)}\n`;
    csv += `Número de Ventas,${report.salesCount}\n`;
    csv += `Total de Productos,${report.totalItems}\n\n`;
    
    csv += 'Detalle de Ventas\n';
    csv += 'Timestamp,Total,Método de Pago,Productos\n';
    
    report.sales.forEach(sale => {
      const products = sale.items.map(item => 
        `${item.productName} x${item.quantity}`
      ).join('; ');
      
      csv += `${sale.date},€${sale.totalAmount.toFixed(2)},${sale.paymentMethod || 'N/A'},"${products}"\n`;
    });
    
    csv += '\nResumen por Método de Pago\n';
    csv += 'Método,Cantidad,Total\n';
    csv += `efectivo,${report.paymentMethods.efectivo > 0 ? 1 : 0},€${report.paymentMethods.efectivo.toFixed(2)}\n`;
    csv += `tarjeta,${report.paymentMethods.tarjeta > 0 ? 1 : 0},€${report.paymentMethods.tarjeta.toFixed(2)}\n`;
    
    return csv;
  } catch (error) {
    console.error('❌ Error al exportar CSV:', error);
    throw error;
  }
};

// ============================================
// APP STATE MANAGEMENT
// ============================================

export const getAppState = async (): Promise<AppState> => {
  try {
    const state = await AsyncStorage.getItem(APP_STATE_KEY);
    return state ? JSON.parse(state) : {};
  } catch (error) {
    console.error('Error al obtener estado de la app:', error);
    return {};
  }
};

export const saveAppState = async (state: Partial<AppState>): Promise<boolean> => {
  try {
    const currentState = await getAppState();
    const newState = { ...currentState, ...state, lastSaved: new Date().toISOString() };
    await AsyncStorage.setItem(APP_STATE_KEY, JSON.stringify(newState));
    return true;
  } catch (error) {
    console.error('❌ Error al guardar estado de la app:', error);
    return false;
  }
};

// ============================================
// EMAIL CONFIGURATION
// ============================================

export const getEmailConfig = async (): Promise<EmailConfig> => {
  try {
    const config = await AsyncStorage.getItem(EMAIL_CONFIG_KEY);
    return config ? JSON.parse(config) : {
      defaultEmail: '',
      enableEmailNotifications: false,
      autoSendReceipts: false,
      emailServiceProvider: 'mailto' as const,
    };
  } catch (error) {
    console.error('Error al obtener configuración de email:', error);
    return {
      defaultEmail: '',
      enableEmailNotifications: false,
      autoSendReceipts: false,
      emailServiceProvider: 'mailto' as const,
    };
  }
};

export const saveEmailConfig = async (config: EmailConfig): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(EMAIL_CONFIG_KEY, JSON.stringify(config));
    console.log('✅ Configuración de email guardada:', config);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar configuración de email:', error);
    return false;
  }
};

// ============================================
// BACKUP AND RESTORE
// ============================================

export const createBackup = async (): Promise<any> => {
  try {
    const [products, sales, appState, emailConfig] = await Promise.all([
      getProducts(),
      getSales(),
      getAppState(),
      getEmailConfig(),
    ]);
    
    const backup = {
      products,
      sales,
      appState,
      emailConfig,
      backupDate: new Date().toISOString(),
      version: '1.0.0',
    };
    
    await AsyncStorage.setItem('bocmarket_backup', JSON.stringify(backup));
    console.log('✅ Backup creado exitosamente');
    return backup;
  } catch (error) {
    console.error('❌ Error al crear backup:', error);
    return null;
  }
};

export const restoreFromBackup = async (backupData: any): Promise<boolean> => {
  try {
    console.log('🔄 Iniciando restauración desde backup...');
    
    // Validar que el backup tiene la estructura correcta
    if (!backupData || typeof backupData !== 'object') {
      throw new Error('Datos de backup inválidos');
    }

    // Restaurar productos si existen
    if (backupData.products && Array.isArray(backupData.products)) {
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(backupData.products));
      console.log('✅ Productos restaurados:', backupData.products.length);
    }

    // Restaurar ventas si existen
    if (backupData.sales && Array.isArray(backupData.sales)) {
      await AsyncStorage.setItem(SALES_KEY, JSON.stringify(backupData.sales));
      console.log('✅ Ventas restauradas:', backupData.sales.length);
    }

    // Restaurar configuración de email si existe
    if (backupData.emailConfig) {
      await AsyncStorage.setItem(EMAIL_CONFIG_KEY, JSON.stringify(backupData.emailConfig));
      console.log('✅ Configuración de email restaurada');
    }

    // Limpiar carrito por seguridad
    await AsyncStorage.removeItem(CART_KEY);

    // Actualizar estado de la app
    await saveAppState({
      lastSaved: new Date().toISOString(),
      hasProducts: backupData.products?.length > 0,
      productsCount: backupData.products?.length || 0,
      hasCartItems: false,
      cartItemsCount: 0
    });

    console.log('✅ Restauración completada exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error restaurando backup:', error);
    return false;
  }
};

export const debugPurchaseFlow = async (): Promise<void> => {
  try {
    console.log('🔍 === DEBUG PURCHASE FLOW ===');
    
    const products = await getProducts();
    const cart = await getCart();
    const sales = await getSales();
    const appState = await getAppState();
    
    console.log('📦 Productos:', products.length);
    console.log('🛒 Carrito:', cart.length);
    console.log('💰 Ventas:', sales.length);
    console.log('📱 Estado app:', appState);
    
    // Verificar integridad de datos
    const issues: string[] = [];
    
    if (products.length === 0) {
      issues.push('No hay productos');
    }
    
    cart.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        issues.push(`Producto en carrito no encontrado: ${item.productId}`);
      }
    });
    
    console.log('⚠️ Problemas encontrados:', issues.length);
    issues.forEach(issue => console.log('  -', issue));
    
    console.log('🔍 === FIN DEBUG ===');
  } catch (error) {
    console.error('❌ Error en debug:', error);
  }
};

export const createDemoData = async (): Promise<boolean> => {
  try {
    console.log('🎭 Creando datos de demostración...');
    
    // Crear productos de demo
    const demoProducts: Product[] = [
      {
        id: `demo_${Date.now()}_1`,
        name: 'Camiseta Banda Demo',
        price: 25.99,
        quantity: 50,
        hasVariants: true,
        variants: [
          { name: 'S', quantity: 10 },
          { name: 'M', quantity: 15 },
          { name: 'L', quantity: 15 },
          { name: 'XL', quantity: 10 }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: `demo_${Date.now()}_2`,
        name: 'CD Último Álbum',
        price: 15.99,
        quantity: 30,
        hasVariants: false,
        variants: [],
        createdAt: new Date().toISOString()
      },
      {
        id: `demo_${Date.now()}_3`,
        name: 'Taza Logo Banda',
        price: 8.50,
        quantity: 25,
        hasVariants: false,
        variants: [],
        createdAt: new Date().toISOString()
      },
      {
        id: `demo_${Date.now()}_4`,
        name: 'Poster Concierto',
        price: 12.00,
        quantity: 40,
        hasVariants: false,
        variants: [],
        createdAt: new Date().toISOString()
      }
    ];

    // Crear ventas de demo
    const demoSales: Sale[] = [
      {
        id: `demo_sale_${Date.now()}_1`,
        date: new Date().toISOString(),
        items: [
          {
            productId: demoProducts[0].id,
            productName: demoProducts[0].name,
            quantity: 2,
            unitPrice: demoProducts[0].price,
            totalPrice: demoProducts[0].price * 2,
            variant: null
          }
        ],
        totalAmount: demoProducts[0].price * 2,
        paymentMethod: 'efectivo',
        timestamp: Date.now()
      },
      {
        id: `demo_sale_${Date.now()}_2`,
        date: new Date().toISOString(),
        items: [
          {
            productId: demoProducts[1].id,
            productName: demoProducts[1].name,
            quantity: 1,
            unitPrice: demoProducts[1].price,
            totalPrice: demoProducts[1].price,
            variant: null
          },
          {
            productId: demoProducts[2].id,
            productName: demoProducts[2].name,
            quantity: 1,
            unitPrice: demoProducts[2].price,
            totalPrice: demoProducts[2].price,
            variant: null
          }
        ],
        totalAmount: demoProducts[1].price + demoProducts[2].price,
        paymentMethod: 'tarjeta',
        timestamp: Date.now()
      }
    ];

    // Guardar datos de demo
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(demoProducts));
    await AsyncStorage.setItem(SALES_KEY, JSON.stringify(demoSales));
    
    // Actualizar estado de la app
    await saveAppState({
      lastSaved: new Date().toISOString(),
      hasProducts: true,
      productsCount: demoProducts.length,
      hasCartItems: false,
      cartItemsCount: 0
    });

    console.log('✅ Datos de demostración creados');
    console.log(`📦 ${demoProducts.length} productos`);
    console.log(`💰 ${demoSales.length} ventas`);
    
    return true;
  } catch (error) {
    console.error('❌ Error creando datos demo:', error);
    return false;
  }
};

// ============================================
// INITIALIZATION
// ============================================

export const initializeDefaultData = async (): Promise<void> => {
  try {
    const existingProducts = await AsyncStorage.getItem(PRODUCTS_KEY);
    if (!existingProducts) {
      const defaultProducts: Product[] = [
        {
          id: Date.now().toString(),
          name: 'Camiseta del Grupo',
          price: 15.99,
          quantity: 25,
          variants: [
            { name: 'Talla S', quantity: 8 },
            { name: 'Talla M', quantity: 10 },
            { name: 'Talla L', quantity: 7 }
          ],
          hasVariants: true,
          createdAt: new Date().toISOString()
        },
        {
          id: (Date.now() + 1).toString(),
          name: 'CD Álbum Debut',
          price: 12.50,
          quantity: 50,
          hasVariants: false,
          variants: [],
          createdAt: new Date().toISOString()
        },
        {
          id: (Date.now() + 2).toString(),
          name: 'Taza Promocional',
          price: 8.99,
          quantity: 15,
          variants: [
            { name: 'Blanca', quantity: 8 },
            { name: 'Negra', quantity: 7 }
          ],
          hasVariants: true,
          createdAt: new Date().toISOString()
        }
      ];
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
      console.log('✅ Datos de ejemplo inicializados');
    }
  } catch (error) {
    console.error('❌ Error al inicializar datos:', error);
  }
};

// ============================================
// EMAIL AND RECEIPT FUNCTIONS
// ============================================

export const sendReceiptByEmail = async (sale: Sale): Promise<EmailResult> => {
  try {
    const emailConfig = await getEmailConfig();
    
    if (!emailConfig.enableEmailNotifications) {
      return {
        success: false,
        message: 'Las notificaciones por email están deshabilitadas'
      };
    }

    if (!emailConfig.defaultEmail) {
      return {
        success: false,
        message: 'No hay email configurado'
      };
    }

    // Generar contenido del recibo
    const receiptContent = generateReceiptText(sale);
    
    // En un entorno real, aquí se enviaría el email
    // Por ahora, simulamos el envío
    console.log('📧 Enviando email a:', emailConfig.defaultEmail);
    console.log('📄 Contenido del recibo:', receiptContent);
    
    // Simular envío exitoso
    return {
      success: true,
      message: `Recibo enviado a ${emailConfig.defaultEmail}`
    };
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const downloadReceiptAsFile = async (sale: Sale): Promise<ApiResponse> => {
  try {
    // Generar contenido del recibo
    const receiptContent = generateReceiptText(sale);
    
    // En un entorno real, aquí se descargaría el archivo
    // Por ahora, simulamos la descarga
    console.log('💾 Descargando recibo...');
    console.log('📄 Contenido del recibo:', receiptContent);
    
    // Simular descarga exitosa
    return {
      success: true,
      message: 'Recibo descargado exitosamente'
    };
  } catch (error) {
    console.error('❌ Error descargando recibo:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

const generateReceiptText = (sale: Sale): string => {
  const date = new Date(sale.date).toLocaleString('es-ES');
  
  let receipt = '=== BOCMARKET - RECIBO ===\n\n';
  receipt += `Fecha: ${date}\n`;
  receipt += `ID Venta: ${sale.id}\n`;
  receipt += `Método de pago: ${sale.paymentMethod === 'efectivo' ? 'Efectivo' : 'Tarjeta'}\n\n`;
  
  receipt += 'PRODUCTOS:\n';
  receipt += '------------------------\n';
  
  sale.items.forEach(item => {
    receipt += `${item.productName}\n`;
    receipt += `  Cantidad: ${item.quantity}\n`;
    receipt += `  Precio unitario: €${item.unitPrice.toFixed(2)}\n`;
    receipt += `  Subtotal: €${item.totalPrice.toFixed(2)}\n\n`;
  });
  
  receipt += '------------------------\n';
  receipt += `TOTAL: €${sale.totalAmount.toFixed(2)}\n`;
  receipt += '========================\n';
  receipt += '\n¡Gracias por tu compra!';
  
  return receipt;
};

// === FUNCIONES DE DEVOLUCIONES ===

export const getReturns = async (): Promise<Return[]> => {
  try {
    const returns = await AsyncStorage.getItem(RETURNS_KEY);
    return returns ? JSON.parse(returns) : [];
  } catch (error) {
    console.error('❌ Error cargando devoluciones:', error);
    return [];
  }
};

export const saveReturns = async (returns: Return[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(RETURNS_KEY, JSON.stringify(returns));
    console.log('✅ Devoluciones guardadas:', returns.length);
    return true;
  } catch (error) {
    console.error('❌ Error guardando devoluciones:', error);
    return false;
  }
};

interface ProcessReturnParams {
  originalSaleId: string;
  items: ReturnItem[];
  reason: string;
}

export const processReturn = async (params: ProcessReturnParams): Promise<ReturnResult> => {
  try {
    console.log('🔄 === PROCESANDO DEVOLUCIÓN ===');
    console.log('📋 Parámetros:', JSON.stringify(params, null, 2));

    const { originalSaleId, items, reason } = params;

    // Validar parámetros
    if (!originalSaleId || !items || items.length === 0 || !reason) {
      return {
        success: false,
        message: 'Parámetros de devolución incompletos'
      };
    }

    // Cargar datos necesarios
    const [products, returns, sales] = await Promise.all([
      getProducts(),
      getReturns(),
      getSales()
    ]);

    // Verificar que la venta original existe
    const originalSale = sales.find(sale => sale.id === originalSaleId);
    if (!originalSale) {
      return {
        success: false,
        message: 'Venta original no encontrada'
      };
    }

    // Validar que los items a devolver pertenecen a la venta original
    for (const returnItem of items) {
      const originalItem = originalSale.items.find(
        item => item.productId === returnItem.productId && 
                item.variant === returnItem.variant
      );
      
      if (!originalItem) {
        return {
          success: false,
          message: `El producto ${returnItem.productName} no pertenece a esta venta`
        };
      }

      if (returnItem.quantity > originalItem.quantity) {
        return {
          success: false,
          message: `Cantidad a devolver mayor que la cantidad original para ${returnItem.productName}`
        };
      }
    }

    // Crear la devolución
    const returnId = Date.now().toString();
    const returnRecord: Return = {
      id: returnId,
      date: new Date().toISOString(),
      items: items,
      totalAmount: items.reduce((total, item) => total + item.totalPrice, 0),
      reason: reason,
      originalSaleId: originalSaleId,
      timestamp: Date.now()
    };

    console.log('📝 Devolución creada:', JSON.stringify(returnRecord, null, 2));

    // Actualizar inventario - devolver productos al stock
    const updatedProducts = [...products];
    
    for (const returnItem of items) {
      const productIndex = updatedProducts.findIndex(p => p.id === returnItem.productId);
      
      if (productIndex === -1) {
        console.warn(`⚠️ Producto no encontrado en inventario: ${returnItem.productId}`);
        continue;
      }

      const product = updatedProducts[productIndex];
      
      if (returnItem.variant && product.hasVariants) {
        // Producto con variantes
        const variantIndex = product.variants.findIndex(v => v.name === returnItem.variant);
        if (variantIndex !== -1) {
          const oldQuantity = product.variants[variantIndex].quantity;
          product.variants[variantIndex].quantity += returnItem.quantity;
          console.log(`🔄 Stock actualizado para ${product.name} - ${returnItem.variant}: ${oldQuantity} → ${product.variants[variantIndex].quantity}`);
        }
      } else {
        // Producto sin variantes
        const oldQuantity = product.quantity;
        product.quantity += returnItem.quantity;
        console.log(`🔄 Stock actualizado para ${product.name}: ${oldQuantity} → ${product.quantity}`);
      }
    }

    // Guardar cambios
    const updatedReturns = [...returns, returnRecord];
    
    const [productsSaved, returnsSaved] = await Promise.all([
      saveProducts(updatedProducts),
      saveReturns(updatedReturns)
    ]);

    if (!productsSaved || !returnsSaved) {
      return {
        success: false,
        message: 'Error guardando los cambios de la devolución'
      };
    }

    console.log('✅ === DEVOLUCIÓN COMPLETADA EXITOSAMENTE ===');
    
    return {
      success: true,
      message: 'Devolución procesada correctamente',
      return: returnRecord,
      updatedProducts: true
    };

  } catch (error) {
    console.error('❌ Error procesando devolución:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};
