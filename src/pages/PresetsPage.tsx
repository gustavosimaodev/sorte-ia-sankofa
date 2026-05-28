import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '@/store/sessionStore'
import { exportarConfiguracoes, importarConfiguracoes } from '@/utils/presetIO'
import { AppHeader } from '@/components/ui/AppHeader'
import { Button }    from '@/components/ui/Button'
import { Badge }     from '@/components/ui/Badge'
import styles from './PresetsPage.module.css'

export function PresetsPage() {
  const navigate  = useNavigate()
  const importRef = useRef<HTMLInputElement>(null)

  const {
    sorteios, atletas,
    configuracoesSalvas,
    salvarConfiguracao, carregarConfiguracao, excluirConfiguracao, adicionarConfiguracoes,
  } = useSessionStore()

  const [incluiEstrutura, setIncluiEstrutura] = useState(true)
  const [incluiFaixa,     setIncluiFaixa]     = useState(true)
  const [incluiAtletas,   setIncluiAtletas]   = useState(atletas.length > 0)
  const [nomeConfig,      setNomeConfig]       = useState('')
  const [importError,     setImportError]      = useState('')

  const handleSalvar = () => {
    const nome = nomeConfig.trim() || `Configuração ${new Date().toLocaleDateString('pt-BR')}`
    salvarConfiguracao(nome, { incluiEstrutura, incluiFaixa, incluiAtletas })
    setNomeConfig('')
  }

  const handleCarregar = (id: string) => {
    carregarConfiguracao(id)
    navigate('/')
  }

  const handleImport = async (file: File) => {
    setImportError('')
    try {
      const configs = await importarConfiguracoes(file)
      adicionarConfiguracoes(configs)
    } catch (e: any) {
      setImportError(e.message)
    }
  }

  const podeSalvar = incluiEstrutura || incluiFaixa || incluiAtletas

  return (
    <div className={styles.page}>
      <AppHeader
        title={<>Configurações <span style={{ color: 'var(--or)' }}>salvas</span></>}
        subtitle="Salve e reutilize configurações de eventos"
        backTo="/"
      />

      <div className={styles.body}>

        {/* Seção 1 — Salvar */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Salvar configuração atual</h2>

          <div className={styles.saveCard}>
            <label className={styles.checkboxRow}>
              <input type="checkbox" checked={incluiEstrutura} onChange={(e) => setIncluiEstrutura(e.target.checked)} />
              <span className={styles.checkLabel}>
                Estrutura dos sorteios <span>({sorteios.length} sorteio{sorteios.length !== 1 ? 's' : ''})</span>
              </span>
            </label>

            <label className={styles.checkboxRow}>
              <input type="checkbox" checked={incluiFaixa} onChange={(e) => setIncluiFaixa(e.target.checked)} />
              <span className={styles.checkLabel}>Faixa de números</span>
            </label>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={incluiAtletas && atletas.length > 0}
                onChange={(e) => setIncluiAtletas(e.target.checked)}
                disabled={atletas.length === 0}
              />
              <span className={styles.checkLabel}>
                Lista de atletas <span>({atletas.length} importadas)</span>
              </span>
            </label>

            <div className={styles.divider} />

            <input
              className={styles.nameInput}
              placeholder="Ex: CCE Maio 2026"
              value={nomeConfig}
              onChange={(e) => setNomeConfig(e.target.value)}
            />

            <Button fullWidth size="md" onClick={handleSalvar} disabled={!podeSalvar}>
              Salvar configuração
            </Button>
          </div>
        </section>

        {/* Seção 2 — Lista */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Configurações salvas</h2>

          {configuracoesSalvas.length === 0 ? (
            <p className={styles.emptyMsg}>Nenhuma configuração salva ainda</p>
          ) : (
            <div className={styles.presetList}>
              {configuracoesSalvas.map((c) => (
                <div key={c.id} className={styles.presetCard}>
                  <div className={styles.presetTop}>
                    <div className={styles.presetInfo}>
                      <span className={styles.presetName}>{c.nome}</span>
                      <span className={styles.presetDate}>
                        {new Date(c.criadaEm).toLocaleDateString('pt-BR', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <button className={styles.deleteBtn} onClick={() => excluirConfiguracao(c.id)} aria-label="Excluir">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                  </div>

                  <div className={styles.badgeRow}>
                    {c.incluiEstrutura && <Badge variant="pink">Estrutura</Badge>}
                    {c.incluiFaixa    && <Badge variant="orange">Faixa</Badge>}
                    {c.incluiAtletas  && <Badge variant="success">Atletas</Badge>}
                  </div>

                  <button className={styles.loadBtn} onClick={() => handleCarregar(c.id)}>
                    Carregar →
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Rodapé fixo */}
      <div className={styles.footer}>
        <div className={styles.footerRow}>
          <Button
            fullWidth size="md" variant="outline"
            onClick={() => exportarConfiguracoes(configuracoesSalvas)}
            disabled={configuracoesSalvas.length === 0}
          >
            Exportar .json
          </Button>
          <Button fullWidth size="md" variant="outline" onClick={() => importRef.current?.click()}>
            Importar .json
          </Button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); e.target.value = '' }}
          />
        </div>
        {importError && <p style={{ color: '#e53e3e', fontSize: 'var(--text-xs)', marginTop: 'var(--sp-xs)', textAlign: 'center' }}>{importError}</p>}
      </div>
    </div>
  )
}
