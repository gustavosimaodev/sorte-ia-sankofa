import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Atleta, ConfiguracaoSorteio, ResultadoSorteio, ConfiguracaoSalva } from '@/types'

interface SessionState {
  // Configuração
  nomeEvento: string
  numeroInicial: number
  numeroFinal: number
  sorteios: ConfiguracaoSorteio[]
  atletas: Atleta[]

  // Execução
  sorteioAtual: number
  resultados: ResultadoSorteio[]
  numerosJaSorteados: number[]

  // Actions — configuração
  setNomeEvento: (nome: string) => void
  setFaixa: (inicial: number, final: number) => void
  setSorteios: (sorteios: ConfiguracaoSorteio[]) => void
  setAtletas: (atletas: Atleta[]) => void

  // Actions — execução
  registrarResultado: (resultado: ResultadoSorteio) => void
  avancarSorteio: () => void
  resetarSessao: () => void
  resetarExecucao: () => void
  excluirNumeroPermanente: (numero: number) => void

  // Configurações salvas
  configuracoesSalvas: ConfiguracaoSalva[]
  salvarConfiguracao: (nome: string, opcoes: { incluiEstrutura: boolean; incluiFaixa: boolean; incluiAtletas: boolean }) => void
  carregarConfiguracao: (id: string) => void
  excluirConfiguracao: (id: string) => void
  adicionarConfiguracoes: (novas: ConfiguracaoSalva[]) => void
}

const initialState = {
  nomeEvento: '',
  numeroInicial: 1,
  numeroFinal: 500,
  sorteios: [] as ConfiguracaoSorteio[],
  atletas: [] as Atleta[],
  sorteioAtual: 0,
  resultados: [] as ResultadoSorteio[],
  numerosJaSorteados: [] as number[],
  configuracoesSalvas: [] as ConfiguracaoSalva[],
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setNomeEvento: (nomeEvento) => set({ nomeEvento }),
      setFaixa: (numeroInicial, numeroFinal) => set({ numeroInicial, numeroFinal }),
      setSorteios: (sorteios) => set({ sorteios }),
      setAtletas: (atletas) => set({ atletas }),

      registrarResultado: (resultado) => {
        const { resultados, numerosJaSorteados, sorteios, sorteioAtual } = get()
        const permiteRepeticao = sorteios[sorteioAtual]?.permiteRepeticao ?? false
        set({
          resultados: [...resultados, resultado],
          numerosJaSorteados: permiteRepeticao
            ? numerosJaSorteados
            : [...numerosJaSorteados, resultado.numeroPeito],
        })
      },

      avancarSorteio: () => set((s) => ({ sorteioAtual: s.sorteioAtual + 1 })),

      resetarExecucao: () => set({ numerosJaSorteados: [] }),

      excluirNumeroPermanente: (numero) => set((s) => ({
        numerosJaSorteados: s.numerosJaSorteados.includes(numero)
          ? s.numerosJaSorteados
          : [...s.numerosJaSorteados, numero],
      })),

      resetarSessao: () => set((s) => ({ ...initialState, configuracoesSalvas: s.configuracoesSalvas })),

      salvarConfiguracao: (nome, { incluiEstrutura, incluiFaixa, incluiAtletas }) => set((s) => {
        const config: ConfiguracaoSalva = {
          id: String(Date.now()),
          nome,
          criadaEm: new Date().toISOString(),
          incluiEstrutura,
          incluiFaixa,
          incluiAtletas,
          ...(incluiEstrutura && { sorteios: s.sorteios, nomeEvento: s.nomeEvento }),
          ...(incluiFaixa    && { numeroInicial: s.numeroInicial, numeroFinal: s.numeroFinal }),
          ...(incluiAtletas  && { atletas: s.atletas }),
        }
        return { configuracoesSalvas: [config, ...s.configuracoesSalvas] }
      }),

      carregarConfiguracao: (id) => set((s) => {
        const config = s.configuracoesSalvas.find((c) => c.id === id)
        if (!config) return {}
        return {
          ...(config.incluiEstrutura && { sorteios: config.sorteios ?? [], nomeEvento: config.nomeEvento ?? s.nomeEvento }),
          ...(config.incluiFaixa    && { numeroInicial: config.numeroInicial, numeroFinal: config.numeroFinal }),
          ...(config.incluiAtletas  && { atletas: config.atletas ?? [] }),
          sorteioAtual: 0,
          resultados: [],
          numerosJaSorteados: [],
        }
      }),

      excluirConfiguracao: (id) => set((s) => ({
        configuracoesSalvas: s.configuracoesSalvas.filter((c) => c.id !== id),
      })),

      adicionarConfiguracoes: (novas) => set((s) => {
        const ids = new Set(s.configuracoesSalvas.map((c) => c.id))
        return { configuracoesSalvas: [...s.configuracoesSalvas, ...novas.filter((c) => !ids.has(c.id))] }
      }),
    }),
    { name: 'sorte-ia-sankofa-session' }
  )
)
