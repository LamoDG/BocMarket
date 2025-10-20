import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Product } from '../../types';
import { styles } from './styles';
import { colors } from '../../styles/globalStyles';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onAddToCart?: (productId: string, variantName?: string) => void;
  showActions?: boolean;
  showAddToCart?: boolean;
  cartQuantity?: number;
}

interface StockStatus {
  text: string;
  color: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onEdit, 
  onDelete, 
  onAddToCart, 
  showActions = false, 
  showAddToCart = false,
  cartQuantity = 0 
}) => {
  const [showVariants, setShowVariants] = useState<boolean>(false);
  
  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 5;

  const getStockStatus = (): StockStatus => {
    if (isOutOfStock) return { text: 'Sin Stock', color: colors.danger };
    if (isLowStock) return { text: 'Stock Bajo', color: colors.warning };
    return { text: 'Disponible', color: colors.success };
  };

  const stockStatus = getStockStatus();

  const handleAddToCart = () => {
    if (product.hasVariants && product.variants && product.variants.length > 0) {
      setShowVariants(true);
    } else {
      onAddToCart?.(product.id);
    }
  };

  const handleVariantSelect = (variantName: string) => {
    setShowVariants(false);
    onAddToCart?.(product.id, variantName);
  };

  const renderVariantOption = ({ item: variant }: { item: Product['variants'][0] }) => (
    <TouchableOpacity
      style={[
        styles.variantOption,
        variant.quantity === 0 && styles.variantOptionDisabled
      ]}
      onPress={() => {
        if (variant.quantity > 0) {
          handleVariantSelect(variant.name);
        }
      }}
      disabled={variant.quantity === 0}
    >
      <View style={styles.variantOptionRow}>
        <Text style={[
          styles.variantOptionText,
          variant.quantity === 0 && styles.variantOptionTextDisabled
        ]}>
          {variant.name}
        </Text>
        <Text style={[
          styles.variantOptionStock,
          variant.quantity === 0 ? { color: colors.danger } :
          variant.quantity <= 2 ? { color: colors.warning } : { color: colors.success }
        ]}>
          {variant.quantity} disponibles
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.card, isOutOfStock && styles.cardOutOfStock]}>
      {/* Header de la tarjeta */}
      <View style={styles.cardHeader}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>€{product.price.toFixed(2)}</Text>
        </View>
        <View style={styles.stockContainer}>
          <View style={[styles.stockBadge, { backgroundColor: stockStatus.color + '20' }]}>
            <Text style={[styles.stockText, { color: stockStatus.color }]}>
              {stockStatus.text}
            </Text>
          </View>
        </View>
      </View>

      {/* Información de cantidad */}
      <View style={styles.quantityRow}>
        <Text style={styles.quantityText}>
          Stock: {product.quantity} unidades
        </Text>
        {cartQuantity > 0 && (
          <Text style={styles.cartQuantityText}>
            En carrito: {cartQuantity}
          </Text>
        )}
      </View>

      {/* Mostrar variantes si las tiene */}
      {product.hasVariants && product.variants && product.variants.length > 0 && (
        <View style={styles.variantsContainer}>
          <Text style={styles.variantsTitle}>Variantes disponibles:</Text>
          {product.variants.map((variant, index) => (
            <View key={index} style={styles.variantItem}>
              <Text style={styles.variantName}>{variant.name}</Text>
              <Text style={[
                styles.variantStock,
                variant.quantity === 0 ? { color: colors.danger } : 
                variant.quantity <= 2 ? { color: colors.warning } : { color: colors.success }
              ]}>
                {variant.quantity} unidades
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Botones de acción */}
      {(showActions || showAddToCart) && (
        <View style={styles.actionsContainer}>
          {showActions && (
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => onEdit?.(product)}
              >
                <Text style={styles.actionButtonText}>✏️ Editar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => onDelete?.(product.id)}
              >
                <Text style={styles.actionButtonText}>🗑️ Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {showAddToCart && (
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                isOutOfStock && styles.disabledButton
              ]}
              onPress={handleAddToCart}
              disabled={isOutOfStock}
            >
              <Text style={[
                styles.addToCartButtonText,
                isOutOfStock && styles.disabledButtonText
              ]}>
                {isOutOfStock ? 'Sin Stock' : '🛒 Añadir al Carrito'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Modal para seleccionar variante */}
      {product.hasVariants && (
        <Modal visible={showVariants} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Seleccionar {product.name}</Text>
              
              <FlatList
                data={product.variants || []}
                keyExtractor={(item, index) => `${product.id}-variant-${index}`}
                renderItem={renderVariantOption}
              />
              
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowVariants(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};
