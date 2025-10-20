import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProductCard from '../ProductCard';
import { Product } from '../../types';

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

const mockProductOutOfStock: Product = {
  id: '3',
  name: 'Out of Stock Product',
  price: 19.99,
  quantity: 0,
  hasVariants: false,
  variants: [],
  createdAt: '2024-01-01T00:00:00Z'
};

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders product information correctly', () => {
      const { getByText } = render(
        <ProductCard product={mockProduct} />
      );

      expect(getByText('Test Product')).toBeTruthy();
      expect(getByText('€29.99')).toBeTruthy();
      expect(getByText('Stock: 10 unidades')).toBeTruthy();
      expect(getByText('Disponible')).toBeTruthy();
    });

    it('shows cart quantity when provided', () => {
      const { getByText } = render(
        <ProductCard product={mockProduct} cartQuantity={3} />
      );

      expect(getByText('En carrito: 3')).toBeTruthy();
    });

    it('displays stock status correctly for different stock levels', () => {
      // Out of stock
      const { getByText: getByTextOutOfStock } = render(
        <ProductCard product={mockProductOutOfStock} />
      );
      expect(getByTextOutOfStock('Sin Stock')).toBeTruthy();

      // Low stock
      const lowStockProduct = { ...mockProduct, quantity: 3 };
      const { getByText: getByTextLowStock } = render(
        <ProductCard product={lowStockProduct} />
      );
      expect(getByTextLowStock('Stock Bajo')).toBeTruthy();

      // Available
      const { getByText: getByTextAvailable } = render(
        <ProductCard product={mockProduct} />
      );
      expect(getByTextAvailable('Disponible')).toBeTruthy();
    });
  });

  describe('Action Buttons', () => {
    it('shows action buttons when showActions is true', () => {
      const mockOnEdit = jest.fn();
      const mockOnDelete = jest.fn();

      const { getByText } = render(
        <ProductCard 
          product={mockProduct} 
          showActions={true}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(getByText('✏️ Editar')).toBeTruthy();
      expect(getByText('🗑️ Eliminar')).toBeTruthy();
    });

    it('calls onEdit when edit button is pressed', () => {
      const mockOnEdit = jest.fn();

      const { getByText } = render(
        <ProductCard 
          product={mockProduct} 
          showActions={true}
          onEdit={mockOnEdit}
        />
      );

      fireEvent.press(getByText('✏️ Editar'));
      expect(mockOnEdit).toHaveBeenCalledWith(mockProduct);
    });

    it('calls onDelete when delete button is pressed', () => {
      const mockOnDelete = jest.fn();

      const { getByText } = render(
        <ProductCard 
          product={mockProduct} 
          showActions={true}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.press(getByText('🗑️ Eliminar'));
      expect(mockOnDelete).toHaveBeenCalledWith(mockProduct.id);
    });
  });

  describe('Add to Cart', () => {
    it('shows add to cart button when showAddToCart is true', () => {
      const { getByText } = render(
        <ProductCard 
          product={mockProduct} 
          showAddToCart={true}
        />
      );

      expect(getByText('🛒 Añadir al Carrito')).toBeTruthy();
    });

    it('calls onAddToCart for simple products', () => {
      const mockOnAddToCart = jest.fn();

      const { getByText } = render(
        <ProductCard 
          product={mockProduct} 
          showAddToCart={true}
          onAddToCart={mockOnAddToCart}
        />
      );

      fireEvent.press(getByText('🛒 Añadir al Carrito'));
      expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct.id);
    });

    it('shows disabled button for out of stock products', () => {
      const { getByText } = render(
        <ProductCard 
          product={mockProductOutOfStock} 
          showAddToCart={true}
        />
      );

      expect(getByText('Sin Stock')).toBeTruthy();
    });

    it('does not call onAddToCart for out of stock products', () => {
      const mockOnAddToCart = jest.fn();

      const { getByText } = render(
        <ProductCard 
          product={mockProductOutOfStock} 
          showAddToCart={true}
          onAddToCart={mockOnAddToCart}
        />
      );

      fireEvent.press(getByText('Sin Stock'));
      expect(mockOnAddToCart).not.toHaveBeenCalled();
    });
  });

  describe('Product Variants', () => {
    it('displays variants information when product has variants', () => {
      const { getByText } = render(
        <ProductCard product={mockProductWithVariants} />
      );

      expect(getByText('Variantes disponibles:')).toBeTruthy();
      expect(getByText('Small')).toBeTruthy();
      expect(getByText('Medium')).toBeTruthy();
      expect(getByText('Large')).toBeTruthy();
      expect(getByText('5 unidades')).toBeTruthy();
      expect(getByText('8 unidades')).toBeTruthy();
      expect(getByText('0 unidades')).toBeTruthy();
    });

    it('opens variant selection modal when add to cart is pressed for variant product', async () => {
      const mockOnAddToCart = jest.fn();

      const { getByText } = render(
        <ProductCard 
          product={mockProductWithVariants} 
          showAddToCart={true}
          onAddToCart={mockOnAddToCart}
        />
      );

      fireEvent.press(getByText('🛒 Añadir al Carrito'));

      await waitFor(() => {
        expect(getByText('Seleccionar Variant Product')).toBeTruthy();
      });
    });

    it('calls onAddToCart with variant name when variant is selected', async () => {
      const mockOnAddToCart = jest.fn();

      const { getByText } = render(
        <ProductCard 
          product={mockProductWithVariants} 
          showAddToCart={true}
          onAddToCart={mockOnAddToCart}
        />
      );

      // Open variant modal
      fireEvent.press(getByText('🛒 Añadir al Carrito'));

      await waitFor(() => {
        expect(getByText('Seleccionar Variant Product')).toBeTruthy();
      });

      // Select a variant (we need to find the variant option in the modal)
      const variantOptions = getByText('5 disponibles');
      fireEvent.press(variantOptions.parent);

      expect(mockOnAddToCart).toHaveBeenCalledWith(mockProductWithVariants.id, 'Small');
    });

    it('does not allow selection of out of stock variants', async () => {
      const mockOnAddToCart = jest.fn();

      const { getByText } = render(
        <ProductCard 
          product={mockProductWithVariants} 
          showAddToCart={true}
          onAddToCart={mockOnAddToCart}
        />
      );

      // Open variant modal
      fireEvent.press(getByText('🛒 Añadir al Carrito'));

      await waitFor(() => {
        expect(getByText('Seleccionar Variant Product')).toBeTruthy();
      });

      // Try to select out of stock variant (Large)
      const outOfStockVariant = getByText('0 disponibles');
      fireEvent.press(outOfStockVariant.parent);

      expect(mockOnAddToCart).not.toHaveBeenCalled();
    });

    it('closes variant modal when cancel is pressed', async () => {
      const { getByText, queryByText } = render(
        <ProductCard 
          product={mockProductWithVariants} 
          showAddToCart={true}
        />
      );

      // Open variant modal
      fireEvent.press(getByText('🛒 Añadir al Carrito'));

      await waitFor(() => {
        expect(getByText('Seleccionar Variant Product')).toBeTruthy();
      });

      // Cancel
      fireEvent.press(getByText('Cancelar'));

      await waitFor(() => {
        expect(queryByText('Seleccionar Variant Product')).toBeNull();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles product with empty variants array', () => {
      const productWithEmptyVariants = {
        ...mockProduct,
        hasVariants: true,
        variants: []
      };

      const { queryByText } = render(
        <ProductCard product={productWithEmptyVariants} />
      );

      expect(queryByText('Variantes disponibles:')).toBeNull();
    });

    it('handles missing callback functions gracefully', () => {
      const { getByText } = render(
        <ProductCard 
          product={mockProduct} 
          showActions={true}
          showAddToCart={true}
        />
      );

      // Should not throw when pressing buttons without callbacks
      expect(() => {
        fireEvent.press(getByText('✏️ Editar'));
        fireEvent.press(getByText('🗑️ Eliminar'));
        fireEvent.press(getByText('🛒 Añadir al Carrito'));
      }).not.toThrow();
    });
  });
});
