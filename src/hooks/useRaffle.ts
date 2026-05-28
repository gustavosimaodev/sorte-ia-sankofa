import { useState, useCallback } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import type { ResultadoSorteio } from '@/types'

export function useRaffle() {
  const {
    numeroInicial, numeroFinal,
    sorteios, sorteioAtual, atletas,
    numerosJaSorteados, registrarResultado, avancarSorteio, excluirNumeroPermanente,
  } = useSessionStore()

  const [isAnimating, setIsAnimating] = useState(false)
  const [ultimoResultado, setUltimoResultado] = useState<ResultadoSorteio | null>(null)
  const [desclassificados, setDesclassificados] = useState<number[]>([])

  const sortear = useCallback((excluirExtras: number[] = []) => {
    if (isAnimating) return
    const configuracao = sorteios[sorteioAtual]
    if (!configuracao) return
    const total   = numeroFinal - numeroInicial + 1
    const excluir = configuracao.permiteRepeticao
      ? excluirExtras
      : [...numerosJaSorteados, ...excluirExtras]
    const disponiveis = Array.from({ length: total }, (_, i) => numeroInicial + i)
      .filter((n) => !excluir.includes(n))
    if (disponiveis.length === 0) return
    const semente = Date.now()
    const numero  = disponiveis[semente % disponiveis.length]
    const atleta  = atletas.find((a) => a.numeroPeito === numero)
    const resultado: ResultadoSorteio = {
      sorteioIndex: sorteioAtual,
      nomeSorteio:  configuracao.nome,
      numeroPeito:  numero,
      nomeAtleta:   atleta?.nome ?? null,
      timestamp:    new Date().toISOString(),
      semente,
      desclassificados: excluirExtras,
    }
    setIsAnimating(true)
    setTimeout(() => {
      setUltimoResultado(resultado)
      setIsAnimating(false)
    }, 2000)
  }, [isAnimating, sorteios, sorteioAtual, atletas, numerosJaSorteados, numeroInicial, numeroFinal])

  const desclassificar = useCallback(() => {
    if (!ultimoResultado) return
    excluirNumeroPermanente(ultimoResultado.numeroPeito)
    const novosDesclassificados = [...desclassificados, ultimoResultado.numeroPeito]
    setDesclassificados(novosDesclassificados)
    setUltimoResultado(null)
    sortear(novosDesclassificados)
  }, [ultimoResultado, desclassificados, sortear, excluirNumeroPermanente])

  const confirmarGanhador = useCallback(() => {
    if (!ultimoResultado) return
    registrarResultado({ ...ultimoResultado, desclassificados: [...desclassificados].sort((a, b) => a - b) })
    avancarSorteio()
    setUltimoResultado(null)
    setDesclassificados([])
  }, [ultimoResultado, desclassificados, registrarResultado, avancarSorteio])

  const avancar = useCallback(() => {
    avancarSorteio()
    setUltimoResultado(null)
    setDesclassificados([])
  }, [avancarSorteio])

  const configuracaoAtual = sorteios[sorteioAtual]
  const isFinalizado      = sorteioAtual >= sorteios.length

  const semNumerosDisponiveis = (() => {
    const cfg = sorteios[sorteioAtual]
    if (!cfg) return false
    const excluir    = cfg.permiteRepeticao ? [] : numerosJaSorteados
    const disponiveis = Array.from(
      { length: numeroFinal - numeroInicial + 1 },
      (_, i) => numeroInicial + i
    ).filter((n) => !excluir.includes(n))
    return disponiveis.length === 0
  })()

  return {
    configuracaoAtual,
    sorteioAtual,
    totalSorteios: sorteios.length,
    ultimoResultado,
    isAnimating,
    isFinalizado,
    semNumerosDisponiveis,
    desclassificados,
    sortear,
    avancar,
    desclassificar,
    confirmarGanhador,
  }
}
