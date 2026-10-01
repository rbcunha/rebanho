import { useEffect, useState } from 'react';
import type { Animal } from './types/Animal';
import { AnimalList } from './components/AnimalList';
import { AnimalForm } from './components/AnimalForm';
import { Modal } from './components/Modal';
import { VendaForm } from './components/VendaForm';
import { MorteForm } from './components/MorteForm';
import { textoParaNumero } from './utils/numero';
import {
  conectarBanco,
  listarAnimais,
  inserirAnimal,
  atualizarAnimal,
  atualizarVenda,
  atualizarMorte,
  excluirAnimal,
} from './lib/database';
import { AnimalDetails } from './components/AnimalDetails';
import { Dashboard } from './components/Dashboard';
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

  function editarAnimal(animal: Animal) {
    setAnimalEmEdicao(animal);

    setFormulario({
      brinco: animal.brinco,
      sexo: animal.sexo,
      raca: animal.raca,
      dataNascimento: animal.dataNascimento ?? '',
      peso: animal.peso?.toString() ?? '',
      dataEntrada: animal.dataEntrada,
      origem: animal.origem ?? '',
      valorCompra: animal.valorCompra?.toString() ?? '',
      observacoes: animal.observacoes ?? '',
    });

    setFormularioAberto(true);
  }

  function fecharDetalhesAnimal() {
    setAnimalSelecionado(null);
    setAnimalEmEdicao(null);
    setFormulario(formularioInicial);
    setFormularioAberto(false);
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

  async function removerAnimal(animal: Animal) {
    await excluirAnimal(animal.id);

    setAnimais((animaisAtuais) =>
      animaisAtuais.filter((item) => '== animal.id'),
    );

    setAnimalSelecionado(null);
    setAnimalEmEdicao(null);
    setAnimalEmVenda(null);
    setAnimalEmMorte(null);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6 flex gap-3 pt-6">
          {telaAtual === 'dashboard' && (
            <button
              type="button"
              onClick={() => setTelaAtual('animais')}
              className="cursor-pointer rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
            >
              Animais
            </button>
          )}

          {telaAtual === 'animais' && (
            <button
              type="button"
              onClick={() => setTelaAtual('dashboard')}
              className="cursor-pointer rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
            >
              Dashboard
            </button>
          )}
        </nav>

        {telaAtual === 'dashboard' && <Dashboard animais={animais} />}

        {telaAtual === 'animais' && (
          <>
            <header className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Controle do Rebanho
                </h1>
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
              <AnimalDetails
                animal={animalSelecionado}
                onEditar={editarAnimal}
                onVender={setAnimalEmVenda}
                onRegistrarMorte={setAnimalEmMorte}
                onFechar={fecharDetalhesAnimal}
                onExcluir={removerAnimal}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default App;
