export type Animal = {
  id: number;
  brinco: string;
  sexo: 'Macho' | 'Fêmea';
  raca: string;
  dataNascimento: string | null;
  peso: number | null;
  dataEntrada: string;
  origem: string | null;
  valorCompra: number | null;
  status: 'PLANTEL' | 'VENDIDO' | 'MORTO';
  dataSaida: string | null;
  comprador: string | null;
  valorVenda: number | null;
  dataMorte: string | null;
  causaMorte: string | null;
  observacoes: string | null;
};
