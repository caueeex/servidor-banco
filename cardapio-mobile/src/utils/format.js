/** Formata número como moeda brasileira (ex.: R$ 28,90). */
export function formatarPrecoBR(valor) {
  const n = Number(valor);
  if (!Number.isFinite(n)) return 'R$ —';
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Normaliza categoria da API para comparar filtros (case-insensitive). */
export function normalizarCategoria(cat) {
  return String(cat ?? '').trim().toLowerCase();
}
