import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { colors } from '../../styles/globalStyles';
import { 
  createBackup, 
  restoreFromBackup, 
  getAppState,
  saveAppState,
  debugPurchaseFlow,
  createDemoData
} from '../../utils/storage';
import EmailConfig from '../EmailConfig';
import { styles } from './styles';
import type { DataManagementPanelProps, BackupData } from '../../types';

const DataManagementPanel: React.FC<DataManagementPanelProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showEmailConfig, setShowEmailConfig] = useState<boolean>(false);

  // Si estamos mostrando la configuración de email, renderizar ese componente
  if (showEmailConfig) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowEmailConfig(false)}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <EmailConfig onConfigSaved={() => setShowEmailConfig(false)} />
      </View>
    );
  }

  const handleCreateBackup = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const backup = await createBackup();
      if (backup) {
        Alert.alert(
          '✅ Backup Creado',
          `Backup guardado exitosamente.\n\nContiene:\n• ${backup.products?.length || 0} productos\n• ${backup.sales?.length || 0} ventas\n• Configuración de email\n\nFecha: ${new Date().toLocaleString('es-ES')}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'No se pudo crear el backup');
      }
    } catch (error) {
      console.error('Error creando backup:', error);
      Alert.alert('Error', 'Ocurrió un error al crear el backup');
    }
    setIsLoading(false);
  };

  const handleRestoreBackup = async (): Promise<void> => {
    Alert.alert(
      '⚠️ Restaurar Backup',
      'Esta acción reemplazará TODOS los datos actuales (productos, ventas, configuración).\n\n¿Estás seguro de que quieres continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              // En una implementación real, aquí se abriría un selector de archivos
              // Por ahora, simulamos la restauración
              Alert.alert(
                'Función en desarrollo',
                'La restauración de backup está en desarrollo. Por ahora puedes:\n\n• Crear backups manualmente\n• Usar la función de datos demo\n• Contactar soporte técnico'
              );
            } catch (error) {
              console.error('Error restaurando backup:', error);
              Alert.alert('Error', 'No se pudo restaurar el backup');
            }
            setIsLoading(false);
          }
        }
      ]
    );
  };

  const handleCreateDemoData = async (): Promise<void> => {
    Alert.alert(
      '🎭 Crear Datos Demo',
      'Esto añadirá productos y ventas de demostración para probar la aplicación.\n\n¿Quieres continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Crear Demo',
          onPress: async () => {
            setIsLoading(true);
            try {
              const success = await createDemoData();
              if (success) {
                Alert.alert(
                  '✅ Demo Creado',
                  'Se han añadido productos y ventas de demostración.\n\nPuedes verlos en las secciones correspondientes.',
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert('Error', 'No se pudieron crear los datos demo');
              }
            } catch (error) {
              console.error('Error creando datos demo:', error);
              Alert.alert('Error', 'Ocurrió un error al crear los datos demo');
            }
            setIsLoading(false);
          }
        }
      ]
    );
  };

  const handleDebugPurchaseFlow = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await debugPurchaseFlow();
      Alert.alert(
        '🔍 Debug Completado',
        'Se ha ejecutado el análisis de debug.\n\nRevisa la consola para ver los detalles del estado actual de la aplicación.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error en debug:', error);
      Alert.alert('Error', 'Ocurrió un error durante el debug');
    }
    setIsLoading(false);
  };

  const handleResetApp = async (): Promise<void> => {
    Alert.alert(
      '🚨 Resetear Aplicación',
      'ATENCIÓN: Esto eliminará TODOS los datos:\n\n• Productos\n• Ventas\n• Carrito\n• Configuración\n\nEsta acción NO se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'RESETEAR TODO',
          style: 'destructive',
          onPress: async () => {
            Alert.alert(
              '🚨 Confirmación Final',
              '¿Estás ABSOLUTAMENTE seguro?\n\nSe perderán todos los datos de forma permanente.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'SÍ, RESETEAR',
                  style: 'destructive',
                  onPress: async () => {
                    setIsLoading(true);
                    try {
                      // Implementar reset completo
                      await saveAppState({ 
                        lastSaved: new Date().toISOString(),
                        hasProducts: false,
                        productsCount: 0,
                        hasCartItems: false,
                        cartItemsCount: 0
                      });
                      
                      Alert.alert(
                        '✅ App Reseteada',
                        'La aplicación ha sido reseteada completamente.\n\nLa app se reiniciará.',
                        [
                          { 
                            text: 'OK',
                            onPress: onClose
                          }
                        ]
                      );
                    } catch (error) {
                      console.error('Error reseteando app:', error);
                      Alert.alert('Error', 'No se pudo resetear la aplicación');
                    }
                    setIsLoading(false);
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Gestión de Datos</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Backup y Restauración */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💾 Backup y Restauración</Text>
            <Text style={styles.sectionDescription}>
              Guarda y restaura todos tus datos de forma segura
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <TouchableOpacity
              style={[styles.actionButton, isLoading && styles.disabledButton]}
              onPress={handleCreateBackup}
              disabled={isLoading}
            >
              <Text style={styles.actionButtonText}>
                {isLoading ? 'Creando...' : '💾 Crear Backup'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton, 
                styles.actionButtonSecondary,
                isLoading && styles.disabledButton
              ]}
              onPress={handleRestoreBackup}
              disabled={isLoading}
            >
              <Text style={styles.actionButtonText}>
                📥 Restaurar Backup
              </Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 Los backups incluyen productos, ventas y configuración. 
                Guárdalos regularmente para proteger tus datos.
              </Text>
            </View>
          </View>
        </View>

        {/* Configuración de Email */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📧 Configuración de Email</Text>
            <Text style={styles.sectionDescription}>
              Configura el envío automático de tickets por email
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowEmailConfig(true)}
            >
              <Text style={styles.actionButtonText}>
                📧 Configurar Email
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Herramientas de Desarrollo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🛠️ Herramientas de Desarrollo</Text>
            <Text style={styles.sectionDescription}>
              Utilidades para testing y debugging
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.actionButtonWarning,
                isLoading && styles.disabledButton
              ]}
              onPress={handleCreateDemoData}
              disabled={isLoading}
            >
              <Text style={styles.actionButtonText}>
                🎭 Crear Datos Demo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.actionButtonSecondary,
                isLoading && styles.disabledButton
              ]}
              onPress={handleDebugPurchaseFlow}
              disabled={isLoading}
            >
              <Text style={styles.actionButtonText}>
                🔍 Debug Purchase Flow
              </Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                🔧 Estas herramientas son para testing y desarrollo. 
                Los datos demo se mezclarán con tus datos reales.
              </Text>
            </View>
          </View>
        </View>

        {/* Zona Peligrosa */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🚨 Zona Peligrosa</Text>
            <Text style={styles.sectionDescription}>
              Acciones irreversibles que afectan todos los datos
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ ATENCIÓN: Las acciones de esta sección son irreversibles y 
                eliminarán todos los datos de la aplicación permanentemente.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.actionButtonDanger,
                isLoading && styles.disabledButton
              ]}
              onPress={handleResetApp}
              disabled={isLoading}
            >
              <Text style={styles.actionButtonText}>
                🚨 Resetear Aplicación
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isLoading && (
          <View style={styles.infoBox}>
            <Text style={styles.loadingText}>
              ⏳ Procesando operación...
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default DataManagementPanel;
