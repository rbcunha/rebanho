import Database from '@tauri-apps/plugin-sql';
import type { Animal } from '../types/Animal';

export async function conectarBanco() {
  const db = await Database.load('sqlite:rebanho.db');

  return db;
}

export async function listarAnimais(): Promise<Animal[]> {
  const db = await conectarBanco();

  const linhas = await db.select<
    {
      id: number;
      brinco: string;
      sexo: 'Macho' | 'Fêmea';
      raca: string;
      data_nascimento: string | null;
      peso: number | null;
      data_entrada: string;
      origem: string | null;
      valor_compra: number | null;
      status: 'PLANTEL' | 'VENDIDO' | 'MORTO';
      data_saida: string | null;
      comprador: string | null;
      valor_venda: number | null;
      data_morte: string | null;
      causa_morte: string | null;
      observacoes: string | null;
    }[]
  >('SELECT * FROM animais ORDER BY id');

  return linhas.map((linha) => ({
    id: linha.id,
    brinco: linha.brinco,
    sexo: linha.sexo,
    raca: linha.raca,
    dataNascimento: linha.data_nascimento,
    peso: linha.peso,
    dataEntrada: linha.data_entrada,
    origem: linha.origem,
    valorCompra: linha.valor_compra,
    status: linha.status,
    dataSaida: linha.data_saida,
    comprador: linha.comprador,
    valorVenda: linha.valor_venda,
    dataMorte: linha.data_morte,
    causaMorte: linha.causa_morte,
    observacoes: linha.observacoes,
  }));
}

export async function inserirAnimal(animal: Animal): Promise<void> {
  const db = await conectarBanco();

  await db.execute(
    `INSERT INTO animais (
      id,
      brinco,
      sexo,
      raca,
      data_nascimento,
      peso, 
      data_entrada,
      origem,
      valor_compra,
      status,
      data_saida,
      comprador,
      valor_venda,
      data_morte,
      causa_morte,
      observacoes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      animal.id,
      animal.brinco,
      animal.sexo,
      animal.raca,
      animal.dataNascimento,
      animal.peso,
      animal.dataEntrada,
      animal.origem,
      animal.valorCompra,
      animal.status,
      animal.dataSaida,
      animal.comprador,
      animal.valorVenda,
      animal.dataMorte,
      animal.causaMorte,
      animal.observacoes,
    ],
  );
}

export async function atualizarAnimal(animal: Animal): Promise<void> {
  const db = await conectarBanco();

  await db.execute(
    `UPDATE animais SET
    brinco = ?,
    sexo = ?,
    raca = ?,
    data_nascimento = ?,
    peso = ?,
    data_entrada = ?,
    origem = ?,
    valor_compra = ?,
    observacoes = ?
    WHERE id = ?`,
    [
      animal.brinco,
      animal.sexo,
      animal.raca,
      animal.dataNascimento,
      animal.peso,
      animal.dataEntrada,
      animal.origem,
      animal.valorCompra,
      animal.observacoes,
      animal.id,
    ],
  );
}

export async function atualizarVenda(animal: Animal): Promise<void> {
  const db = await conectarBanco();

  await db.execute(
    `UPDATE animais SET
      status = ?,
      data_saida = ?,
      comprador = ?,
      valor_venda =?
    WHERE id = ?`,
    [
      animal.status,
      animal.dataSaida,
      animal.comprador,
      animal.valorVenda,
      animal.id,
    ],
  );
}

export async function atualizarMorte(animal: Animal): Promise<void> {
  const db = await conectarBanco();

  await db.execute(
    `UPDATE animais SET
      status = ?,
      data_morte =?,
      causa_morte =?
    WHERE id =?`,
    [animal.status, animal.dataMorte, animal.causaMorte, animal.id],
  );
}

export async function excluirAnimal(id: number): Promise<void> {
  const db = await conectarBanco();

  await db.execute('DELETE FROM animais WHERE id = ?', [id]);
}
