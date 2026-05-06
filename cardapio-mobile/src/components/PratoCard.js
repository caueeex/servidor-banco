import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { formatarPrecoBR, normalizarCategoria } from '../utils/format';

const CORES = {
  primaria: '#3D8361',
  texto: '#1c1c1c',
  textoSecundario: '#6b7280',
  cartao: '#ffffff',
  borda: '#e8ecf1',
};

/** Exibe um prato do cardápio com botão para adicionar ao carrinho. */
export default function PratoCard({ prato, onAdicionar }) {
  const cat = normalizarCategoria(prato.categoria);
  const catLabel =
    cat.length > 0 ? cat.charAt(0).toUpperCase() + cat.slice(1) : '—';

  return (
    <View style={styles.cartao}>
      <Text style={styles.nome}>{prato.nome}</Text>
      <Text style={styles.descricao}>
        {prato.descricao?.trim() ? prato.descricao : 'Sem descrição.'}
      </Text>
      <View style={styles.linhaInferior}>
        <View>
          <Text style={styles.preco}>{formatarPrecoBR(prato.preco)}</Text>
          <Text style={styles.categoria}>{catLabel}</Text>
        </View>
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() => onAdicionar(prato)}
          activeOpacity={0.85}
        >
          <Text style={styles.botaoAdicionarTexto}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: CORES.cartao,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: CORES.borda,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    color: CORES.texto,
    marginBottom: 6,
  },
  descricao: {
    fontSize: 14,
    color: CORES.textoSecundario,
    lineHeight: 20,
    marginBottom: 12,
  },
  linhaInferior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preco: {
    fontSize: 18,
    fontWeight: '700',
    color: CORES.primaria,
  },
  categoria: {
    marginTop: 4,
    fontSize: 12,
    color: CORES.textoSecundario,
    textTransform: 'capitalize',
  },
  botaoAdicionar: {
    backgroundColor: CORES.primaria,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  botaoAdicionarTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
