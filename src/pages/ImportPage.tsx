import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '@/store/sessionStore'
import { parseAtletasFromFile } from '@/utils/xlsxParser'
import { AppHeader } from '@/components/ui/AppHeader'
import { Button }    from '@/components/ui/Button'
import type { Atleta } from '@/types'
import styles from './ImportPage.module.css'

export function ImportPage() {
  const navigate  = useNavigate()
  const { setAtletas } = useSessionStore()
  const inputRef  = useRef<HTMLInputElement>(null)

  const [atletas,   setAtletasLocal] = useState<Atleta[]>([])
  const [fileName,  setFileName]     = useState('')
  const [error,     setError]        = useState('')
  const [loading,   setLoading]      = useState(false)
  const [dragging,  setDragging]     = useState(false)

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx?|csv)$/i)) {
      setError('Formato inválido. Use .xlsx, .xls ou .csv')
      return
    }
    setLoading(true)
    setError('')
    try {
      const resultado = await parseAtletasFromFile(file)
      setAtletasLocal(resultado)
      setFileName(file.name)
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

  const handleConfirmar = () => {
    setAtletas(atletas)
    navigate('/save')
  }

  const handlePular = () => {
    setAtletas([])
    navigate('/save')
  }

  return (
    <div className={styles.page}>
      <AppHeader
        title={<>Importar <span style={{ color: 'var(--or)' }}>atletas</span></>}
        subtitle="Associe número de peito ao nome de cada atleta"
        backTo="/setup"
      />

      <div className={styles.body}>

        <div
          className={[styles.dropZone, dragging ? styles.dragging : '', atletas.length > 0 ? styles.done : ''].join(' ')}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Selecionar planilha de atletas"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            style={{ display: 'none' }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
          <div className={styles.dropIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--pk)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 12 15 15" />
            </svg>
          </div>
          <p className={styles.dropText}>
            {loading ? 'Lendo planilha…' : atletas.length > 0 ? fileName : 'Selecionar planilha'}
          </p>
          <p className={styles.dropSub}>
            {atletas.length > 0 ? `${atletas.length} atletas importadas` : 'formatos: .xlsx · .xls · .csv'}
          </p>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {atletas.length > 0 && (
          <div className={styles.preview}>
            <div className={styles.previewHeader}>
              <span className={styles.previewTitle}>Pré-visualização</span>
              <span className={styles.previewCount}>{atletas.length} atletas</span>
            </div>
            <div className={styles.atletaList}>
              {atletas.slice(0, 6).map((a) => (
                <div key={a.numeroPeito} className={styles.atletaRow}>
                  <span className={styles.atletaNum}>{String(a.numeroPeito).padStart(3, '0')}</span>
                  <span className={styles.atletaNome}>{a.nome}</span>
                </div>
              ))}
              {atletas.length > 6 && (
                <p className={styles.atletaMais}>+ {atletas.length - 6} atletas</p>
              )}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          {atletas.length > 0 ? (
            <Button fullWidth size="lg" onClick={handleConfirmar}>
              Confirmar e iniciar sorteio →
            </Button>
          ) : (
            <Button fullWidth size="lg" loading={loading} onClick={() => inputRef.current?.click()}>
              {loading ? 'Processando…' : 'Selecionar arquivo'}
            </Button>
          )}
          <Button fullWidth size="md" variant="ghost" onClick={handlePular}>
            Usar apenas faixa numérica (sem nomes)
          </Button>
        </div>

      </div>
    </div>
  )
}
