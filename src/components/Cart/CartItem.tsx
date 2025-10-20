import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CartItem as CartItemType, Product } from '../../types';
import { styles } from './styles';

interface CartItemProps {
  item: CartItemType;
  product: Product;
  onUpdateQuantity: (cartItemKey: string, newQuantity: number) => void;
  onRemove: (cartItemKey: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  product, 
  onUpdateQuantity, 
  onRemove 
}) => {
  if (!product) return null;

  const total = product.price * item.quantity;
  
  // Get available stock for this specific item (variant or regular product)
  let availableStock = 0;
  if (item.variantName && product.hasVariants) {
    const variant = product.variants.find(v => v.name === item.variantName);
    availableStock = variant ? variant.quantity : 0;
  } else {
    availableStock = product.quantity;
  }

  const canDecrease = item.quantity > 1;
  const canIncrease = item.quantity < availableStock;

  return (
    <View style={styles.cartItem}>
      <View style={styles.cartItemHeader}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          {item.variantName && (
            <Text style={styles.variantName}>{item.variantName}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(item.cartItemKey)}
        >
          <Text style={styles.removeButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.productPrice}>€{product.price.toFixed(2)} c/u</Text>
        <Text style={styles.itemTotal}>€{total.toFixed(2)}</Text>
      </View>
      
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Cantidad:</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={[styles.quantityButton, !canDecrease && styles.quantityButtonDisabled]}
            onPress={() => onUpdateQuantity(item.cartItemKey, item.quantity - 1)}
            disabled={!canDecrease}
          >
            <Text style={[
              styles.quantityButtonText, 
              !canDecrease && styles.quantityButtonTextDisabled
            ]}>
              -
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={[styles.quantityButton, !canIncrease && styles.quantityButtonDisabled]}
            onPress={() => onUpdateQuantity(item.cartItemKey, item.quantity + 1)}
            disabled={!canIncrease}
          >
            <Text style={[
              styles.quantityButtonText, 
              !canIncrease && styles.quantityButtonTextDisabled
            ]}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {item.quantity >= availableStock && (
        <Text style={styles.stockWarning}>
          ⚠️ Stock máximo disponible: {availableStock}
        </Text>
      )}
    </View>
  );
};
