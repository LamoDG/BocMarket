import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  getProducts,
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  processPurchase,
  verifyCartEmpty,
  getEmailConfig,
} from '../../utils/storage';
import ProductCard from '../../components/ProductCard';
import Cart from '../../components/Cart';
import { showPaymentModal, showConfirmationModal } from './components/PaymentModals';
import { showReceiptOptions, showSuccessWithAutoEmail } from './components/ReceiptHandler';
import { styles } from './styles';
import type { Product, CartItem, PaymentMethod, StoreScreenState } from '../../types';

const StoreScreen: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    await Promise.all([loadProducts(), loadCart()]);
    setLastUpdated(new Date());
  };

  const loadProducts = async (): Promise<void> => {
    try {
      const loadedProducts = await getProducts();
      setProducts(loadedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert(t('common.error'), t('error.loadProducts'));
    }
  };

  const loadCart = async (): Promise<void> => {
    try {
      const loadedCart = await getCart();
      setCart(loadedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const calculateTotal = (): number => {
    return cart.reduce((total, cartItem) => {
      const product = products.find(p => p.id === cartItem.productId);
      if (!product) return total;

      return total + (product.price * cartItem.quantity);
    }, 0);
  };

  const calculateTotalQuantity = (): number => {
    return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
  };

  const handleAddToCart = async (productId: string, variantName?: string): Promise<void> => {
    try {
      const updatedCart = await addToCart(productId, 1, variantName);
      if (updatedCart) {
        setCart(updatedCart);
        // Feedback visual sutil sin modal molesto
        console.log('✅ Producto añadido al carrito');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert(t('common.error'), t('error.addToCart'));
    }
  };

  const handleAddToCartWithQuantity = async (productId: string, quantity: number, variantName?: string): Promise<void> => {
    try {
      const updatedCart = await addToCart(productId, quantity, variantName);
      if (updatedCart) {
        setCart(updatedCart);
        console.log(`✅ ${quantity} producto(s) añadido(s) al carrito`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert(t('common.error'), t('error.addToCart'));
    }
  };

  const handleUpdateCartQuantity = async (cartItemKey: string, newQuantity: number): Promise<void> => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(cartItemKey);
      return;
    }

    const cartItem = cart.find(item => item.cartItemKey === cartItemKey);
    if (!cartItem) return;

    const product = products.find(p => p.id === cartItem.productId);
    if (!product) return;

    let availableStock = 0;

    if (cartItem.variantName && product.hasVariants) {
      const variant = product.variants.find(v => v.name === cartItem.variantName);
      availableStock = variant ? variant.quantity : 0;
    } else {
      availableStock = product.quantity;
    }

    if (newQuantity > availableStock) {
      Alert.alert(
        'Stock insuficiente',
        `Solo hay ${availableStock} unidades disponibles`
      );
      return;
    }

    try {
      const updatedCart = await updateCartItemQuantity(cartItemKey, newQuantity);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      Alert.alert('Error', 'No se pudo actualizar la cantidad');
    }
  };

  const handleRemoveFromCart = async (cartItemKey: string): Promise<void> => {
    try {
      const updatedCart = await removeFromCart(cartItemKey);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      Alert.alert('Error', 'No se pudo eliminar el producto del carrito');
    }
  };

  const handleCartCheckout = async (paymentMethod: PaymentMethod): Promise<void> => {
    console.log('🛒 === CART CHECKOUT INICIADO ===');
    console.log('💳 Método de pago seleccionado:', paymentMethod);
    console.log('📦 Cart length:', cart.length);
    console.log('💰 Total:', calculateTotal());
    
    if (cart.length === 0) {
      Alert.alert('Carrito vacío', 'Añade productos al carrito antes de finalizar la compra');
      return;
    }

    // Verificar stock antes de proceder
    let stockError = false;
    for (const cartItem of cart) {
      const product = products.find(p => p.id === cartItem.productId);
      if (!product) {
        Alert.alert('Error', `Producto no encontrado: ${cartItem.productId}`);
        return;
      }
      
      let availableStock = 0;
      if (cartItem.variantName && product.hasVariants) {
        const variant = product.variants.find(v => v.name === cartItem.variantName);
        availableStock = variant ? variant.quantity : 0;
      } else {
        availableStock = product.quantity;
      }
      
      if (cartItem.quantity > availableStock) {
        Alert.alert(
          'Stock insuficiente', 
          `No hay suficiente stock para ${product.name}${cartItem.variantName ? ` - ${cartItem.variantName}` : ''}.\nDisponible: ${availableStock}, Solicitado: ${cartItem.quantity}`
        );
        stockError = true;
        break;
      }
    }
    
    if (stockError) {
      await loadProducts(); // Recargar productos para actualizar stock
      return;
    }

    // Ir directamente a confirmPurchase ya que el método de pago fue seleccionado
    confirmPurchase(paymentMethod);
  };

  const handleCheckout = async (): Promise<void> => {
    console.log('🛒 === HANDLECHECKOUT INICIADO ===');
    console.log('📦 Cart length:', cart.length);
    console.log('💰 Total:', calculateTotal());
    
    if (cart.length === 0) {
      Alert.alert('Carrito vacío', 'Añade productos al carrito antes de finalizar la compra');
      return;
    }

    // Verificar stock antes de proceder
    let stockError = false;
    for (const cartItem of cart) {
      const product = products.find(p => p.id === cartItem.productId);
      if (!product) {
        Alert.alert('Error', `Producto no encontrado: ${cartItem.productId}`);
        return;
      }
      
      let availableStock = 0;
      if (cartItem.variantName && product.hasVariants) {
        const variant = product.variants.find(v => v.name === cartItem.variantName);
        availableStock = variant ? variant.quantity : 0;
      } else {
        availableStock = product.quantity;
      }
      
      if (cartItem.quantity > availableStock) {
        Alert.alert(
          'Stock insuficiente', 
          `No hay suficiente stock para ${product.name}${cartItem.variantName ? ` - ${cartItem.variantName}` : ''}.\nDisponible: ${availableStock}, Solicitado: ${cartItem.quantity}`
        );
        stockError = true;
        break;
      }
    }
    
    if (stockError) {
      await loadProducts(); // Recargar productos para actualizar stock
      return;
    }

    const total = calculateTotal();
    
    showPaymentModal({
      total,
      onPaymentSelect: (paymentMethod: PaymentMethod) => {
        console.log('✅ Usuario seleccionó:', paymentMethod);
        confirmPurchase(paymentMethod);
      },
      onCancel: () => {
        console.log('❌ Usuario canceló selección de pago');
      }
    });
  };

  const confirmPurchase = async (paymentMethod: PaymentMethod): Promise<void> => {
    console.log('✅ confirmPurchase iniciado con método:', paymentMethod);
    
    const total = calculateTotal();
    
    showConfirmationModal(
      total,
      paymentMethod,
      async () => {
        console.log('🚀 Procesando compra...');
        
        // Mostrar indicador de carga
        Alert.alert('Procesando...', 'Por favor espera mientras procesamos tu compra', [], { cancelable: false });
        
        try {
          console.log('📋 Cart antes de processPurchase:', JSON.stringify(cart, null, 2));
          
          const result = await processPurchase(paymentMethod);
          
          console.log('📊 Resultado de processPurchase:', JSON.stringify(result, null, 2));
          
          if (result.success && result.sale) {
            console.log('✅ Compra exitosa, verificando carrito...');
            
            // Verificar que el carrito se vació correctamente
            const currentCart = await getCart();
            console.log('🛒 Carrito después de compra:', currentCart.length);
            
            if (currentCart.length > 0) {
              console.warn('⚠️ El carrito no se vació completamente');
              // Forzar limpieza del carrito
              await removeFromCart(''); // Esto debería limpiar todo
            }
            
            // Recargar todos los datos después de la compra
            console.log('🔄 Recargando datos...');
            await loadData();
            setShowCart(false);
            
            console.log('✅ Datos recargados, mostrando confirmación de éxito');
            
            // Verificar configuración de email para envío automático
            const emailConfig = await getEmailConfig();
            
            if (emailConfig.autoSendReceipts && 
                emailConfig.enableEmailNotifications && 
                emailConfig.defaultEmail) {
              console.log('📧 Enviando ticket automáticamente por email...');
              showSuccessWithAutoEmail(result.sale, paymentMethod);
            } else {
              console.log('📄 Mostrando opciones de ticket...');
              showReceiptOptions({ sale: result.sale, paymentMethod });
            }
            
          } else {
            console.error('❌ Error en compra:', result.message);
            Alert.alert(
              'Error en la compra', 
              result.message || 'No se pudo completar la compra. Por favor, inténtalo de nuevo.',
              [{ text: 'OK' }]
            );
          }
        } catch (error) {
          console.error('❌ Error procesando compra:', error);
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          Alert.alert(
            'Error', 
            `Ocurrió un error al procesar la compra: ${errorMessage}`,
            [{ text: 'OK' }]
          );
        }
      },
      () => {
        console.log('❌ Usuario canceló confirmación');
      }
    );
  };

  const renderProduct = ({ item }: { item: Product }): React.JSX.Element => {
    const cartQuantity = cart
      .filter(cartItem => cartItem.productId === item.id)
      .reduce((sum, cartItem) => sum + cartItem.quantity, 0);

    return (
      <View style={styles.productItem}>
        <ProductCard
          product={item}
          onEdit={() => {}} // No se edita desde la tienda
          onDelete={() => {}} // No se elimina desde la tienda
          onAddToCart={handleAddToCart}
          onAddToCartWithQuantity={handleAddToCartWithQuantity}
          showAddToCart={true}
          cartQuantity={cartQuantity}
        />
      </View>
    );
  };

  const renderEmptyList = (): React.JSX.Element => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🏪</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('store.empty')}</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        No hay productos disponibles en este momento.{'\n'}
        Añade productos desde la sección de gestión para comenzar a vender.
      </Text>
    </View>
  );

  if (showCart) {
    return (
      <Cart
        cart={cart}
        products={products}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCartCheckout}
        total={calculateTotal()}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>🏪 {t('store.title')}</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => setShowCart(true)}
        >
          <Text style={styles.cartButtonText}>🛒 {t('store.cart')}</Text>
          {calculateTotalQuantity() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{calculateTotalQuantity()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          style={styles.productsList}
          contentContainerStyle={products.length === 0 ? { flex: 1 } : undefined}
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        {lastUpdated && (
          <Text style={styles.lastUpdated}>
            Última actualización: {lastUpdated.toLocaleTimeString()}
          </Text>
        )}
      </View>
    </View>
  );
};

export default StoreScreen;
