import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { colors } from '../../styles/globalStyles';
import { getDailySalesReport, exportDailySalesCSV } from '../../utils/storage';
import { StatCard } from './components/StatCard';
import { SaleItem } from './components/SaleItem';
import { TopProducts } from './components/TopProducts';
import { styles } from './styles';
import type { DailyReport } from '../../types';

const DailyCashRegister: React.FC = () => {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
      Alert.alert('Error', 'No se pudo cargar el reporte diario');
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
      <Text style={styles.emptyTitle}>Sin ventas</Text>
      <Text style={styles.emptyText}>
        No hay ventas registradas para esta fecha.{'\n'}
        Las ventas aparecerán aquí en tiempo real.
      </Text>
    </View>
  );

  const renderLoadingState = (): React.JSX.Element => (
    <View style={styles.loadingContainer}>
      <Text style={styles.emptyIcon}>⏳</Text>
      <Text style={styles.loadingText}>Cargando reporte...</Text>
    </View>
  );

  if (loading && !report) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>📊 Caja del Día</Text>
            <Text style={styles.dateText}>
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
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>📊 Caja del Día</Text>
            <Text style={styles.dateText}>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>📊 Caja del Día</Text>
          <Text style={styles.dateText}>
            {new Date(selectedDate).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.exportButton}
          onPress={handleExportCSV}
          disabled={loading}
        >
          <Text style={styles.exportButtonText}>📊 Exportar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estadísticas principales */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Ventas Totales"
            value={report.totalSales.toString()}
            subtitle="transacciones"
            icon="🛒"
            color={colors.primary}
          />
          
          <StatCard
            title="Ingresos Totales"
            value={`€${report.totalAmount.toFixed(2)}`}
            subtitle={`${report.totalItems} artículos`}
            icon="💰"
            color={colors.success}
          />
        </View>

        {/* Métodos de pago */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Efectivo"
            value={`€${report.paymentMethods.efectivo.toFixed(2)}`}
            subtitle={`${((report.paymentMethods.efectivo / report.totalAmount) * 100 || 0).toFixed(1)}%`}
            icon="💵"
            color={colors.warning}
          />
          
          <StatCard
            title="Tarjeta"
            value={`€${report.paymentMethods.tarjeta.toFixed(2)}`}
            subtitle={`${((report.paymentMethods.tarjeta / report.totalAmount) * 100 || 0).toFixed(1)}%`}
            icon="💳"
            color={colors.secondary}
          />
        </View>

        {/* Productos más vendidos */}
        <TopProducts topProducts={report.topProducts} />

        {/* Lista de ventas */}
        {report.sales.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>💰 Ventas del día</Text>
            <View style={styles.salesList}>
              {report.sales.map((sale, index) => (
                <SaleItem key={sale.id || index} sale={sale} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default DailyCashRegister;
