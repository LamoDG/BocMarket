import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CartItem } from '../Cart/CartItem';
import { CartItem as CartItemType, Product } from '../../types';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  quantity: 10,
  hasVariants: false,
  variants: [],
  createdAt: '2024-01-01T00:00:00Z'
};

const mockProductWithVariants: Product = {
  id: '2',
  name: 'Variant Product',
  price: 39.99,
  quantity: 15,
  hasVariants: true,
  variants: [
    { name: 'Small', quantity: 5 },
    { name: 'Medium', quantity: 8 },
    { name: 'Large', quantity: 0 }
  ],
  createdAt: '2024-01-01T00:00:00Z'
};

const mockCartItem: CartItemType = {
  productId: '1',
  quantity: 2,
  cartItemKey: 'cart-1'
};

const mockCartItemWithVariant: CartItemType = {
  productId: '2',
  quantity: 1,
  variantName: 'Small',
  cartItemKey: 'cart-2-small'
};

describe('CartItem', () => {
  const mockOnUpdateQuantity = jest.fn();
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders product information correctly', () => {
      const { getByText } = render(
        <CartItem
          item={mockCartItem}
          product={mockProduct}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(getByText('Test Product')).toBeTruthy();
      expect(getByText('€29.99 c/u')).toBeTruthy();
      expect(getByText('€59.98')).toBeTruthy(); // 29.99 * 2
      expect(getByText('2')).toBeTruthy(); // Quantity
    });

    it('renders variant name when present', () => {
      const { getByText } = render(
        <CartItem
          item={mockCartItemWithVariant}
          product={mockProductWithVariants}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(getByText('Variant Product')).toBeTruthy();
      expect(getByText('Small')).toBeTruthy();
    });

    it('returns null when product is null', () => {
      const { toJSON } = render(
        <CartItem
          item={mockCartItem}
          product={null as any}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(toJSON()).toBeNull();
    });
  });

  describe('Quantity Controls', () => {
    it('calls onUpdateQuantity when increase button is pressed', () => {
      const { getByText } = render(
        <CartItem
          item={mockCartItem}
          product={mockProduct}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      const increaseButton = getByText('+');
      fireEvent.press(increaseButton);

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith('cart-1', 3);
    });

    it('calls onUpdateQuantity when decrease button is pressed', () => {
      const { getByText } = render(
        <CartItem
          item={mockCartItem}
          product={mockProduct}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      const decreaseButton = getByText('-');
      fireEvent.press(decreaseButton);

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith('cart-1', 1);
    });

    it('disables decrease button when quantity is 1', () => {
      const singleQuantityItem = { ...mockCartItem, quantity: 1 };

      const { getByText } = render(
        <CartItem
          item={singleQuantityItem}
          product={mockProduct}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      const decreaseButton = getByText('-');
      fireEvent.press(decreaseButton);

      expect(mockOnUpdateQuantity).not.toHaveBeenCalled();
    });

    it('disables increase button when at max stock', () => {
      const maxQuantityItem = { ...mockCartItem, quantity: 10 }; // Max stock is 10

      const { getByText } = render(
        <CartItem
          item={maxQuantityItem}
          product={mockProduct}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      const increaseButton = getByText('+');
      fireEvent.press(increaseButton);

      expect(mockOnUpdateQuantity).not.toHaveBeenCalled();
    });
  });

  describe('Stock Management', () => {
    it('shows stock warning when at maximum quantity', () => {
      const maxQuantityItem = { ...mockCartItem, quantity: 10 };

      const { getByText } = render(
        <CartItem
          item={maxQuantityItem}
          product={mockProduct}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(getByText('⚠️ Stock máximo disponible: 10')).toBeTruthy();
    });

    it('calculates stock correctly for variant products', () => {
      const { getByText } = render(
        <CartItem
          item={mockCartItemWithVariant}
          product={mockProductWithVariants}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      // Small variant has 5 quantity, so increase should work
      const increaseButton = getByText('+');
      fireEvent.press(increaseButton);

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith('cart-2-small', 2);
    });

    it('handles variant with zero stock', () => {
      const zeroStockVariantItem = {
        ...mockCartItemWithVariant,
        variantName: 'Large',
        quantity: 0
      };

      const { getByText } = render(
        <CartItem
          item={zeroStockVariantItem}
          product={mockProductWithVariants}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(getByText('⚠️ Stock máximo disponible: 0')).toBeTruthy();
    });
  });

  describe('Remove Item', () => {
    it('calls onRemove when remove button is pressed', () => {
      const { getByText } = render(
        <CartItem
          item={mockCartItem}
          product={mockProduct}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      const removeButton = getByText('🗑️');
      fireEvent.press(removeButton);

      expect(mockOnRemove).toHaveBeenCalledWith('cart-1');
    });
  });

  describe('Price Calculations', () => {
    it('calculates total price correctly', () => {
      const { getByText } = render(
        <CartItem
          item={mockCartItem}
          product={mockProduct}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(getByText('€59.98')).toBeTruthy(); // 29.99 * 2 = 59.98
    });

    it('updates total when quantity changes', () => {
      const threeQuantityItem = { ...mockCartItem, quantity: 3 };

      const { getByText } = render(
        <CartItem
          item={threeQuantityItem}
          product={mockProduct}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(getByText('€89.97')).toBeTruthy(); // 29.99 * 3 = 89.97
    });
  });

  describe('Edge Cases', () => {
    it('handles missing variant gracefully', () => {
      const invalidVariantItem = {
        ...mockCartItemWithVariant,
        variantName: 'NonExistent'
      };

      const { getByText } = render(
        <CartItem
          item={invalidVariantItem}
          product={mockProductWithVariants}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      // Should show 0 stock warning
      expect(getByText('⚠️ Stock máximo disponible: 0')).toBeTruthy();
    });

    it('handles product without variants but with variant name in cart item', () => {
      const variantNameOnNonVariantProduct = {
        ...mockCartItem,
        variantName: 'SomeVariant'
      };

      const { getByText } = render(
        <CartItem
          item={variantNameOnNonVariantProduct}
          product={mockProduct}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      // Should use regular product stock (10)
      const increaseButton = getByText('+');
      fireEvent.press(increaseButton);

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith('cart-1', 3);
    });
  });
});
