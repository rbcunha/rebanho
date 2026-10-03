import type { Animal } from '../types/Animal';
import { formatarMoeda, formatarNumero } from '../utils/numero';
import { formatarData } from '../utils/data';

type AnimalDetailsProps = {
  animal: Animal;
  onEditar: (animal: Animal) => void;
  onVender: (animal: Animal) => void;
  onRegistrarMorte: (animal: Animal) => void;
  onExcluir: (animal: Animal) => void;
  onFechar: () => void;
};

export function AnimalDetails({
  animal,
  onEditar,
  onVender,
  onRegistrarMorte,
  onExcluir,
  onFechar,
}: AnimalDetailsProps) {
  return (
    <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-rebanho-text">
            Animal {animal.brinco}
          </h2>

          <span
            className={`rounded-lg px-2 py-1 text-xl font-medium ${
              animal.status === 'PLANTEL'
                ? 'bg-rebanho-border text-rebanho-primary'
                : animal.status === 'VENDIDO'
                  ? 'bg-rebanho-border text-rebanho-primary'
                  : 'bg-rebanho-border text-rebanho-text'
            }`}
          >
            {animal.status === 'PLANTEL'
              ? 'Plantel'
              : animal.status === 'VENDIDO'
                ? 'Vendido'
                : 'Morto'}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-sm text-rebanho-muted">Sexo</p>
          <p className="font-medium text-rebanho-text">{animal.sexo}</p>
        </div>

        <div>
          <p className="text-sm text-rebanho-muted">Raça</p>
          <p className="font-medium text-rebanho-text">
            {animal.raca || 'Não informada'}
          </p>
        </div>

        <div>
          <p className="text-sm text-rebanho-muted">Peso</p>
          <p className="font-medium text-rebanho-text">
            {animal.peso !== null
              ? `${formatarNumero(animal.peso)} kg`
              : 'Não informado'}
          </p>
        </div>

        <div>
          <p className="text-sm text-rebanho-muted">Nascimento</p>
          <p className="font-medium text-rebanho-text">
            {animal.dataNascimento
              ? formatarData(animal.dataNascimento)
              : 'Não informada'}
          </p>
        </div>

        <div>
          <p className="text-sm text-rebanho-muted">Entrada</p>
          <p className="font-medium text-rebanho-text">
            {animal.dataEntrada
              ? formatarData(animal.dataEntrada)
              : 'Não informada'}
          </p>
        </div>

        <div>
          <p className="text-sm text-rebanho-muted">Origem</p>
          <p className="font-medium text-rebanho-text">
            {animal.origem || 'Não informada'}
          </p>
        </div>

        <div>
          <p className="text-sm text-rebanho-muted">Valor de Compra</p>
          <p className="font-medium text-rebanho-text">
            {animal.valorCompra !== null
              ? formatarMoeda(animal.valorCompra)
              : 'Não informado'}
          </p>
        </div>

        <div>
          <p className="text-sm text-rebanho-muted">Observações</p>
          <p className="font-medium text-rebanho-text">
            {animal.observacoes || 'Nenhuma observação'}
          </p>
        </div>
      </div>
      {animal.status === 'VENDIDO' && (
        <div className="mt-6 grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-rebanho-muted">Data da venda</p>
            <p className="font-medium text-rebanho-text">
              {animal.dataSaida
                ? formatarData(animal.dataSaida)
                : 'Não informada'}
            </p>
          </div>

          <div>
            <p className="text-sm text-rebanho-muted">Comprador</p>
            <p className="font-medium text-rebanho-text">
              {animal.comprador || 'Não informado'}
            </p>
          </div>

          <div>
            <p className="text-sm text-rebanho-muted">Valor da venda</p>
            <p className="font-medium text-rebanho-text">
              {animal.valorVenda !== null
                ? formatarMoeda(animal.valorVenda)
                : 'Não informado'}
            </p>
          </div>
        </div>
      )}

      {animal.status === 'MORTO' && (
        <div className="mt-6 grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-rebanho-muted">Data da morte</p>
            <p className="font-medium text-rebanho-text">
              {animal.dataMorte
                ? formatarData(animal.dataMorte)
                : 'Não informada'}
            </p>
          </div>

          <div>
            <p className="text-sm text-rebanho-muted">Causa da morte</p>
            <p className="font-medium text-rebanho-text">
              {animal.causaMorte || 'Não informada'}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
        {animal.status === 'PLANTEL' && (
          <>
            <button
              type="button"
              onClick={() => onVender(animal)}
              className="cursor-pointer rounded-lg bg-rebanho-primary px-4 py-2 text-sm font-medium text-white hover:bg-rebanho-accent"
            >
              Vender
            </button>

            <button
              type="button"
              onClick={() => onRegistrarMorte(animal)}
              className="cursor-pointer rounded-lg bg-rebanho-primary px-4 py-2 text-sm font-medium text-white hover:bg-rebanho-accent"
            >
              Registrar morte
            </button>
          </>
        )}

        {animal.status === 'VENDIDO' && (
          <button
            type="button"
            onClick={() => onVender(animal)}
            className="cursor-pointer rounded-lg bg-rebanho-primary px-4 py-2 text-sm font-medium text-white hover:bg-rebanho-accent"
          >
            Editar venda
          </button>
        )}

        {animal.status === 'MORTO' && (
          <button
            type="button"
            onClick={() => onRegistrarMorte(animal)}
            className="cursor-pointer rounded-lg bg-rebanho-primary px-4 py-2 text-sm font-medium text-white hover:bg-rebanho-accent"
          >
            Editar morte
          </button>
        )}

        {animal.status === 'PLANTEL' && (
          <button
            type="button"
            onClick={() => onEditar(animal)}
            className="cursor-pointer rounded-lg bg-rebanho-primary px-4 py-2 text-sm font-medium text-white hover:bg-rebanho-accent"
          >
            Editar
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            const confirmou = window.confirm(
              `Excluir permanentemente o animal ${animal.brinco}?\n\nTodos os dados deste animal serão removidos. Esta ação não poderá ser desfeita.`,
            );

            if (confirmou) {
              onExcluir(animal);
            }
          }}
          className="ml-auto cursor-pointer rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          Excluir
        </button>

        <button
          type="button"
          onClick={onFechar}
          className="cursor-pointer text-sm text-rebanho-muted hover:text-rebanho-text"
        >
          Fechar
        </button>
      </div>
    </section>
  );
}
