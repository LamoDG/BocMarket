import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getProducts,
  saveProducts,
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  processPurchase,
  getSales,
  getEmailConfig,
  saveEmailConfig,
  updateProduct,
  deleteProduct,
} from '../storage';
import type { Product, CartItem, EmailConfig } from '../../types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('Storage Utils', () => {
  beforeEach(() => {
    AsyncStorage.clear();
  });

  describe('Product Management', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Test Product',
      price: 10.99,
      quantity: 5,
      hasVariants: false,
      variants: [],
      createdAt: new Date().toISOString(),
    };

    it('should save and retrieve products', async () => {
      await saveProducts([mockProduct]);
      const products = await getProducts();
      
      expect(products).toHaveLength(1);
      expect(products[0]).toEqual(mockProduct);
    });

    it('should handle empty products array', async () => {
      const products = await getProducts();
      expect(products).toEqual([]);
    });

    it('should save products with variants', async () => {
      const productWithVariants: Product = {
        ...mockProduct,
        id: '2',
        hasVariants: true,
        variants: [
          { name: 'Small', quantity: 3 },
          { name: 'Large', quantity: 2 },
        ],
        quantity: 5,
      };

      await saveProducts([productWithVariants]);
      const products = await getProducts();
      
      expect(products[0].hasVariants).toBe(true);
      expect(products[0].variants).toHaveLength(2);
      expect(products[0].quantity).toBe(5);
    });
  });

  describe('Cart Management', () => {
    const mockCartItem: CartItem = {
      cartItemKey: 'product_1',
      productId: '1',
      quantity: 2,
      variantName: null,
    };

    beforeEach(async () => {
      // Set up a product for cart tests
      const mockProduct: Product = {
        id: '1',
        name: 'Test Product',
        price: 10.99,
        quantity: 10,
        hasVariants: false,
        variants: [],
        createdAt: new Date().toISOString(),
      };
      await saveProducts([mockProduct]);
    });

    it('should add item to cart', async () => {
      const cart = await addToCart('1', 2);
      
      expect(cart).toHaveLength(1);
      expect(cart[0].productId).toBe('1');
      expect(cart[0].quantity).toBe(2);
    });

    it('should add item with variant to cart', async () => {
      const productWithVariants: Product = {
        id: '2',
        name: 'Variant Product',
        price: 15.99,
        quantity: 8,
        hasVariants: true,
        variants: [{ name: 'Red', quantity: 4 }, { name: 'Blue', quantity: 4 }],
        createdAt: new Date().toISOString(),
      };
      
      await saveProducts([productWithVariants]);
      const cart = await addToCart('2', 1, 'Red');
      
      expect(cart).toHaveLength(1);
      expect(cart[0].cartItemKey).toBe('2_Red');
      expect(cart[0].variantName).toBe('Red');
    });

    it('should update existing cart item quantity', async () => {
      await addToCart('1', 2);
      const cart = await addToCart('1', 3);
      
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(5);
    });

    it('should remove item from cart', async () => {
      await addToCart('1', 2);
      const cartAfterRemoval = await removeFromCart('1');
      
      expect(cartAfterRemoval).toHaveLength(0);
    });

    it('should clear entire cart', async () => {
      await addToCart('1', 2);
      const cart = await getCart();
      expect(cart).toHaveLength(1);
      
      const clearedCart = await clearCart();
      expect(clearedCart).toHaveLength(0);
    });
  });

  describe('Purchase Processing', () => {
    beforeEach(async () => {
      // Set up products and cart for purchase tests
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          price: 10.00,
          quantity: 5,
          hasVariants: false,
          variants: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Product 2',
          price: 20.00,
          quantity: 10,
          hasVariants: true,
          variants: [
            { name: 'Small', quantity: 3 },
            { name: 'Large', quantity: 7 },
          ],
          createdAt: new Date().toISOString(),
        },
      ];
      
      await saveProducts(mockProducts);
      await addToCart('1', 2); // 2 * €10 = €20
      await addToCart('2', 1, 'Small'); // 1 * €20 = €20
    });

    it('should process purchase successfully', async () => {
      const result = await processPurchase('efectivo');
      
      expect(result.success).toBe(true);
      expect(result.sale).toBeDefined();
      expect(result.sale?.totalAmount).toBe(40.00);
      expect(result.sale?.paymentMethod).toBe('efectivo');
      expect(result.sale?.items).toHaveLength(2);
    });

    it('should update inventory after purchase', async () => {
      await processPurchase('efectivo');
      const products = await getProducts();
      
      // Product 1: 5 - 2 = 3
      expect(products.find(p => p.id === '1')?.quantity).toBe(3);
      
      // Product 2: Small variant 3 - 1 = 2, total should be 9
      const product2 = products.find(p => p.id === '2');
      expect(product2?.variants.find(v => v.name === 'Small')?.quantity).toBe(2);
      expect(product2?.quantity).toBe(9);
    });

    it('should clear cart after successful purchase', async () => {
      await processPurchase('efectivo');
      const cart = await getCart();
      
      expect(cart).toHaveLength(0);
    });

    it('should handle insufficient stock', async () => {
      // Clear cart and reset inventory for this test
      await clearCart();
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          price: 10.00,
          quantity: 5, // Only 5 available
          hasVariants: false,
          variants: [],
          createdAt: new Date().toISOString(),
        },
      ];
      await saveProducts(mockProducts);
      
      // Manually add items to cart to bypass addToCart validation
      // This simulates a scenario where stock was reduced after items were added to cart
      const cart: CartItem[] = [
        {
          cartItemKey: '1',
          productId: '1',
          quantity: 10, // More than available stock
        }
      ];
      await AsyncStorage.setItem('bocmarket_cart', JSON.stringify(cart));
      
      const result = await processPurchase('efectivo');
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('Stock insuficiente');
    });

    it('should save sale record', async () => {
      await processPurchase('efectivo');
      const sales = await getSales();
      
      expect(sales).toHaveLength(1);
      expect(sales[0].totalAmount).toBe(40.00);
      expect(sales[0].paymentMethod).toBe('efectivo');
    });
  });

  describe('Email Configuration', () => {
    const mockEmailConfig: EmailConfig = {
      defaultEmail: 'test@example.com',
      enableEmailNotifications: true,
      autoSendReceipts: false,
      emailServiceProvider: 'mailto',
    };

    it('should save and retrieve email config', async () => {
      await saveEmailConfig(mockEmailConfig);
      const config = await getEmailConfig();
      
      expect(config).toEqual(mockEmailConfig);
    });

    it('should return default config when none exists', async () => {
      const config = await getEmailConfig();
      
      expect(config.defaultEmail).toBe('');
      expect(config.enableEmailNotifications).toBe(false);
      expect(config.autoSendReceipts).toBe(false);
      expect(config.emailServiceProvider).toBe('mailto');
    });

    it('should handle email config errors gracefully', async () => {
      // Mock AsyncStorage error
      const originalGetItem = AsyncStorage.getItem;
      AsyncStorage.getItem = jest.fn().mockRejectedValue(new Error('Storage error'));
      
      const config = await getEmailConfig();
      expect(config.defaultEmail).toBe('');
      
      // Restore original function
      AsyncStorage.getItem = originalGetItem;
    });
  });

  describe('Data Validation', () => {
    it('should validate product data structure', async () => {
      const invalidProduct = {
        id: '1',
        name: 'Test',
        // Missing required fields
      };
      
      // This should be handled gracefully by the storage functions
      await saveProducts([invalidProduct as Product]);
      const products = await getProducts();
      
      // Should still save but with default values
      expect(products).toHaveLength(1);
    });

    it('should handle malformed cart data', async () => {
      // Directly set malformed data in storage
      await AsyncStorage.setItem('bocmarket_cart', 'invalid json');
      
      const cart = await getCart();
      expect(cart).toEqual([]); // Should return empty array on error
    });
  });

  describe('Product Update and Delete', () => {
    beforeEach(async () => {
      // Setup some products first
      await saveProducts([
        {
          id: '1',
          name: 'Product 1',
          price: 10.00,
          quantity: 5,
          hasVariants: false,
          variants: [],
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2', 
          name: 'Product 2',
          price: 20.00,
          quantity: 3,
          hasVariants: true,
          variants: [{ name: 'Small', quantity: 2 }, { name: 'Large', quantity: 1 }],
          createdAt: '2024-01-01T00:00:00Z'
        }
      ]);
    });

    it('should update existing product', async () => {
      const updatedProduct = await updateProduct('1', {
        name: 'Updated Product 1',
        price: 15.00
      });

      expect(updatedProduct).not.toBeNull();
      expect(updatedProduct?.name).toBe('Updated Product 1');
      expect(updatedProduct?.price).toBe(15.00);
      expect(updatedProduct?.quantity).toBe(5); // Unchanged
      expect(updatedProduct?.id).toBe('1'); // Unchanged

      const products = await getProducts();
      const product = products.find(p => p.id === '1');
      expect(product?.name).toBe('Updated Product 1');
      expect(product?.price).toBe(15.00);
    });

    it('should return null when updating non-existent product', async () => {
      const result = await updateProduct('non-existent', { name: 'Test' });
      expect(result).toBeNull();
    });

    it('should delete existing product', async () => {
      const result = await deleteProduct('1');
      expect(result).toBe(true);

      const products = await getProducts();
      expect(products).toHaveLength(1);
      expect(products.find(p => p.id === '1')).toBeUndefined();
      expect(products.find(p => p.id === '2')).toBeDefined();
    });

    it('should return false when deleting non-existent product', async () => {
      const result = await deleteProduct('non-existent');
      expect(result).toBe(false);

      const products = await getProducts();
      expect(products).toHaveLength(2); // No products should be deleted
    });
  });
});
