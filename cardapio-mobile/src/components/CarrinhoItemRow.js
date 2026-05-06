import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { formatarPrecoBR } from '../utils/format';

const CORES = {
  primaria: '#3D8361',
  texto: '#1c1c1c',
  textoSecundario: '#6b7280',
  cartao: '#ffffff',
  borda: '#e8ecf1',
};

/**
 * Uma linha do carrinho: nome, preço unitário, quantidade e controles +/- .
 */
export default function CarrinhoItemRow({ item, onMais, onMenos }) {
  const subtotal = item.preco * item.quantidade;

  return (
    <View style={styles.linha}>
      <View style={styles.info}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.unitario}>
          {formatarPrecoBR(item.preco)} cada
        </Text>
      </View>

      <View style={styles.controles}>
        <TouchableOpacity
          style={styles.btnCirculo}
          onPress={() => onMenos(item._id)}
          accessibilityLabel="Diminuir quantidade"
        >
          <Text style={styles.btnCirculoTexto}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtd}>{item.quantidade}</Text>
        <TouchableOpacity
          style={styles.btnCirculo}
          onPress={() => onMais(item._id)}
          accessibilityLabel="Aumentar quantidade"
        >
          <Text style={styles.btnCirculoTexto}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtotal}>{formatarPrecoBR(subtotal)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.cartao,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CORES.borda,
    gap: 8,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: CORES.texto,
  },
  unitario: {
    marginTop: 4,
    fontSize: 13,
    color: CORES.textoSecundario,
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnCirculo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eef6f1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  btnCirculoTexto: {
    fontSize: 20,
    fontWeight: '600',
    color: CORES.primaria,
    marginTop: -2,
  },
  qtd: {
    fontSize: 16,
    fontWeight: '700',
    color: CORES.texto,
    minWidth: 22,
    textAlign: 'center',
  },
  subtotal: {
    fontSize: 15,
    fontWeight: '700',
    color: CORES.primaria,
    width: 88,
    textAlign: 'right',
  },
});
