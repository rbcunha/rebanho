import { useState } from 'react';
import type { Animal } from '../types/Animal';
import { formatarData } from '../utils/data';

type MorteFormProps = {
  animal: Animal;
  onCancelar: () => void;
  onRegistrarMorte: (dataMorte: string, causaMorte: string) => void;
};

export function MorteForm({
  animal,
  onCancelar,
  onRegistrarMorte,
}: MorteFormProps) {
  const [dataMorte, setDataMorte] = useState(animal.dataMorte ?? '');
  const [causaMorte, setCausaMorte] = useState(animal.causaMorte ?? '');
  const [erro, setErro] = useState('');

  const hoje = new Date().toLocaleDateString('en-CA');

  return (
    <section className="p-6">
      <h2 className="text-xl font-semibold text-slate-800">
        {animal.status === 'MORTO' ? 'Editar morte' : 'Registrar morte'}
      </h2>

      <p className="mt-1 text-sm text-slate-500">Brinco: {animal.brinco}</p>

      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="dataMorte"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Data da morte
          </label>
          <input
            id="dataMorte"
            type="date"
            value={dataMorte}
            max={hoje}
            onChange={(event) => setDataMorte(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="causaMorte"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Causa da morte
          </label>
          <input
            id="causaMorte"
            type="text"
            value={causaMorte}
            onChange={(event) => setCausaMorte(event.target.value)}
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
          className="cursor-pointer rounded-lg border border-slate-300 bg-white px-5 py-2 font-medium text-slate-700 hover:bg-slate-100"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={() => {
            if (!dataMorte) {
              setErro('Preencha a Data da morte.');
              return;
            }

            if (dataMorte < animal.dataEntrada) {
              setErro(
                `A data da morte deve ser igual ou posterior à data de entrada do animal (${formatarData(animal.dataEntrada)}).`,
              );
              return;
            }

            if (dataMorte > hoje) {
              setErro('A data da morte não pode ser posterior À data de hoje.');

              return;
            }

            setErro('');
            onRegistrarMorte(dataMorte, causaMorte);
          }}
          className="cursor-pointer rounded-lg bg-red-700 px-5 py-2 font-medium text-white hover:bg-red-600"
        >
          Confirmar morte
        </button>
      </div>
    </section>
  );
}
