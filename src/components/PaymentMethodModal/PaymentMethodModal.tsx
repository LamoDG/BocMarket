import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { PaymentMethod } from '../../types';
import { styles } from './styles';

interface PaymentMethodModalProps {
  visible: boolean;
  total: number;
  onPaymentSelect: (method: PaymentMethod) => void;
  onCancel: () => void;
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  visible,
  total,
  onPaymentSelect,
  onCancel,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Método de pago</Text>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.totalText}>Total: €{total.toFixed(2)}</Text>
            <Text style={styles.questionText}>¿Cómo vas a pagar?</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.paymentButton, styles.cashButton]}
                onPress={() => {
                  console.log('✅ Usuario seleccionó efectivo');
                  onPaymentSelect('efectivo');
                }}
              >
                <Text style={styles.buttonIcon}>💰</Text>
                <Text style={styles.buttonText}>Efectivo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.paymentButton, styles.cardButton]}
                onPress={() => {
                  console.log('✅ Usuario seleccionó tarjeta');
                  onPaymentSelect('tarjeta');
                }}
              >
                <Text style={styles.buttonIcon}>💳</Text>
                <Text style={styles.buttonText}>Tarjeta</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};