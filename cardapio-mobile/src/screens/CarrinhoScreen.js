import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
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

  const [modalConfirmarVisivel, setModalConfirmarVisivel] = useState(false);

  const abrirModalConfirmacao = () => {
    if (itens.length === 0) return;
    setModalConfirmarVisivel(true);
  };

  const fecharModalConfirmacao = () => setModalConfirmarVisivel(false);

  const confirmarEFinalizarPedido = () => {
    limparCarrinho();
    setModalConfirmarVisivel(false);
    Alert.alert(
      'Pedido finalizado!',
      'Obrigado pela preferência. Seu carrinho foi esvaziado (simulação).'
    );
  };

  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0);

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
              onPress={abrirModalConfirmacao}
              activeOpacity={0.9}
            >
              <Text style={styles.btnFinalizarTexto}>Finalizar Pedido</Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={modalConfirmarVisivel}
            transparent
            animationType="fade"
            onRequestClose={fecharModalConfirmacao}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={fecharModalConfirmacao}
            >
              <View style={styles.modalCaixa}>
                <Text style={styles.modalTitulo}>Confirmar pedido?</Text>
                <Text style={styles.modalTexto}>
                  Você está finalizando {totalItens}{' '}
                  {totalItens === 1 ? 'item' : 'itens'} por{' '}
                  <Text style={styles.modalTotal}>
                    {formatarPrecoBR(totalPreco)}
                  </Text>
                  .
                </Text>
                <Text style={styles.modalSub}>
                  O carrinho será esvaziado após a confirmação (simulação).
                </Text>

                <View style={styles.modalBotoes}>
                  <TouchableOpacity
                    style={styles.modalBtnSecundario}
                    onPress={fecharModalConfirmacao}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalBtnSecundarioTexto}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalBtnPrimario}
                    onPress={confirmarEFinalizarPedido}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalBtnPrimarioTexto}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCaixa: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: CORES.texto,
    marginBottom: 12,
  },
  modalTexto: {
    fontSize: 15,
    color: CORES.textoSecundario,
    lineHeight: 22,
    marginBottom: 8,
  },
  modalTotal: {
    fontWeight: '700',
    color: CORES.primaria,
  },
  modalSub: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginBottom: 22,
    lineHeight: 18,
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtnSecundario: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8ecf1',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  modalBtnSecundarioTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: CORES.textoSecundario,
  },
  modalBtnPrimario: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: CORES.primaria,
  },
  modalBtnPrimarioTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
