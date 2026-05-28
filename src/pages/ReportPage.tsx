import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '@/store/sessionStore'
import { gerarRelatorioPDF } from '@/utils/pdfGenerator'
import { AppHeader } from '@/components/ui/AppHeader'
import { Button }    from '@/components/ui/Button'
import type { ResultadoSorteio } from '@/types'
import styles from './ReportPage.module.css'

function exportCSV(resultados: ResultadoSorteio[], nomeEvento: string) {
  const header = 'Nº,Sorteio,Número de Peito,Atleta,Horário\n'
  const rows   = resultados.map((r: ResultadoSorteio, i: number) =>
    `${i + 1},"${r.nomeSorteio}",${r.numeroPeito},"${r.nomeAtleta ?? ''}",${new Date(r.timestamp).toLocaleTimeString('pt-BR')}`
  ).join('\n')
  const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  const slug = (nomeEvento || 'cce').toLowerCase().replace(/\s+/g, '-')
  a.href = url; a.download = `sorteio-${slug}-${Date.now()}.csv`; a.click()
  URL.revokeObjectURL(url)
}

export function ReportPage() {
  const navigate = useNavigate()
  const store    = useSessionStore()
  const { resultados, nomeEvento, numeroInicial, numeroFinal, sorteios, atletas, resetarSessao } = store

  const handleNovoSorteio = () => {
    resetarSessao()
    navigate('/')
  }

  return (
    <div className={styles.page}>
      <AppHeader
        title={<>Relatório <span style={{ color: 'var(--or)' }}>final</span></>}
        subtitle={nomeEvento || 'Corre Com Elas'}
      />

      <div className={styles.body}>

        {/* Resumo */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statVal}>{resultados.length}</span>
            <span className={styles.statLabel}>sorteios</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statVal}>{atletas.length || '—'}</span>
            <span className={styles.statLabel}>atletas</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statVal}>{numeroFinal - numeroInicial + 1}</span>
            <span className={styles.statLabel}>números</span>
          </div>
        </div>

        {/* Lista de resultados */}
        <div className={styles.resultsCard}>
          <div className={styles.resultsHeader}>
            <span className={styles.resultsTitle}>Resultados</span>
          </div>
          {resultados.length === 0 && (
            <p className={styles.empty}>Nenhum sorteio realizado.</p>
          )}
          {resultados.map((r, i) => (
            <div key={i} className={styles.resultRow}>
              <div className={styles.resultLeft}>
                <span className={styles.badgeGanhador}>GANHADOR</span>
                <span className={styles.resultNumber}>{String(r.numeroPeito).padStart(3, '0')}</span>
                {r.nomeAtleta && (
                  <span className={styles.resultAtleta}>{r.nomeAtleta}</span>
                )}
              </div>
              <div className={styles.resultInfo}>
                <span className={styles.resultPrize}>{r.nomeSorteio}</span>
                {r.desclassificados?.length > 0 && (
                  <span className={styles.resultDesclassificados}>
                    Desclassificados: {[...r.desclassificados].sort((a, b) => a - b).map(n => String(n).padStart(3, '0')).join(', ')}
                  </span>
                )}
              </div>
              <span className={styles.resultTime}>
                {new Date(r.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>

        {/* Ações */}
        <div className={styles.actions}>
          <Button
            fullWidth size="lg"
            onClick={() => gerarRelatorioPDF(
              { id: Date.now().toString(), dataEvento: new Date().toISOString(),
                nomeEvento, numeroInicial, numeroFinal, sorteios, atletas },
              resultados
            )}
          >
            Baixar PDF
          </Button>
          <Button fullWidth size="md" variant="outline"
            onClick={() => exportCSV(resultados, nomeEvento)}>
            Exportar CSV
          </Button>
          <Button fullWidth size="md" variant="ghost" onClick={handleNovoSorteio}>
            Novo sorteio
          </Button>
        </div>

      </div>
    </div>
  )
}
