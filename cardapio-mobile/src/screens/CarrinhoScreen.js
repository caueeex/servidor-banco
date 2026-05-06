import React, { useCallback } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CarrinhoItemRow from '../components/CarrinhoItemRow';
import { useCarrinho } from '../context/CarrinhoContext';
import { formatarPrecoBR } from '../utils/format';

const CORES = {
  fundo: '#f4f6f9',
  primaria: '#3D8361',
  texto: '#1c1c1c',
  textoSecundario: '#6b7280',
};

export default function CarrinhoScreen() {
  const {
    itens,
    totalPreco,
    incrementar,
    decrementar,
    limparCarrinho,
  } = useCarrinho();

  const finalizar = () => {
    if (itens.length === 0) return;
    limparCarrinho();
    Alert.alert(
      'Pedido finalizado!',
      'Obrigado pela preferência. Seu carrinho foi esvaziado (simulação).'
    );
  };

  const renderItem = useCallback(
    ({ item }) => (
      <CarrinhoItemRow
        item={item}
        onMais={incrementar}
        onMenos={decrementar}
      />
    ),
    [incrementar, decrementar]
  );

  const keyExtractor = useCallback((item) => String(item._id), []);

  return (
    <SafeAreaView style={styles.area} edges={['top', 'left', 'right']}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Carrinho</Text>
        <Text style={styles.subtitulo}>Revise e finalize seu pedido</Text>
      </View>

      {itens.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioTitulo}>Seu carrinho está vazio</Text>
          <Text style={styles.vazioTexto}>
            Vá até o cardápio, escolha seus pratos e toque em Adicionar.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={itens}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.listaContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.rodape}>
            <View style={styles.totalLinha}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValor}>
                {formatarPrecoBR(totalPreco)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.btnFinalizar}
              onPress={finalizar}
              activeOpacity={0.9}
            >
              <Text style={styles.btnFinalizarTexto}>Finalizar Pedido</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: CORES.texto,
  },
  subtitulo: {
    marginTop: 4,
    fontSize: 14,
    color: CORES.textoSecundario,
  },
  listaContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  vazio: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  vazioTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: CORES.texto,
    textAlign: 'center',
  },
  vazioTexto: {
    marginTop: 10,
    fontSize: 15,
    color: CORES.textoSecundario,
    textAlign: 'center',
    lineHeight: 22,
  },
  rodape: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e8ecf1',
    backgroundColor: '#f4f6f9',
  },
  totalLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: CORES.texto,
  },
  totalValor: {
    fontSize: 22,
    fontWeight: '800',
    color: CORES.primaria,
  },
  btnFinalizar: {
    backgroundColor: CORES.primaria,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnFinalizarTexto: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
