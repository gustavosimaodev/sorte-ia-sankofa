// ============================================
// Sorte.ia CCE — Tipos globais
// ============================================

export interface Atleta {
  numeroPeito: number
  nome: string
}

export interface ConfiguracaoSorteio {
  nome: string
  permiteRepeticao: boolean
}

export interface Sessao {
  id: string
  dataEvento: string
  nomeEvento: string
  numeroInicial: number
  numeroFinal: number
  sorteios: ConfiguracaoSorteio[]
  atletas: Atleta[]
}

export interface ResultadoSorteio {
  sorteioIndex: number
  nomeSorteio: string
  numeroPeito: number
  nomeAtleta: string | null
  timestamp: string
  semente: number
  desclassificados: number[]
}

export interface Relatorio {
  sessao: Sessao
  resultados: ResultadoSorteio[]
  geradoEm: string
}

export interface ConfiguracaoSalva {
  id: string
  nome: string
  criadaEm: string
  incluiEstrutura: boolean
  incluiFaixa: boolean
  incluiAtletas: boolean
  nomeEvento?: string
  numeroInicial?: number
  numeroFinal?: number
  sorteios?: ConfiguracaoSorteio[]
  atletas?: Atleta[]
}
