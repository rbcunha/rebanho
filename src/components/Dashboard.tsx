import type { Animal } from '../types/Animal';
import { formatarMoeda } from '../utils/numero';

type DashboardProps = {
  animais: Animal[];
};

export function Dashboard({ animais }: DashboardProps) {
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

  return (
    <section className="py-6">
      <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
      <p className="mt-2 text-slate-500">Visão geral do rebanho</p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Plantel</p>
          <p className="mt-2 text-3xl font-semibold text-slate-800">
            {totalPlantel}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Vendidos</p>
          <p className="mt-2 text-3xl font-semibold text-slate-800">
            {totalVendidos}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Mortos</p>
          <p className="mt-2 text-3xl font-semibold text-slate-800">
            {totalMortos}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Valor Investido</p>
          <p className="mt-2 text-2xl font-semibold text-slate-800">
            {formatarMoeda(valorInvestido)}
          </p>
        </div>
      </div>
    </section>
  );
}
