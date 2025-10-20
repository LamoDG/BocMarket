import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  ScrollView,
  Switch,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Product, ProductVariant } from '../../../types';
import { styles } from './styles';
import { colors } from '../../../styles/globalStyles';

interface ProductFormProps {
  visible: boolean;
  product?: Product | null;
  onSave: (productData: Partial<Product>) => void;
  onCancel: () => void;
}

interface FormErrors {
  [key: string]: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  visible, 
  product, 
  onSave, 
  onCancel 
}) => {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [hasVariants, setHasVariants] = useState<boolean>(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setPrice(product.price?.toString() || '');
      setQuantity(product.quantity?.toString() || '');
      setHasVariants(product.hasVariants || false);
      setVariants(product.variants || []);
    } else {
      setName('');
      setPrice('');
      setQuantity('');
      setHasVariants(false);
      setVariants([]);
    }
    setErrors({});
  }, [product, visible]);

  const addVariant = () => {
    setVariants([...variants, { name: '', quantity: 0 }]);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    const updatedVariants = variants.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    );
    setVariants(updatedVariants);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    const priceNum = parseFloat(price);
    if (!price.trim() || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'El precio debe ser un número mayor a 0';
    }

    if (!hasVariants) {
      const quantityNum = parseInt(quantity);
      if (!quantity.trim() || isNaN(quantityNum) || quantityNum < 0) {
        newErrors.quantity = 'La cantidad debe ser un número mayor o igual a 0';
      }
    } else {
      if (variants.length === 0) {
        newErrors.variants = 'Debe añadir al menos una variante';
      } else {
        let hasVariantErrors = false;
        variants.forEach((variant, index) => {
          if (!variant.name.trim()) {
            newErrors[`variant_name_${index}`] = 'Nombre de variante obligatorio';
            hasVariantErrors = true;
          }
          if (variant.quantity < 0 || isNaN(variant.quantity)) {
            newErrors[`variant_quantity_${index}`] = 'Cantidad inválida';
            hasVariantErrors = true;
          }
        });
        if (hasVariantErrors) {
          newErrors.variants = 'Revise las variantes';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const productData: Partial<Product> = {
        name: name.trim(),
        price: parseFloat(price),
        hasVariants,
        variants: hasVariants ? variants.map(v => ({
          name: v.name.trim(),
          quantity: parseInt(v.quantity.toString()) || 0
        })) : [],
        quantity: hasVariants ? 
          variants.reduce((sum, v) => sum + (parseInt(v.quantity.toString()) || 0), 0) :
          parseInt(quantity)
      };
      onSave(productData);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {product ? 'Editar Producto' : 'Añadir Producto'}
            </Text>

            <ScrollView 
              style={styles.formScrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.form}>
                <Text style={styles.inputLabel}>Nombre del producto *</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Ej: Camiseta del grupo"
                  value={name}
                  onChangeText={setName}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                <Text style={styles.inputLabel}>Precio (€) *</Text>
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  placeholder="0.00"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

                <View style={styles.switchContainer}>
                  <Text style={styles.inputLabel}>¿Tiene variantes? (tallas, colores, etc.)</Text>
                  <Switch
                    value={hasVariants}
                    onValueChange={setHasVariants}
                    trackColor={{ false: colors.lightGray, true: colors.primary }}
                    thumbColor={hasVariants ? colors.white : colors.gray}
                  />
                </View>

                {!hasVariants ? (
                  <>
                    <Text style={styles.inputLabel}>Cantidad *</Text>
                    <TextInput
                      style={[styles.input, errors.quantity && styles.inputError]}
                      placeholder="0"
                      value={quantity}
                      onChangeText={setQuantity}
                      keyboardType="number-pad"
                    />
                    {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
                  </>
                ) : (
                  <View style={styles.variantsSection}>
                    <View style={styles.variantsHeader}>
                      <Text style={styles.inputLabel}>Variantes</Text>
                      <TouchableOpacity
                        style={styles.addVariantButton}
                        onPress={addVariant}
                      >
                        <Text style={styles.addVariantText}>+ Añadir</Text>
                      </TouchableOpacity>
                    </View>

                    {variants.map((variant, index) => (
                      <View key={index} style={styles.variantContainer}>
                        <View style={styles.variantInputs}>
                          <View style={styles.variantNameContainer}>
                            <Text style={styles.variantLabel}>Nombre</Text>
                            <TextInput
                              style={[
                                styles.variantInput,
                                errors[`variant_name_${index}`] && styles.inputError
                              ]}
                              placeholder="Ej: Talla S"
                              value={variant.name}
                              onChangeText={(value) => updateVariant(index, 'name', value)}
                            />
                            {errors[`variant_name_${index}`] && (
                              <Text style={styles.errorText}>
                                {errors[`variant_name_${index}`]}
                              </Text>
                            )}
                          </View>

                          <View style={styles.variantQuantityContainer}>
                            <Text style={styles.variantLabel}>Cantidad</Text>
                            <TextInput
                              style={[
                                styles.variantInput,
                                errors[`variant_quantity_${index}`] && styles.inputError
                              ]}
                              placeholder="0"
                              value={variant.quantity.toString()}
                              onChangeText={(value) => updateVariant(index, 'quantity', parseInt(value) || 0)}
                              keyboardType="number-pad"
                            />
                            {errors[`variant_quantity_${index}`] && (
                              <Text style={styles.errorText}>
                                {errors[`variant_quantity_${index}`]}
                              </Text>
                            )}
                          </View>
                        </View>

                        <TouchableOpacity
                          style={styles.removeVariantButton}
                          onPress={() => removeVariant(index)}
                        >
                          <Text style={styles.removeVariantText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}

                    {errors.variants && (
                      <Text style={styles.errorText}>{errors.variants}</Text>
                    )}
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  {product ? 'Actualizar' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
