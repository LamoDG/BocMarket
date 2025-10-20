import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, globalStyles, borderRadius } from '../../styles/globalStyles';
import { getEmailConfig, saveEmailConfig } from '../../utils/storage';
import { EmailConfig as EmailConfigType } from '../../types';
import { styles } from './styles';

interface EmailConfigProps {
  onConfigSaved?: (config: EmailConfigType) => void;
}

const EmailConfig: React.FC<EmailConfigProps> = ({ onConfigSaved }) => {
  const [config, setConfig] = useState<EmailConfigType>({
    defaultEmail: '',
    enableEmailNotifications: false,
    autoSendReceipts: false,
    emailServiceProvider: 'mailto',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async (): Promise<void> => {
    try {
      const emailConfig = await getEmailConfig();
      setConfig(emailConfig);
    } catch (error) {
      console.error('Error al cargar configuración de email:', error);
      Alert.alert('Error', 'No se pudo cargar la configuración de email');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    try {
      // Validar email si está activado
      if (config.enableEmailNotifications && !config.defaultEmail) {
        Alert.alert('Error', 'Debes configurar un email por defecto si activas las notificaciones');
        setSaving(false);
        return;
      }

      // Validar formato de email
      if (config.defaultEmail && !isValidEmail(config.defaultEmail)) {
        Alert.alert('Error', 'El formato del email no es válido');
        setSaving(false);
        return;
      }

      const success = await saveEmailConfig(config);
      if (success) {
        Alert.alert('✅ Guardado', 'Configuración de email guardada correctamente');
        if (onConfigSaved) {
          onConfigSaved(config);
        }
      } else {
        Alert.alert('Error', 'No se pudo guardar la configuración');
      }
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const testEmail = (): void => {
    if (!config.defaultEmail) {
      Alert.alert('Error', 'Configura un email por defecto primero');
      return;
    }

    if (!isValidEmail(config.defaultEmail)) {
      Alert.alert('Error', 'El formato del email no es válido');
      return;
    }

    const subject = 'Prueba de BocMarket';
    const body = 'Este es un email de prueba desde BocMarket.\n\n¡Tu configuración funciona correctamente!';
    const mailtoLink = `mailto:${config.defaultEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    if (typeof window !== 'undefined') {
      window.open(mailtoLink, '_blank');
    }
    
    Alert.alert('📧 Email de prueba', 'Se ha abierto tu cliente de email con un mensaje de prueba');
  };

  const updateConfig = (updates: Partial<EmailConfigType>): void => {
    setConfig(prevConfig => ({ ...prevConfig, ...updates }));
  };

  if (loading) {
    return (
      <View style={[styles.container, globalStyles.center]}>
        <Text style={styles.loadingText}>Cargando configuración...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>📧 Configuración de Email</Text>
        <Text style={styles.subtitle}>
          Configura el envío automático de tickets por email
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Email por defecto</Text>
        <TextInput
          style={styles.input}
          placeholder="ejemplo@email.com"
          value={config.defaultEmail}
          onChangeText={(text) => updateConfig({ defaultEmail: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.helpText}>
          Email donde se enviarán los tickets de venta automáticamente
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.switchRow}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchLabel}>Activar notificaciones por email</Text>
            <Text style={styles.switchDescription}>
              Permite el envío de tickets por email
            </Text>
          </View>
          <Switch
            value={config.enableEmailNotifications}
            onValueChange={(value) => updateConfig({ enableEmailNotifications: value })}
            trackColor={{ false: colors.lightGray, true: colors.primary }}
            thumbColor={config.enableEmailNotifications ? colors.white : colors.gray}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.switchRow}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchLabel}>Envío automático de tickets</Text>
            <Text style={styles.switchDescription}>
              Envía automáticamente el ticket después de cada venta
            </Text>
          </View>
          <Switch
            value={config.autoSendReceipts}
            onValueChange={(value) => updateConfig({ autoSendReceipts: value })}
            trackColor={{ false: colors.lightGray, true: colors.success }}
            thumbColor={config.autoSendReceipts ? colors.white : colors.gray}
            disabled={!config.enableEmailNotifications}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonSecondary, styles.testButton]}
          onPress={testEmail}
          disabled={!config.defaultEmail || saving}
        >
          <Text style={globalStyles.buttonText}>🧪 Probar Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonSuccess, styles.saveButton]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={globalStyles.buttonText}>
            {saving ? '💾 Guardando...' : '💾 Guardar Configuración'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Información</Text>
        <Text style={styles.infoText}>
          • Los tickets se envían usando tu cliente de email predeterminado{'\n'}
          • Asegúrate de tener un cliente de email configurado en tu dispositivo{'\n'}
          • Puedes enviar tickets manualmente desde cada venta{'\n'}
          • Los emails incluyen todos los detalles de la compra
        </Text>
      </View>
    </ScrollView>
  );
};

export default EmailConfig;
