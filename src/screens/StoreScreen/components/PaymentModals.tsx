import React from 'react';
import { Alert } from 'react-native';
import type { PaymentMethod } from '../../../types';

interface PaymentModalProps {
  total: number;
  onPaymentSelect: (method: PaymentMethod) => void;
  onCancel: () => void;
}

export const showPaymentModal = ({ total, onPaymentSelect, onCancel }: PaymentModalProps): void => {
  console.log('💳 Mostrando selección de método de pago');
  
  Alert.alert(
    'Método de pago',
    `Total: €${total.toFixed(2)}\n\n¿Cómo vas a pagar?`,
    [
      { 
        text: 'Cancelar', 
        style: 'cancel',
        onPress: onCancel
      },
      {
        text: '💰 Efectivo',
        onPress: () => {
          console.log('✅ Usuario seleccionó efectivo');
          onPaymentSelect('efectivo');
        },
      },
      {
        text: '💳 Tarjeta',
        onPress: () => {
          console.log('✅ Usuario seleccionó tarjeta');
          onPaymentSelect('tarjeta');
        },
      },
    ]
  );
};

export const showConfirmationModal = (
  total: number, 
  paymentMethod: PaymentMethod, 
  onConfirm: () => void,
  onCancel: () => void
): void => {
  const paymentMethodText = paymentMethod === 'efectivo' ? 'efectivo' : 'tarjeta';
  
  console.log('🔔 Mostrando diálogo de confirmación');
  
  Alert.alert(
    'Confirmar compra',
    `¿Confirmas la compra por €${total.toFixed(2)} pagando con ${paymentMethodText}?`,
    [
      { 
        text: 'Cancelar', 
        style: 'cancel',
        onPress: onCancel
      },
      {
        text: 'Confirmar',
        onPress: onConfirm,
      },
    ]
  );
};
