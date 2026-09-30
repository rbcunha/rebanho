export function textoParaNumero(valor: string): number {
  const normalizado = valor.trim().replace(',', '.');
  return Number(normalizado);
}

export function formatarNumero(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
  }).format(valor);
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}
