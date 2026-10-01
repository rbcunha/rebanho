import { useEffect, useState } from 'react';
import type { Animal } from './types/Animal';
import { AnimalList } from './components/AnimalList';
import { AnimalForm } from './components/AnimalForm';
import { Modal } from './components/Modal';
import { VendaForm } from './components/VendaForm';
import { MorteForm } from './components/MorteForm';
import { formatarMoeda, formatarNumero, textoParaNumero } from './utils/numero';
import { formatarData } from './utils/data';
import {
  conectarBanco,
  listarAnimais,
  inserirAnimal,
  atualizarAnimal,
  atualizarVenda,
  atualizarMorte,
} from './lib/database';
import './App.css';

type Tela = 'dashboard' | 'animais';

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
  const [telaAtual, setTelaAtual] = useState<Tela>('dashboard');

  const [formularioAberto, setFormularioAberto] = useState(false);
  const [formulario, setFormulario] = useState(formularioInicial);

  const [animais, setAnimais] = useState<Animal[]>([]);
  const [erroFormulario, setErroFormulario] = useState('');

  const [animalSelecionado, setAnimalSelecionado] = useState<Animal | null>(
    null,
  );

  const [animalEmEdicao, setAnimalEmEdicao] = useState<Animal | null>(null);
  const [animalEmVenda, setAnimalEmVenda] = useState<Animal | null>(null);
  const [animalEmMorte, setAnimalEmMorte] = useState<Animal | null>(null);

  useEffect(() => {
    async function iniciarBanco() {
      try {
        await conectarBanco();
        const animaisDoBanco = await listarAnimais();
        setAnimais(animaisDoBanco);
      } catch (erro) {
        console.error('Erro ao conectar ao SQLite:', erro);
      }
    }

    iniciarBanco();
  }, []);

  async function salvarAnimal() {
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

      await atualizarAnimal(animalAtualizado);

      setAnimais(
        animais.map((animal) =>
          animal.id === animalEmEdicao.id ? animalAtualizado : animal,
        ),
      );
      setAnimalSelecionado(animalAtualizado);
    } else {
      await inserirAnimal(novoAnimal);
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

  async function venderAnimal(
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

    await atualizarVenda(animalAtualizado);

    setAnimais(
      animais.map((animal) =>
        animal.id === animalEmVenda.id ? animalAtualizado : animal,
      ),
    );

    setAnimalSelecionado(animalAtualizado);
    setAnimalEmVenda(null);
  }

  async function registrarMorte(dataMorte: string, causaMorte: string) {
    if (!animalEmMorte) return;

    const animalAtualizado: Animal = {
      ...animalEmMorte,
      status: 'MORTO',
      dataMorte,
      causaMorte: causaMorte || null,
    };

    await atualizarMorte(animalAtualizado);

    setAnimais(
      animais.map((animal) =>
        animal.id === animalEmMorte.id ? animalAtualizado : animal,
      ),
    );

    setAnimalSelecionado(animalAtualizado);
    setAnimalEmMorte(null);
  }

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
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6 flex gap-3 pt-6">
          <button
            type="button"
            onClick={() => setTelaAtual('dashboard')}
            className="cursor-pointer rounded-lg bg-slate-800 px-4 py-2 text-white"
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => setTelaAtual('animais')}
            className="cursor-pointer rounded-lg bg-slate-800 px-4 py-2 text-white"
          >
            Animais
          </button>
        </nav>

        {telaAtual === 'dashboard' && (
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
        )}

        {telaAtual === 'animais' && (
          <>
            <header className="mb-8 felx items-center justify-between">
              <div>
                <h1 className="p-8 text-3xl font-bold text-slate-800">
                  Bezerros
                </h1>
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

            <AnimalList animais={animais} onSelecionar={setAnimalSelecionado} />

            {animalSelecionado && (
              <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-slate-800">
                      Animal {animalSelecionado.brinco}
                    </h2>

                    <span
                      className={`rounded-full bg-slate-100 px-2 py-1 text-sl font-medium ${
                        animalSelecionado.status === 'PLANTEL'
                          ? 'bg-emerald-100 text-emerald-700'
                          : animalSelecionado.status === 'VENDIDO'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {animalSelecionado.status === 'PLANTEL'
                        ? 'Plantel'
                        : animalSelecionado.status === 'VENDIDO'
                          ? 'Vendido'
                          : 'Morto'}
                    </span>
                  </div>
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

                  {animalSelecionado.status === 'VENDIDO' && (
                    <>
                      <div>
                        <p className="text-sm text-slate-500">Data da venda</p>
                        <p className="font-medium text-slate-800">
                          {animalSelecionado.dataSaida
                            ? formatarData(animalSelecionado.dataSaida)
                            : 'Não informada'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">Comprador</p>
                        <p className="font-medium text-slate-800">
                          {animalSelecionado.comprador || 'Não informado'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">Valor da venda</p>
                        <p className="font-medium text-slate-800">
                          {animalSelecionado.valorVenda !== null
                            ? formatarMoeda(animalSelecionado.valorVenda)
                            : 'Não informado'}
                        </p>
                      </div>
                    </>
                  )}

                  {animalSelecionado.status === 'MORTO' && (
                    <>
                      <div>
                        <p className="text-sm text-slate-500">Data da morte</p>
                        <p className="font-medium text-slate-800">
                          {animalSelecionado.dataMorte
                            ? formatarData(animalSelecionado.dataMorte)
                            : 'Não informada'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">Causa da morte</p>
                        <p className="font-medium text-slate-800">
                          {animalSelecionado.causaMorte || 'Não informada'}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
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
                    <button
                      type="button"
                      onClick={() => setAnimalEmVenda(animalSelecionado)}
                      className="cursor-pointer rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                    >
                      Editar venda
                    </button>
                  )}

                  {animalSelecionado.status === 'MORTO' && (
                    <button
                      type="button"
                      onClick={() => setAnimalEmMorte(animalSelecionado)}
                      className="cursor-pointer rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                    >
                      Editar morte
                    </button>
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
                    className="cursor-pointer text-sm text-slate-500 hover:text-slate-800"
                  >
                    Fechar
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default App;
