import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Product } from '../../types';
import { styles } from './styles';
import { colors } from '../../styles/globalStyles';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onAddToCart?: (productId: string, variantName?: string) => void;
  onAddToCartWithQuantity?: (productId: string, quantity: number, variantName?: string) => void;
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
  onAddToCartWithQuantity,
  showActions = false, 
  showAddToCart = false,
  cartQuantity = 0 
}) => {
  const { colors: themeColors } = useTheme();
  const { t } = useLanguage();
  const [showVariants, setShowVariants] = useState<boolean>(false);
  const [variantQuantities, setVariantQuantities] = useState<{[key: string]: number}>({});
  
  // Funciones auxiliares para manejar cantidades por variante
  const getVariantQuantity = (variantName: string): number => {
    return variantQuantities[variantName] || 1;
  };

  const setVariantQuantity = (variantName: string, quantity: number): void => {
    setVariantQuantities(prev => ({
      ...prev,
      [variantName]: quantity
    }));
  };
  
  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 5;

  const getStockStatus = (): StockStatus => {
    if (isOutOfStock) return { text: t('stock.out'), color: colors.danger };
    if (isLowStock) return { text: t('stock.low'), color: colors.warning };
    return { text: t('stock.available'), color: colors.success };
  };

  const stockStatus = getStockStatus();

  const handleAddToCart = () => {
    if (product.hasVariants && product.variants && product.variants.length > 0) {
      setShowVariants(true);
    } else {
      // Para productos sin variantes, usar cantidad fija de 1
      if (onAddToCartWithQuantity) {
        onAddToCartWithQuantity(product.id, 1);
      } else {
        onAddToCart?.(product.id);
      }
    }
  };

  const handleVariantSelect = (variantName: string) => {
    // NO cerrar el modal - permitir añadir múltiples veces
    const quantity = getVariantQuantity(variantName);
    if (onAddToCartWithQuantity) {
      onAddToCartWithQuantity(product.id, quantity, variantName);
    } else {
      onAddToCart?.(product.id, variantName);
    }
  };

  const renderVariantOption = ({ item: variant }: { item: Product['variants'][0] }) => (
    <View style={[
      styles.variantOption,
      { backgroundColor: themeColors.surface, borderColor: themeColors.border },
      variant.quantity === 0 && styles.variantOptionDisabled
    ]}>
      <View style={styles.variantOptionRow}>
        <View style={styles.variantInfo}>
          <Text style={[
            styles.variantOptionText,
            { color: themeColors.text },
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
        
        {variant.quantity > 0 && (
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: themeColors.lightGray }]}
              onPress={() => setVariantQuantity(variant.name, Math.max(1, getVariantQuantity(variant.name) - 1))}
            >
              <Text style={[styles.quantityButtonText, { color: themeColors.text }]}>-</Text>
            </TouchableOpacity>
            
            <Text style={[styles.quantityText, { color: themeColors.text }]}>{getVariantQuantity(variant.name)}</Text>
            
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: themeColors.lightGray }]}
              onPress={() => setVariantQuantity(variant.name, Math.min(variant.quantity, getVariantQuantity(variant.name) + 1))}
            >
              <Text style={[styles.quantityButtonText, { color: themeColors.text }]}>+</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: themeColors.primary }]}
              onPress={() => handleVariantSelect(variant.name)}
            >
              <Text style={[styles.addButtonText, { color: themeColors.white }]}>🛒 Añadir</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.card, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, isOutOfStock && styles.cardOutOfStock]}>
      {/* Header de la tarjeta */}
      <View style={styles.cardHeader}>
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: themeColors.text }]}>{product.name}</Text>
          <Text style={[styles.productPrice, { color: themeColors.primary }]}>€{product.price.toFixed(2)}</Text>
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
        <Text style={[styles.quantityText, { color: themeColors.textSecondary }]}>
          {t('products.stock')}: {product.quantity} {t('products.units')}
        </Text>
        {cartQuantity > 0 && (
          <Text style={[styles.cartQuantityText, { color: themeColors.primary }]}>
            {t('products.inCart')}: {cartQuantity}
          </Text>
        )}
      </View>

      {/* Mostrar variantes si las tiene */}
      {product.hasVariants && product.variants && product.variants.length > 0 && (
        <View style={[styles.variantsContainer, { borderTopColor: themeColors.border }]}>
          <Text style={[styles.variantsTitle, { color: themeColors.text }]}>{t('products.variants')}:</Text>
          {product.variants.map((variant, index) => (
            <View key={index} style={styles.variantItem}>
              <Text style={[styles.variantName, { color: themeColors.text }]}>{variant.name}</Text>
              <Text style={[
                styles.variantStock,
                variant.quantity === 0 ? { color: colors.danger } : 
                variant.quantity <= 2 ? { color: colors.warning } : { color: colors.success }
              ]}>
                {variant.quantity} {t('products.units')}
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
                style={[styles.actionButton, styles.editButton, { backgroundColor: themeColors.warning + '30' }]}
                onPress={() => onEdit?.(product)}
              >
                <Text style={[styles.actionButtonText, { color: themeColors.warning }]}>✏️ {t('products.edit')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton, { backgroundColor: themeColors.danger + '30' }]}
                onPress={() => onDelete?.(product.id)}
              >
                <Text style={[styles.actionButtonText, { color: themeColors.danger }]}>🗑️ {t('products.delete')}</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {showAddToCart && (
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                { backgroundColor: themeColors.success },
                isOutOfStock && [styles.disabledButton, { backgroundColor: themeColors.gray }]
              ]}
              onPress={handleAddToCart}
              disabled={isOutOfStock}
            >
              <Text style={[
                styles.addToCartButtonText,
                { color: themeColors.white },
                isOutOfStock && [styles.disabledButtonText, { color: themeColors.lightGray }]
              ]}>
                {isOutOfStock ? t('store.outOfStock') : `🛒 ${t('store.addToCart')}`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Modal para seleccionar variante */}
      {product.hasVariants && (
        <Modal visible={showVariants} animationType="slide" transparent>
          <View style={[styles.modalOverlay, { backgroundColor: themeColors.overlay }]}>
            <View style={[styles.modalContainer, { backgroundColor: themeColors.modalBackground }]}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>Seleccionar {product.name}</Text>
              
              <FlatList
                data={product.variants || []}
                keyExtractor={(item, index) => `${product.id}-variant-${index}`}
                renderItem={renderVariantOption}
              />
              
              <TouchableOpacity
                style={[styles.modalCancelButton, { backgroundColor: themeColors.lightGray }]}
                onPress={() => setShowVariants(false)}
              >
                <Text style={[styles.modalCancelText, { color: themeColors.text }]}>{t('common.close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};
