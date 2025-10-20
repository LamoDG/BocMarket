import React from 'react';
import { Alert } from 'react-native';
import { sendReceiptByEmail, downloadReceiptAsFile } from '../../../utils/storage';
import type { Sale, PaymentMethod } from '../../../types';

interface ReceiptOptionsProps {
  sale: Sale;
  paymentMethod: PaymentMethod;
}

export const showReceiptOptions = ({ sale, paymentMethod }: ReceiptOptionsProps): void => {
  const paymentMethodText = paymentMethod === 'efectivo' ? 'Efectivo' : 'Tarjeta';
  
  Alert.alert(
    '✅ ¡Compra realizada!',
    `Pago: ${paymentMethodText}\nTotal: €${sale.totalAmount.toFixed(2)}\n\n¿Quieres obtener el ticket?`,
    [
      { text: 'No, gracias', style: 'cancel' },
      {
        text: '📧 Por email',
        onPress: async () => {
          console.log('📧 Enviando ticket por email...');
          const emailResult = await sendReceiptByEmail(sale);
          
          if (emailResult.success) {
            Alert.alert('Email enviado', 'El ticket ha sido enviado por email');
          } else {
            Alert.alert('Error', emailResult.message || 'No se pudo enviar el email');
          }
        },
      },
      {
        text: '💾 Descargar',
        onPress: async () => {
          console.log('💾 Descargando ticket...');
          const downloadResult = await downloadReceiptAsFile(sale);
          
          if (downloadResult.success) {
            Alert.alert('Descarga completa', 'El ticket ha sido guardado');
          } else {
            Alert.alert('Error', downloadResult.message || 'No se pudo descargar el ticket');
          }
        },
      },
    ]
  );
};

export const showSuccessWithAutoEmail = (sale: Sale, paymentMethod: PaymentMethod): void => {
  const paymentMethodText = paymentMethod === 'efectivo' ? 'Efectivo' : 'Tarjeta';
  
  Alert.alert(
    '✅ ¡Compra realizada!', 
    `Pago: ${paymentMethodText}\nTotal: €${sale.totalAmount.toFixed(2)}\n\n📧 Ticket enviado por email automáticamente`,
    [{ text: 'OK' }]
  );
};
