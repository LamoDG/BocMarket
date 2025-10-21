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
import { useTheme } from '../../../contexts/ThemeContext';
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
  const { colors: themeColors } = useTheme();
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [hasVariants, setHasVariants] = useState<boolean>(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    console.log('ProductForm: useEffect triggered', { visible, product });
    if (product) {
      console.log('ProductForm: Setting form data from product:', product);
      setName(product.name || '');
      setPrice(product.price?.toString() || '');
      setQuantity(product.quantity?.toString() || '');
      setHasVariants(product.hasVariants || false);
      setVariants(product.variants || []);
    } else {
      console.log('ProductForm: Resetting form for new product');
      setName('');
      setPrice('');
      setQuantity('');
      setHasVariants(false);
      setVariants([]);
    }
    setErrors({});
    console.log('ProductForm: Form state after useEffect:', { name, price, quantity, hasVariants, variants: variants.length });
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
    console.log('ProductForm: handleSave called');
    console.log('Form data:', {
      name: name.trim(),
      price: parseFloat(price),
      hasVariants,
      variants
    });
    
    if (validateForm()) {
      console.log('ProductForm: Form validation passed');
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
      console.log('ProductForm: Calling onSave with:', productData);
      onSave(productData);
    } else {
      console.log('ProductForm: Form validation failed', errors);
    }
  };

  console.log('ProductForm: Rendering with state:', { visible, name, price, quantity, hasVariants });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={[styles.modalOverlay, { backgroundColor: themeColors.overlay }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={[styles.modalContent, { backgroundColor: themeColors.modalBackground }]}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>
              {product ? 'Editar Producto' : 'Añadir Producto'}
            </Text>

            <ScrollView 
              style={styles.formScrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.form}>
                <Text style={[styles.inputLabel, { color: themeColors.text }]}>Nombre del producto *</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.border },
                    errors.name && styles.inputError
                  ]}
                  placeholder="Ej: Camiseta del grupo"
                  placeholderTextColor={themeColors.textSecondary}
                  value={name}
                  onChangeText={setName}
                />
                {errors.name && <Text style={[styles.errorText, { color: colors.danger }]}>{errors.name}</Text>}

                <Text style={[styles.inputLabel, { color: themeColors.text }]}>Precio (€) *</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.border },
                    errors.price && styles.inputError
                  ]}
                  placeholder="0.00"
                  placeholderTextColor={themeColors.textSecondary}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
                {errors.price && <Text style={[styles.errorText, { color: colors.danger }]}>{errors.price}</Text>}

                <View style={[styles.switchContainer, { backgroundColor: themeColors.surface }]}>
                  <Text style={[styles.inputLabel, { color: themeColors.text }]}>Añadir variantes</Text>
                  <Switch
                    value={hasVariants}
                    onValueChange={setHasVariants}
                    trackColor={{ false: themeColors.lightGray, true: themeColors.primary }}
                    thumbColor={hasVariants ? themeColors.white : themeColors.gray}
                  />
                </View>

                {!hasVariants ? (
                  <>
                    <Text style={[styles.inputLabel, { color: themeColors.text }]}>Cantidad *</Text>
                    <TextInput
                      style={[
                        styles.input, 
                        { backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.border },
                        errors.quantity && styles.inputError
                      ]}
                      placeholder="0"
                      placeholderTextColor={themeColors.textSecondary}
                      value={quantity}
                      onChangeText={setQuantity}
                      keyboardType="number-pad"
                    />
                    {errors.quantity && <Text style={[styles.errorText, { color: colors.danger }]}>{errors.quantity}</Text>}
                  </>
                ) : (
                  <View style={styles.variantsSection}>
                    <View style={styles.variantsHeader}>
                      <Text style={[styles.inputLabel, { color: themeColors.text }]}>Variantes</Text>
                      <TouchableOpacity
                        style={[styles.addVariantButton, { backgroundColor: themeColors.success }]}
                        onPress={addVariant}
                      >
                        <Text style={[styles.addVariantText, { color: themeColors.white }]}>+ Añadir</Text>
                      </TouchableOpacity>
                    </View>

                    {variants.map((variant, index) => (
                      <View key={index} style={[styles.variantContainer, { backgroundColor: themeColors.surface }]}>
                        <View style={styles.variantInputs}>
                          <View style={styles.variantNameContainer}>
                            <Text style={[styles.variantLabel, { color: themeColors.text }]}>Nombre</Text>
                            <TextInput
                              style={[
                                styles.variantInput,
                                { backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.border },
                                errors[`variant_name_${index}`] && styles.inputError
                              ]}
                              placeholder="Ej: Talla S"
                              placeholderTextColor={themeColors.textSecondary}
                              value={variant.name}
                              onChangeText={(value) => updateVariant(index, 'name', value)}
                            />
                            {errors[`variant_name_${index}`] && (
                              <Text style={[styles.errorText, { color: colors.danger }]}>
                                {errors[`variant_name_${index}`]}
                              </Text>
                            )}
                          </View>

                          <View style={styles.variantQuantityContainer}>
                            <Text style={[styles.variantLabel, { color: themeColors.text }]}>Cantidad</Text>
                            <TextInput
                              style={[
                                styles.variantInput,
                                { backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.border },
                                errors[`variant_quantity_${index}`] && styles.inputError
                              ]}
                              placeholder="0"
                              placeholderTextColor={themeColors.textSecondary}
                              value={variant.quantity.toString()}
                              onChangeText={(value) => updateVariant(index, 'quantity', parseInt(value) || 0)}
                              keyboardType="number-pad"
                            />
                            {errors[`variant_quantity_${index}`] && (
                              <Text style={[styles.errorText, { color: colors.danger }]}>
                                {errors[`variant_quantity_${index}`]}
                              </Text>
                            )}
                          </View>
                        </View>

                        <TouchableOpacity
                          style={[styles.removeVariantButton, { backgroundColor: themeColors.danger }]}
                          onPress={() => removeVariant(index)}
                        >
                          <Text style={[styles.removeVariantText, { color: themeColors.white }]}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}

                    {errors.variants && (
                      <Text style={[styles.errorText, { color: colors.danger }]}>{errors.variants}</Text>
                    )}
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={[styles.modalButtons, { borderTopColor: themeColors.border }]}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { backgroundColor: themeColors.lightGray }]}
                onPress={onCancel}
              >
                <Text style={[styles.cancelButtonText, { color: themeColors.text }]}>Cerrar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton, { backgroundColor: themeColors.primary }]}
                onPress={handleSave}
              >
                <Text style={[styles.saveButtonText, { color: themeColors.white }]}>
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
