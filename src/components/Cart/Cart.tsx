import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { CartItem as CartItemType, Product, PaymentMethod } from '../../types';
import { CartItem } from './CartItem';
import { showPaymentModal } from '../../screens/StoreScreen/components/PaymentModals';
import { useLanguage } from '../../contexts/LanguageContext';
import { styles } from './styles';

interface CartProps {
  cart: CartItemType[];
  products: Product[];
  onUpdateQuantity: (cartItemKey: string, newQuantity: number) => void;
  onRemove: (cartItemKey: string) => void;
  onCheckout: (paymentMethod: PaymentMethod) => void;
  total: number;
}

interface CartItemWithProduct extends CartItemType {
  product: Product;
}

export const Cart: React.FC<CartProps> = ({ 
  cart, 
  products, 
  onUpdateQuantity, 
  onRemove, 
  onCheckout, 
  total 
}) => {
  const { t } = useLanguage();
  
  const cartWithProducts: CartItemWithProduct[] = cart
    .map(cartItem => ({
      ...cartItem,
      product: products.find(p => p.id === cartItem.productId)!
    }))
    .filter(item => item.product);

  const renderCartItem = ({ item }: { item: CartItemWithProduct }) => (
    <CartItem
      item={item}
      product={item.product}
      onUpdateQuantity={onUpdateQuantity}
      onRemove={onRemove}
    />
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <Text style={styles.emptyCartIcon}>🛒</Text>
      <Text style={styles.emptyCartTitle}>{t('store.cartEmpty')}</Text>
      <Text style={styles.emptyCartText}>
        {t('store.cartEmptyDescription')}
      </Text>
    </View>
  );

  if (cart.length === 0) {
    return renderEmptyCart();
  }

  const handleCheckout = () => {
    console.log('🔘 === BOTÓN PRESIONADO ===');
    console.log('📞 onCheckout exists:', !!onCheckout);
    console.log('📞 onCheckout type:', typeof onCheckout);
    
    if (!onCheckout) {
      console.error('❌ onCheckout no está definido');
      alert('Error: onCheckout no está definido');
      return;
    }

    // Mostrar modal de selección de método de pago
    showPaymentModal({
      total,
      onPaymentSelect: (paymentMethod: PaymentMethod) => {
        console.log('✅ Usuario seleccionó método de pago:', paymentMethod);
        try {
          onCheckout(paymentMethod);
          console.log('✅ onCheckout ejecutado con método:', paymentMethod);
        } catch (error) {
          console.error('❌ Error ejecutando onCheckout:', error);
          if (error instanceof Error) {
            alert('Error: ' + error.message);
          }
        }
      },
      onCancel: () => {
        console.log('❌ Usuario canceló selección de método de pago');
      }
    });
  };

  return (
    <View style={styles.cartContainer}>
      <View style={styles.cartHeader}>
        <Text style={styles.cartTitle}>🛒 {t('store.cartTitle')}</Text>
        <Text style={styles.cartCount}>
          {cart.length} {cart.length !== 1 ? t('store.products') : t('store.product')}
        </Text>
      </View>

      <FlatList
        data={cartWithProducts}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.cartItemKey || item.productId}
        style={styles.cartList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.cartFooter}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>{t('store.total')}:</Text>
          <Text style={styles.totalAmount}>€{total.toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>{t('store.checkoutButton')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
