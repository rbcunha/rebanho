import { useState } from 'react';
import type { Animal } from './types/Animal';
import { animaisIniciais } from './data/animais';
import { AnimalList } from './components/AnimalList';
import './App.css';

const formularioInicial = {
  brinco: '',
  sexo: '',
  raca: '',
  dataNascimento: '',
  peso: '',
  dataEntrada: '',
  origem: '',
  valorCompra: '',
  observacoes: '',
};

// const statusLabel = {
//   PLANTEL: 'No plantel',
//   VENDIDO: 'Vendido',
//   MORTO: 'Morto',
// };

function App() {
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [formulario, setFormulario] = useState(formularioInicial);

  const [animais, setAnimais] = useState<Animal[]>(animaisIniciais);
  const [erroFormulario, setErroFormulario] = useState('');

  const [animalSelecionado, setAnimalSelecionado] = useState<Animal | null>(
    null,
  );

  function salvarAnimal() {
    // console.log('salvarAnimal chamado', formulario);

    if (!formulario.brinco || !formulario.sexo || !formulario.dataEntrada) {
      setErroFormulario('Preencha Brinco, Sexo e Data de entrada.');
      return;
    }

    setErroFormulario('');

    const novoAnimal: Animal = {
      id: Date.now(),
      brinco: formulario.brinco,
      sexo: formulario.sexo as 'Macho' | 'Fêmea',
      raca: formulario.raca,
      dataNascimento: formulario.dataNascimento || null,
      peso: formulario.peso ? Number(formulario.peso) : null,
      dataEntrada: formulario.dataEntrada,
      origem: formulario.origem || null,
      valorCompra: formulario.valorCompra
        ? Number(formulario.valorCompra)
        : null,
      status: 'PLANTEL',
      dataSaida: null,
      comprador: null,
      valorVenda: null,
      dataMorte: null,
      causaMorte: null,
      observacoes: formulario.observacoes || null,
    };

    setAnimais([...animais, novoAnimal]);

    setFormulario(formularioInicial);
    setFormularioAberto(false);
    setErroFormulario('');
  }

  const noPlantel = animais.filter(
    (animal) => animal.status === 'PLANTEL',
  ).length;

  const vendidos = animais.filter(
    (animal) => animal.status === 'VENDIDO',
  ).length;
  const mortos = animais.filter((animal) => animal.status === 'MORTO').length;

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 felx items-center justify-between">
          <div>
            <h1 className="p-8 text-3xl font-bold text-slate-800">Bezerros</h1>
            <p className="mt-1 text-slate-500">Controle do Rebanho</p>
          </div>

          <button
            type="button"
            onClick={() => setFormularioAberto(true)}
            className="cursor-pointer rounded-lg bg-slate-800 px-5 py-3 font-medium text-white hover:bg-slate-700"
          >
            + Novo animal
          </button>
        </header>

        {formularioAberto && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800">
              Novo animal
            </h2>

            <div>
              <label
                htmlFor="brinco"
                className="mb-1 block text-sm font-meium text-slate-700"
              >
                Brinco
              </label>

              <input
                id="brinco"
                type="text"
                value={formulario.brinco}
                onChange={(event) =>
                  setFormulario({
                    ...formulario,
                    brinco: event.target.value,
                  })
                }
                className="w-full rounded-lg broder border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="sexo"
                className="mb-1 block text-sm font-meium text-slate-700"
              >
                Sexo
              </label>

              <select
                id="sexo"
                value={formulario.sexo}
                onChange={(event) =>
                  setFormulario({
                    ...formulario,
                    sexo: event.target.value,
                  })
                }
                className="w-full rounded-lg broder border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              >
                <option value="">Selecione</option>
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="raca"
                className="mb-1 block text-sm font-meium text-slate-700"
              >
                Raça
              </label>

              <input
                id="raca"
                type="text"
                value={formulario.raca}
                onChange={(event) =>
                  setFormulario({
                    ...formulario,
                    raca: event.target.value,
                  })
                }
                className="w-full rounded-lg broder border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="dataNascimento"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                {' '}
                Data de nascimento
              </label>

              <input
                id="dataNascimento"
                type="date"
                value={formulario.dataNascimento}
                onChange={(event) =>
                  setFormulario({
                    ...formulario,
                    dataNascimento: event.target.value,
                  })
                }
                className="w-full rounded-lg broder border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
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
                type="number"
                min="0"
                step="0.1"
                value={formulario.peso}
                onChange={(event) =>
                  setFormulario({ ...formulario, peso: event.target.value })
                }
                className="w-full roeunded-lg border border-slate-300 px-3 py-2 outiline-none focus:border-slate-500"
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
                  setFormulario({
                    ...formulario,
                    dataEntrada: event.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label htmlFor="origem">Origem / Fornecedor</label>

              <input
                id="origem"
                type="text"
                value={formulario.origem}
                onChange={(event) =>
                  setFormulario({
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
                {' '}
                Valor de compra (R$)
              </label>

              <input
                id="valorCompra"
                type="number"
                min="0"
                step="0.01"
                value={formulario.valorCompra}
                onChange={(event) =>
                  setFormulario({
                    ...formulario,
                    valorCompra: event.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />
            </div>

            <div className="mt-4">
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
                  setFormulario({
                    ...formulario,
                    observacoes: event.target.value,
                  })
                }
                className="w-full resize-none roudned-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />
            </div>

            {erroFormulario && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {erroFormulario}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormularioAberto(false)}
                className="cursor-pointer rounded-lg border border-slate-300 bg-white px-5 py-2 font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={salvarAnimal}
                className="cursor-pointer rounded-lg bg-slate-800 px-5 py-2 font-medium text-white hover:bg-slate-700"
              >
                Salvar animal
              </button>
            </div>
          </div>
        )}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">No plantel</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">
              {noPlantel}
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Vendidos</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">{vendidos}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Mortos</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">{mortos}</p>
          </div>
        </section>

        <AnimalList animais={animais} onSelecionar={setAnimalSelecionado} />

        {animalSelecionado && (
          <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Animal {animalSelecionado.brinco}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Sexo: {animalSelecionado.status}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAnimalSelecionado(null)}
                className="cursor-pointer text-sem text-slate-500 hover:text-slate-800"
              >
                Fechar
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm text-slate-500">Sexo</p>
                <p className="font-medium text-slate-800">
                  {animalSelecionado.sexo}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Raça</p>
                <p className="font-medium text-slate-800">
                  {animalSelecionado.raca || 'Não informada'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Peso</p>
                <p className="font-medium text-slate-800">
                  {animalSelecionado.peso !== null
                    ? `${animalSelecionado.peso} kg`
                    : 'Não informado'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Nascimento</p>
                <p className="font-medium text-slate-800">
                  {animalSelecionado.dataNascimento || 'Não informada'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Entrada</p>
                <p className="font-medium text-slate-800">
                  {animalSelecionado.dataEntrada}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Origem</p>
                <p className="font-medium text-slate-800">
                  {animalSelecionado.origem || 'Não informada'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Valor de Compra</p>
                <p className="font-medium text-slate-800">
                  {animalSelecionado.valorCompra !== null
                    ? `R$ ${animalSelecionado.valorCompra.toFixed(2)}`
                    : 'Não informada'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Observações</p>
                <p className="font-medium text-slate-800">
                  {animalSelecionado.observacoes || 'Nenhuma observação'}
                </p>
              </div>
            </div>

            <p className="text-slate-600">
              Peso:{' '}
              {animalSelecionado.peso !== null
                ? `${animalSelecionado.peso} Kg`
                : 'Não informado'}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;

