import type { Animal } from '../types/Animal';

type FormularioAnimal = {
  brinco: string;
  sexo: string;
  raca: string;
  dataNascimento: string;
  peso: string;
  dataEntrada: string;
  origem: string;
  valorCompra: string;
  observacoes: string;
};

type AnimalFormProps = {
  formulario: FormularioAnimal;
  animalEmEdicao: Animal | null;
  erroFormulario: string;
  onFormularioChange: (formulario: FormularioAnimal) => void;
  onSalvar: () => void;
  onCancelar: () => void;
};

export function AnimalForm({
  formulario,
  animalEmEdicao,
  erroFormulario,
  onFormularioChange,
  onSalvar,
  onCancelar,
}: AnimalFormProps) {
  return (
    <section className="p-6">
      <h2 className="text-xl font-semibold text-slate-800">
        {animalEmEdicao ? 'Editar animal' : 'Novo animal'}
      </h2>

      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="brinco"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Brinco
          </label>

          <input
            id="brinco"
            type="text"
            value={formulario.brinco}
            onChange={(event) =>
              onFormularioChange({
                ...formulario,
                brinco: event.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="sexo"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Sexo
          </label>

          <select
            id="sexo"
            value={formulario.sexo}
            onChange={(event) =>
              onFormularioChange({
                ...formulario,
                sexo: event.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          >
            <option value="">Selecione</option>
            <option value="Macho">Macho</option>
            <option value="Fêmea">Fêmea</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="raca"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Raça
          </label>

          <input
            id="raca"
            type="text"
            value={formulario.raca}
            onChange={(event) =>
              onFormularioChange({
                ...formulario,
                raca: event.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="dataNascimento"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Data de nascimento
          </label>

          <input
            id="dataNascimento"
            type="date"
            value={formulario.dataNascimento}
            onChange={(event) =>
              onFormularioChange({
                ...formulario,
                dataNascimento: event.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="peso"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Peso (Kg)
          </label>

          <input
            id="peso"
            type="text"
            inputMode="decimal"
            value={formulario.peso}
            onChange={(event) =>
              onFormularioChange({ ...formulario, peso: event.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="dataEntrada"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Data de entrada
          </label>

          <input
            id="dataEntrada"
            type="date"
            value={formulario.dataEntrada}
            onChange={(event) =>
              onFormularioChange({
                ...formulario,
                dataEntrada: event.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="origem"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Origem / Fornecedor
          </label>

          <input
            id="origem"
            type="text"
            value={formulario.origem}
            onChange={(event) =>
              onFormularioChange({
                ...formulario,
                origem: event.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="valorCompra"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Valor de compra (R$)
          </label>

          <input
            id="valorCompra"
            type="text"
            inputMode="decimal"
            value={formulario.valorCompra}
            onChange={(event) =>
              onFormularioChange({
                ...formulario,
                valorCompra: event.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="observacoes"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Observações
          </label>

          <textarea
            id="observacoes"
            rows={3}
            value={formulario.observacoes}
            onChange={(event) =>
              onFormularioChange({
                ...formulario,
                observacoes: event.target.value,
              })
            }
            className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>
      </div>

      {erroFormulario && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {erroFormulario}
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
          onClick={onSalvar}
          className="cursor-pointer rounded-lg bg-rebanho-primary px-5 py-2 font-medium text-white hover:bg-rebanho-accent"
        >
          {animalEmEdicao ? 'Salvar alterações' : 'Salvar'}
        </button>
      </div>
    </section>
  );
}
