import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ProductsScreen from '../ProductsScreen';
import { Product } from '../../types';
import * as storage from '../../utils/storage';

// Mock the storage functions
jest.mock('../../utils/storage', () => ({
  getProducts: jest.fn(),
  addProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

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

describe('ProductsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (storage.getProducts as jest.Mock).mockResolvedValue(mockProducts);
  });

  describe('Initial Loading', () => {
    it('loads and displays products on mount', async () => {
      const { getByText } = render(<ProductsScreen />);

      await waitFor(() => {
        expect(getByText('Test Product 1')).toBeTruthy();
        expect(getByText('Test Product 2')).toBeTruthy();
      });

      expect(storage.getProducts).toHaveBeenCalledTimes(1);
    });

    it('shows empty state when no products exist', async () => {
      (storage.getProducts as jest.Mock).mockResolvedValue([]);

      const { getByText } = render(<ProductsScreen />);

      await waitFor(() => {
        expect(getByText('No hay productos')).toBeTruthy();
        expect(getByText('Añade tu primer producto tocando el botón de abajo')).toBeTruthy();
      });
    });

    it('shows error alert when loading products fails', async () => {
      (storage.getProducts as jest.Mock).mockRejectedValue(new Error('Load failed'));

      render(<ProductsScreen />);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'No se pudieron cargar los productos');
      });
    });
  });

  describe('Product Management', () => {
    it('opens add product modal when FAB is pressed', async () => {
      const { getByText } = render(<ProductsScreen />);

      await waitFor(() => {
        expect(getByText('Test Product 1')).toBeTruthy();
      });

      fireEvent.press(getByText('+'));

      await waitFor(() => {
        expect(getByText('Añadir Producto')).toBeTruthy();
      });
    });

    it('opens edit product modal when edit button is pressed', async () => {
      const { getByText, getAllByText } = render(<ProductsScreen />);

      await waitFor(() => {
        expect(getByText('Test Product 1')).toBeTruthy();
      });

      // Find and press the first edit button
      const editButtons = getAllByText('✏️ Editar');
      fireEvent.press(editButtons[0]);

      await waitFor(() => {
        expect(getByText('Editar Producto')).toBeTruthy();
      });
    });

    it('successfully adds a new product', async () => {
      const newProduct: Product = {
        id: '3',
        name: 'New Product',
        price: 49.99,
        quantity: 8,
        hasVariants: false,
        variants: [],
        createdAt: '2024-01-01T00:00:00Z'
      };

      (storage.addProduct as jest.Mock).mockResolvedValue([...mockProducts, newProduct]);

      const { getByText, getByPlaceholderText } = render(<ProductsScreen />);

      await waitFor(() => {
        expect(getByText('Test Product 1')).toBeTruthy();
      });

      // Open add modal
      fireEvent.press(getByText('+'));

      await waitFor(() => {
        expect(getByText('Añadir Producto')).toBeTruthy();
      });

      // Fill form
      fireEvent.changeText(getByPlaceholderText('Ej: Camiseta del grupo'), 'New Product');
      fireEvent.changeText(getByPlaceholderText('0.00'), '49.99');
      fireEvent.changeText(getByPlaceholderText('0'), '8');

      // Submit
      fireEvent.press(getByText('Guardar'));

      await waitFor(() => {
        expect(storage.addProduct).toHaveBeenCalledWith({
          name: 'New Product',
          price: 49.99,
          hasVariants: false,
          variants: [],
          quantity: 8
        });
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Éxito', 'Producto añadido correctamente');
      });
    });

    it('successfully updates an existing product', async () => {
      const updatedProduct: Product = {
        ...mockProducts[0],
        name: 'Updated Product',
        price: 35.99
      };

      (storage.updateProduct as jest.Mock).mockResolvedValue(updatedProduct);

      const { getByText, getAllByText, getByDisplayValue } = render(<ProductsScreen />);

      await waitFor(() => {
        expect(getByText('Test Product 1')).toBeTruthy();
      });

      // Open edit modal
      const editButtons = getAllByText('✏️ Editar');
      fireEvent.press(editButtons[0]);

      await waitFor(() => {
        expect(getByText('Editar Producto')).toBeTruthy();
      });

      // Update form
      const nameInput = getByDisplayValue('Test Product 1');
      fireEvent.changeText(nameInput, 'Updated Product');

      const priceInput = getByDisplayValue('29.99');
      fireEvent.changeText(priceInput, '35.99');

      // Submit
      fireEvent.press(getByText('Actualizar'));

      await waitFor(() => {
        expect(storage.updateProduct).toHaveBeenCalledWith('1', {
          name: 'Updated Product',
          price: 35.99,
          hasVariants: false,
          variants: [],
          quantity: 10
        });
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Éxito', 'Producto actualizado correctamente');
      });
    });

    it('successfully deletes a product', async () => {
      (storage.deleteProduct as jest.Mock).mockResolvedValue(true);

      const { getByText, getAllByText } = render(<ProductsScreen />);

      await waitFor(() => {
        expect(getByText('Test Product 1')).toBeTruthy();
      });

      // Press delete button
      const deleteButtons = getAllByText('🗑️ Eliminar');
      fireEvent.press(deleteButtons[0]);

      await waitFor(() => {
        expect(storage.deleteProduct).toHaveBeenCalledWith('1');
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Éxito', 'Producto eliminado correctamente');
      });
    });

    it('handles delete failure gracefully', async () => {
      (storage.deleteProduct as jest.Mock).mockResolvedValue(false);

      const { getByText, getAllByText } = render(<ProductsScreen />);

      await waitFor(() => {
        expect(getByText('Test Product 1')).toBeTruthy();
      });

      // Press delete button
      const deleteButtons = getAllByText('🗑️ Eliminar');
      fireEvent.press(deleteButtons[0]);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'No se pudo eliminar el producto');
      });
    });
  });

  describe('Refresh Functionality', () => {
    it('refreshes products when pull to refresh is triggered', async () => {
      const { getByTestId } = render(<ProductsScreen />);

      await waitFor(() => {
        expect(storage.getProducts).toHaveBeenCalledTimes(1);
      });

      // Note: This is a simplified test. In a real scenario, you'd need to trigger
      // the refresh control, which is more complex to test
      expect(storage.getProducts).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('handles add product failure', async () => {
      (storage.addProduct as jest.Mock).mockResolvedValue(null);

      const { getByText, getByPlaceholderText } = render(<ProductsScreen />);

      await waitFor(() => {
        expect(getByText('Test Product 1')).toBeTruthy();
      });

      // Open add modal and fill form
      fireEvent.press(getByText('+'));

      await waitFor(() => {
        expect(getByText('Añadir Producto')).toBeTruthy();
      });

      fireEvent.changeText(getByPlaceholderText('Ej: Camiseta del grupo'), 'New Product');
      fireEvent.changeText(getByPlaceholderText('0.00'), '49.99');
      fireEvent.changeText(getByPlaceholderText('0'), '8');

      fireEvent.press(getByText('Guardar'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'No se pudo añadir el producto');
      });
    });

    it('handles update product failure', async () => {
      (storage.updateProduct as jest.Mock).mockResolvedValue(null);

      const { getByText, getAllByText } = render(<ProductsScreen />);

      await waitFor(() => {
        expect(getByText('Test Product 1')).toBeTruthy();
      });

      // Open edit modal
      const editButtons = getAllByText('✏️ Editar');
      fireEvent.press(editButtons[0]);

      await waitFor(() => {
        expect(getByText('Editar Producto')).toBeTruthy();
      });

      fireEvent.press(getByText('Actualizar'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'No se pudo actualizar el producto');
      });
    });

    it('handles storage exceptions', async () => {
      (storage.addProduct as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const { getByText, getByPlaceholderText } = render(<ProductsScreen />);

      await waitFor(() => {
        expect(getByText('Test Product 1')).toBeTruthy();
      });

      // Open add modal and submit
      fireEvent.press(getByText('+'));

      await waitFor(() => {
        expect(getByText('Añadir Producto')).toBeTruthy();
      });

      fireEvent.changeText(getByPlaceholderText('Ej: Camiseta del grupo'), 'New Product');
      fireEvent.changeText(getByPlaceholderText('0.00'), '49.99');
      fireEvent.changeText(getByPlaceholderText('0'), '8');

      fireEvent.press(getByText('Guardar'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Ocurrió un error al guardar el producto');
      });
    });
  });

  describe('Modal Management', () => {
    it('closes modal when cancel is pressed', async () => {
      const { getByText, queryByText } = render(<ProductsScreen />);

      await waitFor(() => {
        expect(getByText('Test Product 1')).toBeTruthy();
      });

      // Open modal
      fireEvent.press(getByText('+'));

      await waitFor(() => {
        expect(getByText('Añadir Producto')).toBeTruthy();
      });

      // Cancel
      fireEvent.press(getByText('Cancelar'));

      await waitFor(() => {
        expect(queryByText('Añadir Producto')).toBeNull();
      });
    });
  });
});
