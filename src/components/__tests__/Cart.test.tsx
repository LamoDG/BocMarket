import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Cart from '../Cart';
import { CartItem as CartItemType, Product } from '../../types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Test Product 1',
    price: 29.99,
    quantity: 10,
    hasVariants: false,
    variants: [],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Test Product 2',
    price: 39.99,
    quantity: 5,
    hasVariants: true,
    variants: [
      { name: 'Small', quantity: 3 },
      { name: 'Large', quantity: 2 }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockCart: CartItemType[] = [
  {
    productId: '1',
    quantity: 2,
    cartItemKey: 'cart-1'
  },
  {
    productId: '2',
    quantity: 1,
    variantName: 'Small',
    cartItemKey: 'cart-2-small'
  }
];

const mockEmptyCart: CartItemType[] = [];

describe('Cart', () => {
  const mockOnUpdateQuantity = jest.fn();
  const mockOnRemove = jest.fn();
  const mockOnCheckout = jest.fn();
  const total = 99.97; // (29.99 * 2) + (39.99 * 1)

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Empty Cart', () => {
    it('renders empty cart message when cart is empty', () => {
      const { getByText } = render(
        <Cart
          cart={mockEmptyCart}
          products={mockProducts}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
          onCheckout={mockOnCheckout}
          total={0}
        />
      );

      expect(getByText('🛒')).toBeTruthy();
      expect(getByText('Carrito vacío')).toBeTruthy();
      expect(getByText('Añade productos desde la tienda para comenzar tu compra')).toBeTruthy();
    });
  });

  describe('Cart with Items', () => {
    it('renders cart header with correct item count', () => {
      const { getByText } = render(
        <Cart
          cart={mockCart}
          products={mockProducts}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
          onCheckout={mockOnCheckout}
          total={total}
        />
      );

      expect(getByText('🛒 Tu Carrito')).toBeTruthy();
      expect(getByText('2 productos')).toBeTruthy();
    });

    it('renders correct total amount', () => {
      const { getByText } = render(
        <Cart
          cart={mockCart}
          products={mockProducts}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
          onCheckout={mockOnCheckout}
          total={total}
        />
      );

      expect(getByText('Total:')).toBeTruthy();
      expect(getByText('€99.97')).toBeTruthy();
    });

    it('renders all cart items', () => {
      const { getByText } = render(
        <Cart
          cart={mockCart}
          products={mockProducts}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
          onCheckout={mockOnCheckout}
          total={total}
        />
      );

      expect(getByText('Test Product 1')).toBeTruthy();
      expect(getByText('Test Product 2')).toBeTruthy();
      expect(getByText('Small')).toBeTruthy(); // Variant name
    });

    it('calls onCheckout when checkout button is pressed', () => {
      const { getByText } = render(
        <Cart
          cart={mockCart}
          products={mockProducts}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
          onCheckout={mockOnCheckout}
          total={total}
        />
      );

      fireEvent.press(getByText('💳 Finalizar Compra'));
      expect(mockOnCheckout).toHaveBeenCalledTimes(1);
    });

    it('handles single item count correctly', () => {
      const singleItemCart = [mockCart[0]]; // Only one item

      const { getByText } = render(
        <Cart
          cart={singleItemCart}
          products={mockProducts}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
          onCheckout={mockOnCheckout}
          total={59.98}
        />
      );

      expect(getByText('1 producto')).toBeTruthy(); // Singular form
    });
  });

  describe('Error Handling', () => {
    it('handles checkout errors gracefully', () => {
      const mockOnCheckoutError = jest.fn(() => {
        throw new Error('Checkout failed');
      });

      // Mock console.error to avoid test output pollution
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock alert
      const alertSpy = jest.spyOn(global, 'alert').mockImplementation();

      const { getByText } = render(
        <Cart
          cart={mockCart}
          products={mockProducts}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
          onCheckout={mockOnCheckoutError}
          total={total}
        />
      );

      fireEvent.press(getByText('💳 Finalizar Compra'));
      
      expect(mockOnCheckoutError).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('❌ Error ejecutando onCheckout:', expect.any(Error));
      expect(alertSpy).toHaveBeenCalledWith('Error: Checkout failed');

      consoleSpy.mockRestore();
      alertSpy.mockRestore();
    });

    it('handles missing onCheckout function', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const alertSpy = jest.spyOn(global, 'alert').mockImplementation();

      const { getByText } = render(
        <Cart
          cart={mockCart}
          products={mockProducts}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
          onCheckout={undefined as any}
          total={total}
        />
      );

      fireEvent.press(getByText('💳 Finalizar Compra'));
      
      expect(consoleSpy).toHaveBeenCalledWith('❌ onCheckout no está definido');
      expect(alertSpy).toHaveBeenCalledWith('Error: onCheckout no está definido');

      consoleSpy.mockRestore();
      alertSpy.mockRestore();
    });

    it('filters out cart items without matching products', () => {
      const cartWithMissingProduct = [
        ...mockCart,
        {
          productId: 'non-existent',
          quantity: 1,
          cartItemKey: 'cart-missing'
        }
      ];

      const { getByText, queryByText } = render(
        <Cart
          cart={cartWithMissingProduct}
          products={mockProducts}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
          onCheckout={mockOnCheckout}
          total={total}
        />
      );

      // Should still show the valid products
      expect(getByText('Test Product 1')).toBeTruthy();
      expect(getByText('Test Product 2')).toBeTruthy();
      
      // Item count should still be 2 (not 3)
      expect(getByText('2 productos')).toBeTruthy();
    });
  });
});
