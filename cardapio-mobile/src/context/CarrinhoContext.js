import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

/**
 * Item no carrinho: { _id, nome, preco, quantidade }
 * @typedef {{ _id: string, nome: string, preco: number, quantidade: number }} ItemCarrinho
 */

/** @type {React.Context<undefined | ReturnType<typeof useCarrinhoValue>>} */
const CarrinhoContext = createContext(undefined);

function useCarrinhoValue() {
  /** @type {[ItemCarrinho[], React.Dispatch<React.SetStateAction<ItemCarrinho[]>>]} */
  const [itens, setItens] = useState([]);

  /** Soma das quantidades (badge do carrinho). */
  const totalQuantidade = useMemo(
    () => itens.reduce((acc, i) => acc + i.quantidade, 0),
    [itens]
  );

  /** Total em reais (preco * quantidade por linha). */
  const totalPreco = useMemo(
    () => itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0),
    [itens]
  );

  /** Adiciona prato ou incrementa quantidade se já existir. */
  const adicionarAoCarrinho = useCallback((prato) => {
    const id = String(prato._id);
    const preco = Number(prato.preco);
    if (!Number.isFinite(preco)) return;

    setItens((prev) => {
      const idx = prev.findIndex((x) => String(x._id) === id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantidade: next[idx].quantidade + 1,
        };
        return next;
      }
      return [
        ...prev,
        {
          _id: prato._id,
          nome: String(prato.nome ?? ''),
          preco,
          quantidade: 1,
        },
      ];
    });
  }, []);

  const incrementar = useCallback((id) => {
    setItens((prev) =>
      prev.map((i) =>
        String(i._id) === String(id)
          ? { ...i, quantidade: i.quantidade + 1 }
          : i
      )
    );
  }, []);

  /** Ao chegar em 0 o item é removido do array. */
  const decrementar = useCallback((id) => {
    setItens((prev) =>
      prev
        .map((i) =>
          String(i._id) === String(id)
            ? { ...i, quantidade: i.quantidade - 1 }
            : i
        )
        .filter((i) => i.quantidade > 0)
    );
  }, []);

  const limparCarrinho = useCallback(() => setItens([]), []);

  return useMemo(
    () => ({
      itens,
      totalQuantidade,
      totalPreco,
      adicionarAoCarrinho,
      incrementar,
      decrementar,
      limparCarrinho,
    }),
    [
      itens,
      totalQuantidade,
      totalPreco,
      adicionarAoCarrinho,
      incrementar,
      decrementar,
      limparCarrinho,
    ]
  );
}

export function CarrinhoProvider({ children }) {
  const value = useCarrinhoValue();
  return (
    <CarrinhoContext.Provider value={value}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoContext);
  if (ctx === undefined) {
    throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider.');
  }
  return ctx;
}
