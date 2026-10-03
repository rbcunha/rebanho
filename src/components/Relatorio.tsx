import type { Animal } from '../types/Animal';
import { formatarMoeda } from '../utils/numero';
import { formatarData } from '../utils/data';

type RelatorioProps = {
  animais: Animal[];
  onVoltar: () => void;
};

export function Relatorio({ animais, onVoltar }: RelatorioProps) {
  const totalPlantel = animais.filter(
    (animal) => animal.status === 'PLANTEL',
  ).length;

  const totalVendidos = animais.filter(
    (animal) => animal.status === 'VENDIDO',
  ).length;

  const totalMortos = animais.filter(
    (animal) => animal.status === 'MORTO',
  ).length;

  const valorInvestido = animais.reduce(
    (total, animal) => total + (animal.valorCompra ?? 0),
    0,
  );

  const valorVendas = animais
    .filter((animal) => animal.status === 'VENDIDO')
    .reduce((total, animal) => total + (animal.valorVenda ?? 0), 0);

  const resultadoBruto = animais
    .filter((animal) => animal.status === 'VENDIDO')
    .reduce(
      (total, animal) =>
        total + (animal.valorVenda ?? 0) - (animal.valorCompra ?? 0),
      0,
    );

  const valorPerdas = animais
    .filter((animal) => animal.status === 'MORTO')
    .reduce((total, animal) => total + (animal.valorCompra ?? 0), 0);

  return (
    <section className="min-h-screen bg-slate-200 py-8">
      <div className="mx-auto min-h-[297mm] w-[210mm] bg-white p-[15mm]">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-rebanho-text">
              Relatório do Rebanho
            </h1>
            <p className="mt-1 text-sm text-rebanho-text">
              Emitido em {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="no-print flex gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="cursor-pointer rounded-lg bg-rebanho-primary px-4 py-2 text-white hover:bg-rebanho-accent"
            >
              Imprimir
            </button>
            <button
              onClick={onVoltar}
              className="no-print cursor-pointer rounded-lg bg-rebanho-primary px-4 py-2 text-white hover:bg-rebanho-accent"
            >
              Voltar
            </button>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-shadow-rebanho-muted">Plantel</p>
              <p className="font-semibold text-rebanho-text">{totalPlantel}</p>
            </div>

            <div>
              <p className="text-sm text-shadow-rebanho-muted">Vendidos</p>
              <p className="font-semibold text-rebanho-text">{totalVendidos}</p>
            </div>
            <div>
              <p className="text-sm text-shadow-rebanho-muted">Mortos</p>
              <p className="font-semibold text-rebanho-text">{totalMortos}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-3 mt-6 text-lg font-semibold text-rebanho-text">
            Financeiro
          </h2>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-rebanho-muted">Valor investido</p>
              <p className="font-semibold text-rebanho-text">
                {formatarMoeda(valorInvestido)}
              </p>
            </div>

            <div>
              <p className="text-sm text-rebanho-muted">Valor em vendas</p>
              <p className="font-semibold text-rebando-text">
                {formatarMoeda(valorVendas)}
              </p>
            </div>

            <div>
              <p className="text-sm text-rebanho-muted">Resultado bruto</p>
              <p className="font-semibold text-rebanho-text">
                {formatarMoeda(resultadoBruto)}
              </p>
            </div>

            <div>
              <p className="text-sm text-rebanho-muted">Perdas</p>
              <p className="font-semibold text-rebanho-text">
                {formatarMoeda(valorPerdas)}
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-3 mt-6 text-lg font-semibold text-rebanho-text">
              Relação dos animais
            </h2>

            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="py-2">Brinco</th>
                  <th className="py-2">Sexo</th>
                  <th className="py-2">Raça</th>
                  <th className="py-2">Peso</th>
                  <th className="py-2">Entrada</th>
                  <th className="py-2">Situação</th>
                </tr>
              </thead>

              <tbody>
                {animais.map((animal) => (
                  <tr key={animal.id} className="border-b border-slate-200">
                    <td className="py-2">{animal.brinco}</td>
                    <td className="py-2">{animal.sexo}</td>
                    <td className="py-2">{animal.raca}</td>
                    <td className="py-2">
                      {animal.peso !== null ? `${animal.peso} kg` : '-'}
                    </td>
                    <td className="py-2">{formatarData(animal.dataEntrada)}</td>
                    <td className="py-2">
                      {animal.status === 'PLANTEL'
                        ? 'No plantel'
                        : animal.status === 'VENDIDO'
                          ? 'Vendido'
                          : 'Morto'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
