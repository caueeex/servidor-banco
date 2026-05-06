import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PratoCard from '../components/PratoCard';
import { API_BASE_URL } from '../config/api';
import { useCarrinho } from '../context/CarrinhoContext';
import { normalizarCategoria } from '../utils/format';

const CORES = {
  fundo: '#f4f6f9',
  primaria: '#3D8361',
  texto: '#1c1c1c',
  textoSecundario: '#6b7280',
};

/** Botões de filtro no topo do cardápio. */
const FILTROS = [
  { id: 'todos', label: 'Todos', valorApi: null },
  { id: 'lanche', label: 'Lanches', valorApi: 'lanche' },
  { id: 'bebida', label: 'Bebidas', valorApi: 'bebida' },
  { id: 'sobremesa', label: 'Sobremesas', valorApi: 'sobremesa' },
];

export default function CardapioScreen() {
  const { adicionarAoCarrinho } = useCarrinho();
  const [pratos, setPratos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState('todos');

  /** Busca uma vez ao montar a tela (não refaz fetch ao trocar filtro). */
  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      setCarregando(true);
      setErro(false);
      try {
        const res = await fetch(`${API_BASE_URL}/pratos`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const dados = await res.json();
        if (!cancelado && Array.isArray(dados)) setPratos(dados);
        else if (!cancelado) setPratos([]);
      } catch {
        if (!cancelado) {
          setErro(true);
          setPratos([]);
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, []);

  const listaFiltrada = useMemo(() => {
    const cfg = FILTROS.find((f) => f.id === filtroAtivo);
    const alvo = cfg?.valorApi;
    if (!alvo) return pratos;
    return pratos.filter((p) => normalizarCategoria(p.categoria) === alvo);
  }, [pratos, filtroAtivo]);

  const renderItem = useCallback(
    ({ item }) => (
      <PratoCard prato={item} onAdicionar={adicionarAoCarrinho} />
    ),
    [adicionarAoCarrinho]
  );

  const keyExtractor = useCallback((item) => String(item._id), []);

  const listaVazia =
    !carregando &&
    !erro &&
    listaFiltrada.length === 0;

  return (
    <SafeAreaView style={styles.area} edges={['top', 'left', 'right']}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Cardápio</Text>
        <Text style={styles.subtitulo}>Escolha e adicione ao carrinho</Text>
      </View>

      <View style={styles.filtrosWrap}>
        <View style={styles.filtrosLinha}>
          {FILTROS.map((f) => {
            const ativo = filtroAtivo === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.chip, ativo && styles.chipAtivo]}
                onPress={() => setFiltroAtivo(f.id)}
              >
                <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={CORES.primaria} />
          <Text style={styles.msgEstado}>Carregando...</Text>
        </View>
      ) : erro ? (
        <View style={styles.centro}>
          <Text style={styles.msgEstado}>Erro ao carregar dados</Text>
          <Text style={styles.msgAjuda}>
            Confira se o servidor está no ar e se API_BASE_URL está correta em
            src/config/api.js
          </Text>
        </View>
      ) : listaVazia ? (
        <View style={styles.centro}>
          <Text style={styles.msgEstado}>Nenhum prato encontrado</Text>
          <Text style={styles.msgAjuda}>
            Tente outro filtro ou cadastre pratos na API.
          </Text>
        </View>
      ) : (
        <FlatList
          data={listaFiltrada}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listaContent}
          showsVerticalScrollIndicator={false}
        />
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
  filtrosWrap: {
    paddingBottom: 8,
  },
  filtrosLinha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e8ecf1',
  },
  chipAtivo: {
    backgroundColor: CORES.primaria,
    borderColor: CORES.primaria,
  },
  chipTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textoSecundario,
  },
  chipTextoAtivo: {
    color: '#fff',
  },
  listaContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  msgEstado: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '600',
    color: CORES.texto,
    textAlign: 'center',
  },
  msgAjuda: {
    marginTop: 10,
    fontSize: 14,
    color: CORES.textoSecundario,
    textAlign: 'center',
    lineHeight: 20,
  },
});
