import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Navigation from '../Navigation/Navigation';
import type { TabType } from '../../types';

describe('Navigation Component', () => {
  const mockOnTabChange = jest.fn();
  const defaultProps = {
    currentTab: 'products' as TabType,
    onTabChange: mockOnTabChange,
    children: null,
  };

  beforeEach(() => {
    mockOnTabChange.mockClear();
  });

  it('renders all tabs correctly', () => {
    const { getByText } = render(<Navigation {...defaultProps} />);
    
    expect(getByText('Productos')).toBeTruthy();
    expect(getByText('Tienda')).toBeTruthy();
    expect(getByText('Configuración')).toBeTruthy();
  });

  it('highlights the current tab', () => {
    const { getByText } = render(
      <Navigation {...defaultProps} currentTab="store" />
    );
    
    const storeTab = getByText('Tienda').parent?.parent;
    expect(storeTab?.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: expect.stringContaining('20'), // Active tab background
        }),
      ])
    );
  });

  it('calls onTabChange when tab is pressed', () => {
    const { getByText } = render(<Navigation {...defaultProps} />);
    
    fireEvent.press(getByText('Tienda'));
    expect(mockOnTabChange).toHaveBeenCalledWith('store');
  });

  it('renders children in content area', () => {
    const TestChild = () => <></>;
    const { UNSAFE_getByType } = render(
      <Navigation {...defaultProps}>
        <TestChild />
      </Navigation>
    );
    
    expect(UNSAFE_getByType(TestChild)).toBeTruthy();
  });

  it('handles all tab types correctly', () => {
    const tabs: TabType[] = ['products', 'store', 'register'];
    
    tabs.forEach(tab => {
      const { getByText } = render(
        <Navigation {...defaultProps} currentTab={tab} />
      );
      
      fireEvent.press(getByText('Productos'));
      expect(mockOnTabChange).toHaveBeenCalledWith('products');
      
      mockOnTabChange.mockClear();
    });
  });
});
