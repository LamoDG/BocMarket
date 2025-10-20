import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initializeDefaultData,
  getProducts,
  addToCart,
  getCart,
  processPurchase,
  getSales,
  saveEmailConfig,
  getEmailConfig,
} from '../../src/utils/storage';
import type { EmailConfig } from '../../src/types';

describe('E2E Purchase Flow Integration Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await initializeDefaultData();
  });

  it('should complete full purchase workflow', async () => {
    // 1. Initialize app with default data
    const products = await getProducts();
    expect(products.length).toBeGreaterThan(0);

    // 2. Add items to cart
    const product1 = products[0];
    await addToCart(product1.id, 2);
    
    if (products.length > 1) {
      const product2 = products[1];
      if (product2.hasVariants && product2.variants.length > 0) {
        await addToCart(product2.id, 1, product2.variants[0].name);
      } else {
        await addToCart(product2.id, 1);
      }
    }

    // 3. Verify cart contents
    const cart = await getCart();
    expect(cart.length).toBeGreaterThan(0);
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    expect(totalItems).toBeGreaterThanOrEqual(2);

    // 4. Process purchase
    const purchaseResult = await processPurchase('efectivo');
    expect(purchaseResult.success).toBe(true);
    expect(purchaseResult.sale).toBeDefined();

    // 5. Verify inventory was updated
    const updatedProducts = await getProducts();
    const updatedProduct1 = updatedProducts.find(p => p.id === product1.id);
    expect(updatedProduct1!.quantity).toBeLessThan(product1.quantity);

    // 6. Verify cart was cleared
    const emptyCart = await getCart();
    expect(emptyCart).toHaveLength(0);

    // 7. Verify sale was recorded
    const sales = await getSales();
    expect(sales).toHaveLength(1);
    expect(sales[0].id).toBe(purchaseResult.sale!.id);
  });

  it('should handle email configuration workflow', async () => {
    // 1. Check default email config
    const defaultConfig = await getEmailConfig();
    expect(defaultConfig.enableEmailNotifications).toBe(false);

    // 2. Update email configuration
    const newConfig: EmailConfig = {
      defaultEmail: 'test@bocmarket.com',
      enableEmailNotifications: true,
      autoSendReceipts: true,
      emailServiceProvider: 'mailto',
    };

    const saveResult = await saveEmailConfig(newConfig);
    expect(saveResult).toBe(true);

    // 3. Verify configuration was saved
    const savedConfig = await getEmailConfig();
    expect(savedConfig).toEqual(newConfig);

    // 4. Test purchase with email config
    const products = await getProducts();
    await addToCart(products[0].id, 1);
    
    const purchaseResult = await processPurchase('tarjeta');
    expect(purchaseResult.success).toBe(true);
    
    // Email functionality would be tested in actual environment
    // Here we just verify the sale includes payment method
    expect(purchaseResult.sale!.paymentMethod).toBe('tarjeta');
  });

  it('should handle variant products correctly', async () => {
    const products = await getProducts();
    const variantProduct = products.find(p => p.hasVariants && p.variants.length > 0);
    
    if (variantProduct) {
      const variant = variantProduct.variants[0];
      const initialVariantQty = variant.quantity;
      
      // Add variant to cart
      await addToCart(variantProduct.id, 2, variant.name);
      
      const cart = await getCart();
      const cartItem = cart.find(item => 
        item.productId === variantProduct.id && 
        item.variantName === variant.name
      );
      
      expect(cartItem).toBeDefined();
      expect(cartItem!.quantity).toBe(2);
      expect(cartItem!.cartItemKey).toBe(`${variantProduct.id}_${variant.name}`);
      
      // Process purchase
      const result = await processPurchase('efectivo');
      expect(result.success).toBe(true);
      
      // Verify variant inventory was updated
      const updatedProducts = await getProducts();
      const updatedProduct = updatedProducts.find(p => p.id === variantProduct.id);
      const updatedVariant = updatedProduct!.variants.find(v => v.name === variant.name);
      
      expect(updatedVariant!.quantity).toBe(initialVariantQty - 2);
    }
  });

  it('should handle error scenarios gracefully', async () => {
    // Test insufficient stock
    const products = await getProducts();
    const product = products[0];
    
    // Try to add more than available
    const result1 = await addToCart(product.id, product.quantity + 10);
    expect(result1).toBeNull(); // Should fail gracefully
    
    // Test empty cart purchase
    await AsyncStorage.removeItem('bocmarket_cart');
    const purchaseResult = await processPurchase('efectivo');
    expect(purchaseResult.success).toBe(false);
    expect(purchaseResult.message).toContain('carrito está vacío');
  });

  it('should maintain data consistency across operations', async () => {
    const initialProducts = await getProducts();
    const initialTotalQty = initialProducts.reduce((sum, p) => sum + p.quantity, 0);
    
    // Add multiple items to cart
    await addToCart(initialProducts[0].id, 2);
    if (initialProducts.length > 1) {
      await addToCart(initialProducts[1].id, 1);
    }
    
    // Process purchase
    const purchaseResult = await processPurchase('efectivo');
    expect(purchaseResult.success).toBe(true);
    
    // Verify total quantity decreased correctly
    const finalProducts = await getProducts();
    const finalTotalQty = finalProducts.reduce((sum, p) => sum + p.quantity, 0);
    const purchasedQty = purchaseResult.sale!.items.reduce((sum, item) => sum + item.quantity, 0);
    
    expect(finalTotalQty).toBe(initialTotalQty - purchasedQty);
    
    // Verify sale total matches cart total
    const expectedTotal = purchaseResult.sale!.items.reduce((sum, item) => 
      sum + (item.unitPrice * item.quantity), 0
    );
    expect(purchaseResult.sale!.totalAmount).toBe(expectedTotal);
  });
});
