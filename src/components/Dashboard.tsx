import type { Animal } from '../types/Animal';
import { formatarMoeda } from '../utils/numero';

import { BadgeDollarSign, HandCoins, HeartOff, TrendingUp } from 'lucide-react';
import cowIcon from '../assets/icons/cow.svg';
import investmentIcon from '../assets/icons/investment.svg';

type DashboardProps = {
  animais: Animal[];
  onAnimais: () => void;
  onRelatorio: () => void;
};

export function Dashboard({ animais, onAnimais, onRelatorio }: DashboardProps) {
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

  const animaisNoPlantel = animais.filter(
    (animal) => animal.status === 'PLANTEL',
  );

  const totalMachos = animaisNoPlantel.filter(
    (animal) => animal.sexo === 'Macho',
  ).length;

  const totalFemeas = animaisNoPlantel.filter(
    (animal) => animal.sexo === 'Fêmea',
  ).length;

  const pesosPlantel = animaisNoPlantel
    .map((animal) => animal.peso)
    .filter((peso): peso is number => peso !== null);

  const pesoMedio =
    pesosPlantel.length > 0
      ? pesosPlantel.reduce((total, peso) => total + peso, 0) /
        pesosPlantel.length
      : 0;

  const menorPeso = pesosPlantel.length > 0 ? Math.min(...pesosPlantel) : 0;

  const maiorPeso = pesosPlantel.length > 0 ? Math.max(...pesosPlantel) : 0;

  return (
    <section className="flex min-h-screen w-full items-center">
      <div className="mx-auto w-1050px">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-rebanho-text">Dashboard</h1>

            <p className="mt-2 text-rebanho-muted">Visão geral do rebanho</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onRelatorio}
              className="cursor-pointer rounded-lg bg-rebanho-primary px-4 py-2 text-white hover:bg-rebanho-accent"
            >
              Relatório
            </button>

            <button
              type="button"
              onClick={onAnimais}
              className="cursor-pointer rounded-lg bg-rebanho-primary px-4 py-2 text-white hover:bg-rebanho-accent"
            >
              Animais
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow-md">
            <div className="flex items-center gap-2">
              <img src={cowIcon} alt="" className="h-8 w-8" />
              <p className="text-sm text-rebanho-muted">Plantel</p>
            </div>

            <p className="mt-2 text-center text-3xl font-semibold text-rebanho-text">
              {totalPlantel}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-md">
            <div className="flex items-center gap-2">
              <BadgeDollarSign
                size={24}
                strokeWidth={1.75}
                className="text-sm font-medium text-rebanho-primary"
              />
              <p className="text-sm text-rebanho-muted">Vendidos</p>
            </div>
            <p className="mt-2 text-center text-3xl font-semibold text-rebanho-text">
              {totalVendidos}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-md">
            <div className="flex items-center gap-2">
              <HeartOff
                size={24}
                strokeWidth={1.75}
                className="text-rebanho-primary"
              />
              <p className="text-sm  text-rebanho-muted">Mortos</p>
            </div>
            <p className="mt-2 text-center text-3xl font-semibold text-rebanho-text">
              {totalMortos}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-md">
            <div className="flex items-center gap-2">
              <img src={investmentIcon} alt="" className="h-8 w-8" />
              <p className="text-sm text-rebanho-muted">Valor Investido</p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-rebanho-text">
              {formatarMoeda(valorInvestido)}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white px-5 py-3 shadow-md">
            <div className="flex items-center gap-2">
              <HandCoins
                size={24}
                strokeWidth={1.75}
                className="text-rebanho-primary"
              />
              <p className="text-sm text-rebanho-muted"> Valor em Vendas</p>
            </div>

            <p className="mt-1 text-2xl font-semibold text-rebanho-text">
              {formatarMoeda(valorVendas)}
            </p>
          </div>

          <div className="rounded-xl bg-white px-5 py-3 shadow-md">
            <div className="flex items-center gap-2">
              <TrendingUp
                size={24}
                strokeWidth={1.75}
                className="text-rebanho-primary"
              />
              <p className="text-sm text-rebanho-muted">Resultado bruto</p>
            </div>

            <p className="mt-1 text-2xl font-semibold text-rebanho-text">
              {formatarMoeda(resultadoBruto)}
            </p>
          </div>
          <div className="rounded-xl bg-white px-5 py-3 shadow-md">
            <div className="flex items-center gap-2">
              <HeartOff
                size={24}
                strokeWidth={1.75}
                className="text-rebanho-primary"
              />
              <p className="text-sm text-rebanho-muted">Perdas</p>
            </div>

            <p className="mt-1 text-2xl font-semibold text-rebanho-text">
              {formatarMoeda(valorPerdas)}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-white p-5 shadow-md">
          <h2 className="text-lg font-semibold text-rebanho-text">
            Resumo do Plantel
          </h2>

          <div className="mt-4 grid grid-cols-5 divide-x divide-rebanho-border">
            <div className="text-center">
              <p className="text-sm  text-rebanho-muted">Machos</p>
              <p className="mt-1 text-xl font-semibold text-rebanho-text">
                {totalMachos}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-rebanho-muted">Fêmeas</p>
              <p className="mt-1 text-xl font-semibold text-rebanho-text">
                {totalFemeas}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-rebanho-muted">Peso médio</p>
              <p className="mt-1 text-xl font-semibold text-rebanho-text">
                {pesoMedio.toFixed(1)} Kg
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-rebanho-muted">Menor peso</p>
              <p className="mt-1 text-xl font-semibold text-rebanho-text">
                {menorPeso.toFixed(1)} kg
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-rebanho-muted">Maior peso</p>
              <p className="mt-1 text-xl font-semibold text-rebanho-text">
                {maiorPeso.toFixed(1)} kg
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
