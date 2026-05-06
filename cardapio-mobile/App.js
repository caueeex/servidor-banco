import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CarrinhoProvider } from './src/context/CarrinhoContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <CarrinhoProvider>
        <AppNavigator />
        <StatusBar style="dark" />
      </CarrinhoProvider>
    </SafeAreaProvider>
  );
}
