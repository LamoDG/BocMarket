import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'ca' | 'es' | 'en';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Traducciones
const translations = {
  ca: {
    // Navigation
    'nav.products': 'Productes',
    'nav.store': 'Botiga',
    'nav.register': 'Caixa',
    'nav.about': 'BOC',
    
    // Products Screen
    'products.title': 'Gestió de Productes',
    'products.empty.title': 'No hi ha productes',
    'products.empty.text': 'Afegeix el teu primer producte tocant el botó de baix',
    'products.add': 'Afegir Producte',
    'products.edit': 'Editar',
    'products.delete': 'Eliminar',
    'products.stock': 'Stock',
    'products.units': 'unitats',
    'products.inCart': 'A la cistella',
    'products.variants': 'Variants disponibles',
    'products.loadError': 'No s\'han pogut carregar els productes',
    
    // Store Screen
    'store.title': 'Botiga',
    'store.cart': 'Cistella',
    'store.addToCart': 'Afegir a la Cistella',
    'store.outOfStock': 'Sense Stock',
    'store.checkout': 'Finalitzar Compra',
    'store.total': 'Total',
    'store.payment': 'Mètode de Pagament',
    'store.cash': 'Efectiu',
    'store.card': 'Targeta',
    'store.emptyCart': 'Cistella buida',
    'store.emptyCartMessage': 'Afegeix productes a la cistella abans de finalitzar la compra',
    'store.addError': 'No s\'ha pogut afegir el producte a la cistella',
    'store.removeError': 'No s\'ha pogut eliminar el producte de la cistella',
    'store.cartTitle': 'La teva Cistella',
    'store.cartEmpty': 'Cistella buida',
    'store.cartEmptyDescription': 'Afegeix productes des de la botiga per començar la teva compra',
    'store.products': 'productes',
    'store.product': 'producte',
    'store.checkoutButton': '💳 Finalitzar Compra',
    'store.empty': 'Botiga buida',
    
    // Error messages
    'error.loadProducts': 'No s\'han pogut carregar els productes',
    'error.addToCart': 'No s\'ha pogut afegir el producte a la cistella',
    
    // Daily Register
    'register.title': 'Caixa del Dia',
    'register.totalSales': 'Vendes Totals',
    'register.transactions': 'transaccions',
    'register.totalRevenue': 'Ingressos Totals',
    'register.items': 'articles',
    'register.cash': 'Efectiu',
    'register.card': 'Targeta',
    'register.topProducts': '🏆 Productes més venuts',
    'register.unitsSold': 'unitats venudes',
    'register.sales': '💰 Vendes del dia',
    'register.export': '📊 Exportar',
    'register.returns': '🔄 Devolucions',
    'register.configuration': '⚙️ Configuració',
    'register.noSales': 'Sense vendes',
    'register.noSalesText': 'No hi ha vendes registrades per aquesta data.\nLes vendes apareixeran aquí en temps real.',
    'register.loading': 'Carregant reporte...',
    'register.loadError': 'No s\'ha pogut carregar el reporte diari',
    
    // About Screen
    'about.title': 'BocMarket',
    'about.subtitle': 'Merchandising BOC',
    'about.project.title': '🎵 Sobre el Projecte',
    'about.project.description1': 'BocMarket és una aplicació gratuïta creada pel grup de música BOC per gestionar de manera eficient el nostre merchandising.',
    'about.project.description2': 'Aquesta eina ens permet controlar l\'inventari, processar vendes i portar un registre detallat de totes les nostres transaccions durant concerts i esdeveniments.',
    'about.boc.title': '🎸 Sobre BOC',
    'about.boc.description': 'BOC és un grup musical compromès amb la creació de música autèntica i la connexió directa amb els nostres fans. Creem les nostres pròpies eines per millorar l\'experiència tant per nosaltres com per al nostre públic.',
    'about.follow': '🔗 Segueix-nos',
    'about.app.title': '📱 Informació de l\'App',
    'about.app.version': 'Versió:',
    'about.app.developedWith': 'Desenvolupat amb:',
    'about.app.license': 'Llicència:',
    'about.app.free': 'Gratuït',
    'about.footer.madeWith': 'Fet amb ❤️ per BOC',
    'about.footer.copyright': '© 2025 BOC - Tots els drets reservats',
    'about.language': '🌐 Idioma',
    
    // Language names
    'language.catalan': 'Català',
    'language.spanish': 'Castellà',
    'language.english': 'Anglès',
    
    // Common
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.cancel': 'Cancel·lar',
    'common.save': 'Guardar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.close': 'Tancar',
    'common.loading': 'Carregant...',
    'common.error': 'Error',
    'common.success': 'Èxit',
    'common.confirm': 'Confirmar',
    
    // Stock status
    'stock.available': 'Disponible',
    'stock.low': 'Stock Baix',
    'stock.out': 'Sense Stock',
  },
  
  es: {
    // Navigation
    'nav.products': 'Productos',
    'nav.store': 'Tienda',
    'nav.register': 'Caja',
    'nav.about': 'BOC',
    
    // Products Screen
    'products.title': 'Gestión de Productos',
    'products.empty.title': 'No hay productos',
    'products.empty.text': 'Añade tu primer producto tocando el botón de abajo',
    'products.add': 'Añadir Producto',
    'products.edit': 'Editar',
    'products.delete': 'Eliminar',
    'products.stock': 'Stock',
    'products.units': 'unidades',
    'products.inCart': 'En carrito',
    'products.variants': 'Variantes disponibles',
    'products.loadError': 'No se pudieron cargar los productos',
    
    // Store Screen
    'store.title': 'Tienda',
    'store.cart': 'Carrito',
    'store.addToCart': 'Añadir al Carrito',
    'store.outOfStock': 'Sin Stock',
    'store.checkout': 'Finalizar Compra',
    'store.total': 'Total',
    'store.payment': 'Método de Pago',
    'store.cash': 'Efectivo',
    'store.card': 'Tarjeta',
    'store.emptyCart': 'Carrito vacío',
    'store.emptyCartMessage': 'Añade productos al carrito antes de finalizar la compra',
    'store.addError': 'No se pudo añadir el producto al carrito',
    'store.removeError': 'No se pudo eliminar el producto del carrito',
    'store.cartTitle': 'Tu Carrito',
    'store.cartEmpty': 'Carrito vacío',
    'store.cartEmptyDescription': 'Añade productos desde la tienda para comenzar tu compra',
    'store.products': 'productos',
    'store.product': 'producto',
    'store.checkoutButton': '💳 Finalizar Compra',
    'store.empty': 'Tienda vacía',
    
    // Error messages
    'error.loadProducts': 'No se pudieron cargar los productos',
    'error.addToCart': 'No se pudo añadir el producto al carrito',
    
    // Daily Register
    'register.title': 'Caja del Día',
    'register.totalSales': 'Ventas Totales',
    'register.transactions': 'transacciones',
    'register.totalRevenue': 'Ingresos Totales',
    'register.items': 'artículos',
    'register.cash': 'Efectivo',
    'register.card': 'Tarjeta',
    'register.topProducts': '🏆 Productos más vendidos',
    'register.unitsSold': 'unidades vendidas',
    'register.sales': '💰 Ventas del día',
    'register.export': '📊 Exportar',
    'register.returns': '🔄 Devoluciones',
    'register.configuration': '⚙️ Configuración',
    'register.noSales': 'Sin ventas',
    'register.noSalesText': 'No hay ventas registradas para esta fecha.\nLas ventas aparecerán aquí en tiempo real.',
    'register.loading': 'Cargando reporte...',
    'register.loadError': 'No se pudo cargar el reporte diario',
    
    // About Screen
    'about.title': 'BocMarket',
    'about.subtitle': 'Merchandising BOC',
    'about.project.title': '🎵 Acerca del Proyecto',
    'about.project.description1': 'BocMarket es una aplicación gratuita creada por el grupo de música BOC para gestionar de manera eficiente nuestro merchandising.',
    'about.project.description2': 'Esta herramienta nos permite controlar el inventario, procesar ventas y llevar un registro detallado de todas nuestras transacciones de merchandising durante conciertos y eventos.',
    'about.boc.title': '🎸 Sobre BOC',
    'about.boc.description': 'BOC es un grupo musical comprometido con la creación de música auténtica y la conexión directa con nuestros fans. Creamos nuestras propias herramientas para mejorar la experiencia tanto para nosotros como para nuestro público.',
    'about.follow': '🔗 Síguenos',
    'about.app.title': '📱 Información de la App',
    'about.app.version': 'Versión:',
    'about.app.developedWith': 'Desarrollado con:',
    'about.app.license': 'Licencia:',
    'about.app.free': 'Gratuito',
    'about.footer.madeWith': 'Hecho con ❤️ por BOC',
    'about.footer.copyright': '© 2025 BOC - Todos los derechos reservados',
    'about.language': '🌐 Idioma',
    
    // Language names
    'language.catalan': 'Catalán',
    'language.spanish': 'Castellano',
    'language.english': 'Inglés',
    
    // Common
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.close': 'Cerrar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.confirm': 'Confirmar',
    
    // Stock status
    'stock.available': 'Disponible',
    'stock.low': 'Stock Bajo',
    'stock.out': 'Sin Stock',
  },
  
  en: {
    // Navigation
    'nav.products': 'Products',
    'nav.store': 'Store',
    'nav.register': 'Register',
    'nav.about': 'BOC',
    
    // Products Screen
    'products.title': 'Product Management',
    'products.empty.title': 'No products',
    'products.empty.text': 'Add your first product by tapping the button below',
    'products.add': 'Add Product',
    'products.edit': 'Edit',
    'products.delete': 'Delete',
    'products.stock': 'Stock',
    'products.units': 'units',
    'products.inCart': 'In cart',
    'products.variants': 'Available variants',
    'products.loadError': 'Could not load products',
    
    // Store Screen
    'store.title': 'Store',
    'store.cart': 'Cart',
    'store.addToCart': 'Add to Cart',
    'store.outOfStock': 'Out of Stock',
    'store.checkout': 'Checkout',
    'store.total': 'Total',
    'store.payment': 'Payment Method',
    'store.cash': 'Cash',
    'store.card': 'Card',
    'store.emptyCart': 'Empty cart',
    'store.emptyCartMessage': 'Add products to cart before checkout',
    'store.addError': 'Could not add product to cart',
    'store.removeError': 'Could not remove product from cart',
    'store.cartTitle': 'Your Cart',
    'store.cartEmpty': 'Empty cart',
    'store.cartEmptyDescription': 'Add products from the store to start your purchase',
    'store.products': 'products',
    'store.product': 'product',
    'store.checkoutButton': '💳 Checkout',
    'store.empty': 'Empty store',
    
    // Error messages
    'error.loadProducts': 'Could not load products',
    'error.addToCart': 'Could not add product to cart',
    
    // Daily Register
    'register.title': 'Daily Register',
    'register.totalSales': 'Total Sales',
    'register.transactions': 'transactions',
    'register.totalRevenue': 'Total Revenue',
    'register.items': 'items',
    'register.cash': 'Cash',
    'register.card': 'Card',
    'register.topProducts': '🏆 Top Products',
    'register.unitsSold': 'units sold',
    'register.sales': '💰 Today\'s Sales',
    'register.export': '📊 Export',
    'register.returns': '🔄 Returns',
    'register.configuration': '⚙️ Configuration',
    'register.noSales': 'No sales',
    'register.noSalesText': 'No sales recorded for this date.\nSales will appear here in real time.',
    'register.loading': 'Loading report...',
    'register.loadError': 'Could not load daily report',
    
    // About Screen
    'about.title': 'BocMarket',
    'about.subtitle': 'BOC Merchandising',
    'about.project.title': '🎵 About the Project',
    'about.project.description1': 'BocMarket is a free application created by the music group BOC to efficiently manage our merchandising.',
    'about.project.description2': 'This tool allows us to control inventory, process sales and keep a detailed record of all our merchandising transactions during concerts and events.',
    'about.boc.title': '🎸 About BOC',
    'about.boc.description': 'BOC is a musical group committed to creating authentic music and direct connection with our fans. We create our own tools to improve the experience for both us and our audience.',
    'about.follow': '🔗 Follow Us',
    'about.app.title': '📱 App Information',
    'about.app.version': 'Version:',
    'about.app.developedWith': 'Developed with:',
    'about.app.license': 'License:',
    'about.app.free': 'Free',
    'about.footer.madeWith': 'Made with ❤️ by BOC',
    'about.footer.copyright': '© 2025 BOC - All rights reserved',
    'about.language': '🌐 Language',
    
    // Language names
    'language.catalan': 'Catalan',
    'language.spanish': 'Spanish',
    'language.english': 'English',
    
    // Common
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    
    // Stock status
    'stock.available': 'Available',
    'stock.low': 'Low Stock',
    'stock.out': 'Out of Stock',
  },
};

const LANGUAGE_STORAGE_KEY = 'bocmarket_language';

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && (savedLanguage === 'ca' || savedLanguage === 'es' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};