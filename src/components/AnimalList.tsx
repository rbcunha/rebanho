import type { Animal } from '../types/Animal';

type AnimalListProps = {
  animais: Animal[];
  onSelecionar: (animal: Animal) => void;
};

export function AnimalList({ animais, onSelecionar }: AnimalListProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-rebanho-border bg-white shadow-md">
      <table className="w-full text-left">
        <thead className="border-b border-rebanho-border bg-rebanho-background text-sm text-rebanho-text">
          <tr>
            <th className="px-6 py-4">Brinco</th>
            <th className="px-6 py-4">Sexo</th>
            <th className="px-6 py-4">Raça</th>
            <th className="px-6 py-4">Peso</th>
            <th className="px-6 py-4">Entrada</th>
            <th className="px-6 py-4">Situação</th>
          </tr>
        </thead>

        <tbody>
          {animais.map((animal) => (
            <tr
              key={animal.id}
              onClick={() => onSelecionar(animal)}
              className="cursor-pointer border-b border-rebanho-border text-rebanho-text last:border-0 hover:bg-rebanho-background"
            >
              <td className="px-6 py-4 font-medium">{animal.brinco}</td>
              <td className="px-6 py-4">{animal.sexo}</td>
              <td className="px-6 py-4">{animal.raca}</td>
              <td className="px-6 py-4">
                {animal.peso !== null ? `${animal.peso} kg` : '-'}
              </td>
              <td className="px-6 py-4">{animal.dataEntrada}</td>
              <td className="px-6 py-4">
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
    </section>
  );
}
