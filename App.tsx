import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppState as RNAppState, Alert, View, Text } from 'react-native';
import Navigation from './src/components/Navigation';
import ProductsScreen from './src/screens/ProductsScreen';
import StoreScreen from './src/screens/StoreScreen';
import DailyCashRegister from './src/components/DailyCashRegister';
import { initializeDefaultData, saveAppState, createBackup, getAppState } from './src/utils/storage';
import { colors, globalStyles } from './src/styles/globalStyles';
import type { TabType } from './src/types';

export default function App(): React.JSX.Element {
  const [currentTab, setCurrentTab] = useState<TabType>('products');
  const [appReady, setAppReady] = useState<boolean>(false);

  useEffect(() => {
    initializeApp();
    const cleanup = setupAppStateHandler();
    return cleanup;
  }, []);

  const initializeApp = async (): Promise<void> => {
    try {
      console.log('🚀 Inicializando BocMarket...');
      
      // Recuperar estado anterior de la app
      const previousState = await getAppState();
      if (previousState.lastSaved) {
        console.log('📱 Recuperando datos guardados desde:', previousState.lastSaved);
        
        // Si había productos antes, mostrar un mensaje
        if (previousState.hasProducts) {
          console.log('✅ Se encontraron', previousState.productsCount, 'productos guardados');
        }
        
        // Si había items en carrito, mostrar mensaje
        if (previousState.hasCartItems) {
          console.log('🛒 Se encontraron', previousState.cartItemsCount, 'items en el carrito');
        }
      }
      
      // Inicializar datos por defecto si es primera vez
      await initializeDefaultData();
      
      // Crear backup automático
      await createBackup();
      
      // Guardar que la app se inició correctamente
      await saveAppState({ 
        appStarted: true, 
        lastStartTime: new Date().toISOString() 
      });
      
      setAppReady(true);
      console.log('✅ BocMarket listo para usar');
    } catch (error) {
      console.error('❌ Error al inicializar la app:', error);
      setAppReady(true); // Continuar aunque haya error
    }
  };

  const setupAppStateHandler = (): (() => void) => {
    const handleAppStateChange = async (nextAppState: string): Promise<void> => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // La app se está cerrando o minimizando
        console.log('💾 Guardando datos antes de cerrar...');
        await createBackup();
        await saveAppState({ 
          lastClosedTime: new Date().toISOString(),
          appState: nextAppState
        });
      } else if (nextAppState === 'active') {
        // La app se está abriendo
        console.log('🔄 App reactivada, verificando datos...');
        const state = await getAppState();
        if (state.lastClosedTime) {
          console.log('📂 Datos recuperados desde:', state.lastClosedTime);
        }
      }
    };

    const subscription = RNAppState.addEventListener('change', handleAppStateChange);
    
    // Cleanup
    return () => subscription?.remove();
  };

  const renderScreen = (): React.JSX.Element => {
    switch (currentTab) {
      case 'products':
        return <ProductsScreen />;
      case 'store':
        return <StoreScreen />;
      case 'register':
        return <DailyCashRegister />;
      default:
        return <ProductsScreen />;
    }
  };

  // Mostrar pantalla de carga mientras se inicializa
  if (!appReady) {
    return (
      <>
        <StatusBar style="dark" backgroundColor="#F8FAFC" />
        <Navigation currentTab={currentTab} onTabChange={setCurrentTab}>
          <View style={[globalStyles.container, globalStyles.center]}>
            <Text style={{ fontSize: 48, marginBottom: 20 }}>🎵</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: colors.dark }}>
              BocMarket
            </Text>
            <Text style={{ fontSize: 16, color: colors.gray }}>
              Cargando tu tienda musical...
            </Text>
          </View>
        </Navigation>
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab}>
        {renderScreen()}
      </Navigation>
    </>
  );
}
