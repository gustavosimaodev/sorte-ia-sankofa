import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '@/store/sessionStore'
import { importarConfiguracoes } from '@/utils/presetIO'
import { AppHeader } from '@/components/ui/AppHeader'
import { Button }    from '@/components/ui/Button'
import styles from './LoadPage.module.css'

export function LoadPage() {
  const navigate = useNavigate()
  const { setNomeEvento, setFaixa, setSorteios, setAtletas } = useSessionStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const [loading,  setLoading]  = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error,    setError]    = useState('')

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.json')) { setError('Selecione um arquivo .json'); return }
    setLoading(true)
    setError('')
    try {
      const configs = await importarConfiguracoes(file)
      if (configs.length === 0) throw new Error('Nenhuma configuração encontrada no arquivo')
      const c = configs[0]
      if (c.incluiEstrutura) {
        if (c.sorteios)   setSorteios(c.sorteios)
        if (c.nomeEvento) setNomeEvento(c.nomeEvento)
      }
      if (c.incluiFaixa && c.numeroInicial != null && c.numeroFinal != null) {
        setFaixa(c.numeroInicial, c.numeroFinal)
      }
      if (c.incluiAtletas && c.atletas) setAtletas(c.atletas)
      navigate('/setup')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className={styles.page}>
      <AppHeader
        title={<>Importar <span style={{ color: 'var(--or)' }}>configuração</span></>}
        subtitle="Carregue um arquivo exportado do SORTE.IA Sankofa"
        backTo="/"
      />

      <div className={styles.body}>
        <p className={styles.hint}>Selecione um arquivo <strong>.json</strong> exportado pelo app</p>

        <div
          className={[styles.dropZone, dragging ? styles.dragging : ''].join(' ')}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Selecionar arquivo de configuração"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
          />
          <div className={styles.dropIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--or)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 12 15 15" />
            </svg>
          </div>
          <p className={styles.dropText}>{loading ? 'Lendo arquivo…' : 'Selecionar arquivo .json'}</p>
          <p className={styles.dropSub}>arraste ou clique para selecionar</p>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <Button fullWidth size="lg" loading={loading} onClick={() => inputRef.current?.click()}>
            {loading ? 'Processando…' : 'Selecionar arquivo'}
          </Button>
        </div>
      </div>
    </div>
  )
}
