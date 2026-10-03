import { useState } from 'react';
import type { Animal } from '../types/Animal';
import { textoParaNumero } from '../utils/numero';
import { formatarData } from '../utils/data';

type VendaFormProps = {
  animal: Animal;
  onCancelar: () => void;
  onVender: (dataVenda: string, comprador: string, valorVenda: number) => void;
};

export function VendaForm({ animal, onCancelar, onVender }: VendaFormProps) {
  const [dataVenda, setDataVenda] = useState(animal.dataSaida ?? '');
  const [comprador, setComprador] = useState(animal.comprador ?? '');
  const [valorVenda, setValorVenda] = useState<string>(
    animal.valorVenda?.toString() ?? '',
  );
  const [erro, setErro] = useState('');
  const hoje = new Date().toLocaleDateString('en-CA');

  return (
    <section className="p-6">
      <h2 className="text-xl font-semibold text-slate-800">
        {animal.status === 'VENDIDO' ? 'Editar venda' : 'Vender animal'}
      </h2>

      <p className="mt-1 text-sm text-slate-500">Brinco: {animal.brinco}</p>

      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="dataVenda"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Data da Venda
          </label>

          <input
            id="dataVenda"
            type="date"
            value={dataVenda}
            max={hoje}
            onChange={(event) => setDataVenda(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="comprador"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Comprador
          </label>

          <input
            id="comprador"
            type="text"
            value={comprador}
            onChange={(event) => setComprador(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="valorVenda"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Valor da Venda (R$)
          </label>

          <input
            id="valorVenda"
            type="text"
            inputMode="decimal"
            value={valorVenda}
            onChange={(event) => setValorVenda(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>
      </div>

      {erro && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancelar}
          className="cursor-pointer rounded-lg border border-slate-300 bg-white px-5 py-2 font-medium text-rebanho-text hover:bg-slate-100"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={() => {
            if (!dataVenda || !valorVenda) {
              setErro('Preencha Data da Venda e Valor da Venda.');
              return;
            }

            if (dataVenda < animal.dataEntrada) {
              setErro(
                `A data da venda dever igual ou posterior à data de entrada do animal (${formatarData(animal.dataEntrada)}).`,
              );
              return;
            }

            if (dataVenda > hoje) {
              setErro(`A data da venda não pode ser posterior À data de hoje.`);
              return;
            }

            setErro('');
            onVender(dataVenda, comprador, textoParaNumero(valorVenda));
          }}
          className="cursor-pointer rounded-lg bg-rebanho-primary px-5 py-2 font-medium text-white hover:bg-rebanho-accent"
        >
          Confirmar Venda
        </button>
      </div>
    </section>
  );
}
