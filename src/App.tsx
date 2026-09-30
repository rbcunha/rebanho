import { useState } from 'react';
import type { Animal } from './types/Animal';
import { animaisIniciais } from './data/animais';
import { AnimalList } from './components/AnimalList';
import { AnimalForm } from './components/AnimalForm';
import { Modal } from './components/Modal';
import { VendaForm } from './components/VendaForm';
import { MorteForm } from './components/MorteForm';
import { formatarMoeda, formatarNumero, textoParaNumero } from './utils/numero';
import { formatarData } from './utils/data';
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

function App() {
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [formulario, setFormulario] = useState(formularioInicial);

  const [animais, setAnimais] = useState<Animal[]>(animaisIniciais);
  const [erroFormulario, setErroFormulario] = useState('');

  const [animalSelecionado, setAnimalSelecionado] = useState<Animal | null>(
    null,
  );

  const [animalEmEdicao, setAnimalEmEdicao] = useState<Animal | null>(null);
  const [animalEmVenda, setAnimalEmVenda] = useState<Animal | null>(null);
  const [animalEmMorte, setAnimalEmMorte] = useState<Animal | null>(null);

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
      peso: formulario.peso ? textoParaNumero(formulario.peso) : null,
      dataEntrada: formulario.dataEntrada,
      origem: formulario.origem || null,
      valorCompra: formulario.valorCompra
        ? textoParaNumero(formulario.valorCompra)
        : null,
      status: 'PLANTEL',
      dataSaida: null,
      comprador: null,
      valorVenda: null,
      dataMorte: null,
      causaMorte: null,
      observacoes: formulario.observacoes || null,
    };

    if (animalEmEdicao) {
      const animalAtualizado: Animal = {
        ...animalEmEdicao,
        brinco: formulario.brinco,
        sexo: formulario.sexo as 'Macho' | 'Fêmea',
        raca: formulario.raca,
        dataNascimento: formulario.dataNascimento || null,
        peso: formulario.peso ? textoParaNumero(formulario.peso) : null,
        dataEntrada: formulario.dataEntrada,
        origem: formulario.origem,
        valorCompra: formulario.valorCompra
          ? textoParaNumero(formulario.valorCompra)
          : null,
        observacoes: formulario.observacoes || null,
      };

      setAnimais(
        animais.map((animal) =>
          animal.id === animalEmEdicao.id ? animalAtualizado : animal,
        ),
      );
      setAnimalSelecionado(animalAtualizado);
    } else {
      setAnimais([...animais, novoAnimal]);
    }

    setFormulario(formularioInicial);
    setFormularioAberto(false);
    setErroFormulario('');
  }

  function fecharFormulario() {
    setFormularioAberto(false);
    setAnimalEmEdicao(null);
    setFormulario(formularioInicial);
    setErroFormulario('');
  }

  function venderAnimal(
    dataVenda: string,
    comprador: string,
    valorVenda: number,
  ) {
    if (!animalEmVenda) return;
    const animalAtualizado: Animal = {
      ...animalEmVenda,
      status: 'VENDIDO',
      dataSaida: dataVenda,
      comprador: comprador || null,
      valorVenda,
    };

    setAnimais(
      animais.map((animal) =>
        animal.id === animalEmVenda.id ? animalAtualizado : animal,
      ),
    );

    setAnimalEmVenda(null);
    setAnimalSelecionado(null);
  }

  function registrarMorte(dataMorte: string, causaMorte: string) {
    if (!animalEmMorte) return;

    const animalAtualizado: Animal = {
      ...animalEmMorte,
      status: 'MORTO',
      dataMorte,
      causaMorte: causaMorte || null,
    };

    setAnimais(
      animais.map((animal) =>
        animal.id === animalEmMorte.id ? animalAtualizado : animal,
      ),
    );

    setAnimalEmMorte(null);
    setAnimalSelecionado(null);
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
            onClick={() => {
              setAnimalEmEdicao(null);
              setFormulario(formularioInicial);
              setErroFormulario('');
              setFormularioAberto(true);
            }}
            className="cursor-pointer rounded-lg bg-slate-800 px-5 py-3 font-medium text-white hover:bg-slate-700"
          >
            + Novo animal
          </button>
        </header>

        {formularioAberto && (
          <Modal onClose={fecharFormulario}>
            <AnimalForm
              formulario={formulario}
              animalEmEdicao={animalEmEdicao}
              erroFormulario={erroFormulario}
              onFormularioChange={setFormulario}
              onSalvar={salvarAnimal}
              onCancelar={fecharFormulario}
            />
          </Modal>
        )}

        {animalEmVenda && (
          <Modal onClose={() => setAnimalEmVenda(null)}>
            <VendaForm
              animal={animalEmVenda}
              onCancelar={() => setAnimalEmVenda(null)}
              onVender={venderAnimal}
            />
          </Modal>
        )}

        {animalEmMorte && (
          <Modal onClose={() => setAnimalEmMorte(null)}>
            <MorteForm
              animal={animalEmMorte}
              onCancelar={() => setAnimalEmMorte(null)}
              onRegistrarMorte={registrarMorte}
            />
          </Modal>
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
                  Sexo: {animalSelecionado.sexo}
                </p>
              </div>

              {animalSelecionado.status === 'PLANTEL' && (
                <>
                  <button
                    type="button"
                    onClick={() => setAnimalEmVenda(animalSelecionado)}
                    className="cursor-pointer rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                  >
                    Vender
                  </button>

                  <button
                    type="button"
                    onClick={() => setAnimalEmMorte(animalSelecionado)}
                    className="cursor-pointer rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                  >
                    Registrar morte
                  </button>
                </>
              )}

              {animalSelecionado.status === 'VENDIDO' && (
                <>
                  <p>
                    <strong>Data da venda:</strong>{' '}
                    {animalSelecionado.dataSaida
                      ? formatarData(animalSelecionado.dataSaida)
                      : 'Não informada'}
                  </p>

                  <p>
                    <strong>Comprador:</strong>{' '}
                    {animalSelecionado.comprador || 'Não informado'}
                  </p>

                  <p>
                    <strong>Valor da venda:</strong>{' '}
                    {animalSelecionado.valorVenda !== null
                      ? formatarMoeda(animalSelecionado.valorVenda)
                      : 'Não informado'}
                  </p>

                  <button
                    type="button"
                    onClick={() => setAnimalEmVenda(animalSelecionado)}
                    className="cursor-pointer rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                  >
                    Editar Venda
                  </button>
                </>
              )}

              {animalSelecionado.status === 'MORTO' && (
                <>
                  <p>
                    <strong>Data da morte:</strong>{' '}
                    {animalSelecionado.dataMorte
                      ? formatarData(animalSelecionado.dataMorte)
                      : 'Não informada'}
                  </p>
                  <p>
                    <strong>Causa da morte:</strong>{' '}
                    {animalSelecionado.causaMorte || 'Não informada'}
                  </p>

                  <button
                    type="button"
                    onClick={() => setAnimalEmMorte(animalSelecionado)}
                    className="cursor-pointer rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                  >
                    Editar morte
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setAnimalEmEdicao(animalSelecionado);

                  setFormulario({
                    brinco: animalSelecionado.brinco,
                    sexo: animalSelecionado.sexo,
                    raca: animalSelecionado.raca,
                    dataNascimento: animalSelecionado.dataNascimento ?? '',
                    peso: animalSelecionado.peso?.toString() ?? '',
                    dataEntrada: animalSelecionado.dataEntrada,
                    origem: animalSelecionado.origem ?? '',
                    valorCompra:
                      animalSelecionado.valorCompra?.toString() ?? '',
                    observacoes: animalSelecionado.observacoes ?? '',
                  });

                  setFormularioAberto(true);
                }}
                className="cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => {
                  setAnimalSelecionado(null);
                  setAnimalEmEdicao(null);
                  setFormulario(formularioInicial);
                  setFormularioAberto(false);
                  setErroFormulario('');
                }}
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
                    ? `${formatarNumero(animalSelecionado.peso)} kg`
                    : 'Não informado'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Nascimento</p>
                <p className="font-medium text-slate-800">
                  {animalSelecionado.dataNascimento
                    ? formatarData(animalSelecionado.dataNascimento)
                    : 'Não informada'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Entrada</p>
                <p className="font-medium text-slate-800">
                  {animalSelecionado.dataEntrada
                    ? formatarData(animalSelecionado.dataEntrada)
                    : 'Não informada'}
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
                    ? formatarMoeda(animalSelecionado.valorCompra)
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
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
