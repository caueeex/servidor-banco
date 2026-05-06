import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CardapioScreen from '../screens/CardapioScreen';
import CarrinhoScreen from '../screens/CarrinhoScreen';
import { useCarrinho } from '../context/CarrinhoContext';

const Tab = createBottomTabNavigator();

const CORES = {
  primaria: '#3D8361',
  textoInativo: '#9ca3af',
  fundoTab: '#ffffff',
};

/**
 * Abas inferiores: Cardápio e Carrinho.
 * Badge no ícone do carrinho = soma das quantidades dos itens.
 */
function TabsComBadge() {
  const { totalQuantidade } = useCarrinho();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: CORES.primaria,
        tabBarInactiveTintColor: CORES.textoInativo,
        tabBarStyle: {
          backgroundColor: CORES.fundoTab,
          borderTopColor: '#e8ecf1',
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          const nomeIcone =
            route.name === 'Cardapio' ? 'restaurant-outline' : 'cart-outline';
          return <Ionicons name={nomeIcone} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Cardapio"
        component={CardapioScreen}
        options={{ tabBarLabel: 'Cardápio' }}
      />
      <Tab.Screen
        name="Carrinho"
        component={CarrinhoScreen}
        options={{
          tabBarLabel: 'Carrinho',
          tabBarBadge: totalQuantidade > 0 ? totalQuantidade : undefined,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <TabsComBadge />
    </NavigationContainer>
  );
}
