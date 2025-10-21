import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
  Platform,
  Image,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { colors } from '../../styles/globalStyles';
import { getDailySalesReport, exportDailySalesCSV } from '../../utils/storage';
import { StatCard } from './components/StatCard';
import { SaleItem } from './components/SaleItem';
import { TopProducts } from './components/TopProducts';
import { ThemeToggle } from '../ThemeToggle';
import ReturnsScreen from '../../screens/ReturnsScreen';
import { styles } from './styles';
import type { DailyReport } from '../../types';

const DailyCashRegister: React.FC = () => {
  const { colors: themeColors } = useTheme();
  const { t } = useLanguage();
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showReturns, setShowReturns] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    loadDailyReport();
  }, [selectedDate]);

  // Auto-refresh cada 30 segundos para mostrar ventas en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      loadDailyReport();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [selectedDate]);

  const loadDailyReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const dailyReport = await getDailySalesReport(selectedDate);
      setReport(dailyReport);
    } catch (error) {
      console.error('Error al cargar reporte diario:', error);
      Alert.alert(t('common.error'), t('register.loadError'));
    }
    setLoading(false);
  };

  const handleExportCSV = async (): Promise<void> => {
    try {
      setLoading(true);
      const csvData = await exportDailySalesCSV(selectedDate);
      
      if (!csvData) {
        Alert.alert('Sin datos', 'No hay ventas para exportar en esta fecha');
        return;
      }

      if (Platform.OS === 'web') {
        // En web, crear un blob y descargar
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ventas_${selectedDate}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        Alert.alert('Éxito', 'Archivo CSV descargado');
      } else {
        // En móvil, compartir el archivo
        await Share.share({
          message: csvData,
          title: `Reporte de ventas - ${selectedDate}`,
        });
      }
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      Alert.alert('Error', 'No se pudo exportar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const renderEmptyState = (): React.JSX.Element => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📊</Text>
      <Text style={styles.emptyTitle}>{t('register.noSales')}</Text>
      <Text style={styles.emptyText}>
        {t('register.noSalesText')}
      </Text>
    </View>
  );

  const renderLoadingState = (): React.JSX.Element => (
    <View style={styles.loadingContainer}>
      <Text style={styles.emptyIcon}>⏳</Text>
      <Text style={styles.loadingText}>{t('register.loading')}</Text>
    </View>
  );

  if (loading && !report) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={[styles.header, { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: themeColors.text }]}>📊 Caja del Día</Text>
            <Text style={[styles.dateText, { color: themeColors.textSecondary }]}>
              {new Date(selectedDate).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        </View>
        {renderLoadingState()}
      </View>
    );
  }

  if (!report || report.salesCount === 0) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={[styles.header, { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: themeColors.text }]}>📊 Caja del Día</Text>
            <Text style={[styles.dateText, { color: themeColors.textSecondary }]}>
              {new Date(selectedDate).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        </View>
        {renderEmptyState()}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border }]}>
        <View style={styles.headerLeft}>
          <View style={styles.titleContainer}>
            <Image 
              source={require('../../../assets/logoboc.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: themeColors.text }]}>{t('register.title')}</Text>
          </View>
          <Text style={[styles.dateText, { color: themeColors.textSecondary }]}>
            {new Date(selectedDate).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>
      </View>

      <ScrollView style={[styles.content, { backgroundColor: themeColors.background }]} showsVerticalScrollIndicator={false}>
        {/* Estadísticas principales */}
        <View style={styles.statsContainer}>
          <StatCard
            title={t('register.totalSales')}
            value={report.totalSales.toString()}
            subtitle={t('register.transactions')}
            icon="🛒"
            color={themeColors.primary}
          />
          
          <StatCard
            title={t('register.totalRevenue')}
            value={`€${report.totalAmount.toFixed(2)}`}
            subtitle={`${report.totalItems} ${t('register.items')}`}
            icon="💰"
            color={themeColors.success}
          />
        </View>

        {/* Métodos de pago */}
        <View style={styles.statsContainer}>
          <StatCard
            title={t('register.cash')}
            value={`€${report.paymentMethods.efectivo.toFixed(2)}`}
            subtitle={`${((report.paymentMethods.efectivo / report.totalAmount) * 100 || 0).toFixed(1)}%`}
            icon="💵"
            color={themeColors.warning}
          />
          
          <StatCard
            title={t('register.card')}
            value={`€${report.paymentMethods.tarjeta.toFixed(2)}`}
            subtitle={`${((report.paymentMethods.tarjeta / report.totalAmount) * 100 || 0).toFixed(1)}%`}
            icon="💳"
            color={themeColors.secondary}
          />
        </View>

        {/* Productos más vendidos */}
        <TopProducts topProducts={report.topProducts} />

        {/* Lista de ventas */}
        {report.sales.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t('register.sales')}</Text>
            <View style={styles.salesList}>
              {report.sales.map((sale, index) => (
                <SaleItem key={sale.id || index} sale={sale} />
              ))}
            </View>
          </>
        )}

        {/* Configuración de tema */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t('register.configuration')}</Text>
        <View style={{ paddingHorizontal: 16 }}>
          <ThemeToggle />
        </View>
      </ScrollView>

      {/* Barra de acciones fija en la parte inferior */}
      <View style={[styles.bottomActionBar, { backgroundColor: themeColors.surface, borderTopColor: themeColors.border }]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.exportButton, { backgroundColor: themeColors.primary }]}
          onPress={handleExportCSV}
          disabled={loading}
        >
          <Text style={[styles.actionButtonText, { color: themeColors.white }]}>{t('register.export')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.returnsButton, { backgroundColor: themeColors.secondary }]}
          onPress={() => setShowReturns(true)}
        >
          <Text style={[styles.actionButtonText, { color: themeColors.white }]}>{t('register.returns')}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de devoluciones */}
      <ReturnsScreen
        visible={showReturns}
        onClose={() => {
          setShowReturns(false);
          // Recargar el reporte después de cerrar devoluciones
          loadDailyReport();
        }}
      />
    </View>
  );
};

export default DailyCashRegister;
