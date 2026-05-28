import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRaffle } from '@/hooks/useRaffle'
import { useSessionStore } from '@/store/sessionStore'
import styles from './DrawPage.module.css'

export function DrawPage() {
  const navigate = useNavigate()
  const { numeroInicial, numeroFinal } = useSessionStore()
  const { configuracaoAtual, sorteioAtual, totalSorteios,
          ultimoResultado, isAnimating, isFinalizado, semNumerosDisponiveis,
          sortear, desclassificar, confirmarGanhador } = useRaffle()
  const { resetarExecucao } = useSessionStore()

  const [displayNum, setDisplayNum] = useState<number | null>(null)

  useEffect(() => {
    if (!isAnimating) {
      setDisplayNum(ultimoResultado?.numeroPeito ?? null)
      return
    }
    const interval = setInterval(() => {
      const range = numeroFinal - numeroInicial + 1
      setDisplayNum(Math.floor(Math.random() * range) + numeroInicial)
    }, 60)
    return () => clearInterval(interval)
  }, [isAnimating, ultimoResultado, numeroInicial, numeroFinal])

  const handleSortear = useCallback(() => {
    if (!ultimoResultado && !isAnimating) sortear()
  }, [ultimoResultado, isAnimating, sortear])

  useEffect(() => {
    if (isFinalizado) navigate('/report')
  }, [isFinalizado, navigate])

  if (!configuracaoAtual) return null

  const progresso = ((sorteioAtual) / totalSorteios) * 100

  return (
    <div className={styles.page}>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <span className={styles.appName}>SORTE.IA · SANKOFA</span>
        <span className={styles.counter}>{sorteioAtual + 1} / {totalSorteios}</span>
      </div>

      {/* Progress */}
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progresso}%` }} />
      </div>

      {/* Prize info */}
      <div className={styles.prizeArea}>
        <p className={styles.prizeLabel}>sorteio {sorteioAtual + 1} de {totalSorteios}</p>
        <h1 className={styles.prizeName}>{configuracaoAtual.nome}</h1>
      </div>

      {/* Number display */}
      <div className={styles.numberArea}>
        <button
          className={[styles.numberRing, isAnimating ? styles.animating : '', ultimoResultado ? styles.revealed : ''].join(' ')}
          onClick={handleSortear}
          disabled={!!ultimoResultado || isAnimating}
          aria-label="Sortear número"
        >
          {displayNum !== null ? (
            <span className={styles.number}>
              {String(displayNum).padStart(3, '0')}
            </span>
          ) : (
            <span className={styles.tapHint}>toque para<br />sortear</span>
          )}
        </button>
      </div>

      {/* Winner info */}
      <div className={[styles.winnerArea, ultimoResultado ? styles.visible : ''].join(' ')}>
        {ultimoResultado?.nomeAtleta && (
          <>
            <p className={styles.winnerLabel}>ganhador(a)</p>
            <p className={styles.winnerName}>{ultimoResultado.nomeAtleta}</p>
          </>
        )}
        {ultimoResultado && !ultimoResultado.nomeAtleta && (
          <p className={styles.winnerLabel}>número sorteado</p>
        )}
        {configuracaoAtual.permiteRepeticao && (
          <span className={styles.repeatBadge}>número pode repetir</span>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {ultimoResultado ? (
          <>
            <p className={styles.presenceLabel}>O ganhador está presente?</p>
            <div className={styles.presenceBtns}>
              <button className={styles.ausenteBtn} onClick={desclassificar}>
                Desclassificado · resortear
              </button>
              <button className={styles.presenteBtn} onClick={confirmarGanhador}>
                {sorteioAtual + 1 >= totalSorteios ? 'Presente · finalizar ✓' : 'Presente · próximo →'}
              </button>
            </div>
          </>
        ) : (
          <>
            {semNumerosDisponiveis && (
              <>
                <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 1.4 }}>
                  Todos os participantes disponíveis foram sorteados ou desclassificados. Clique em Ressortear para incluir participantes já contemplados.
                </p>
                <button className={styles.ausenteBtn} onClick={resetarExecucao}>
                  Ressortear participantes
                </button>
              </>
            )}
            <button
              className={[styles.drawBtn, isAnimating ? styles.drawBtnAnimating : ''].join(' ')}
              onClick={handleSortear}
              disabled={isAnimating || semNumerosDisponiveis}
            >
              {isAnimating ? 'sorteando…' : 'sortear'}
            </button>
          </>
        )}
      </div>

    </div>
  )
}
