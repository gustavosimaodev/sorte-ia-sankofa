import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '@/store/sessionStore'
import { exportarConfiguracoes } from '@/utils/presetIO'
import { AppHeader } from '@/components/ui/AppHeader'
import { Button }    from '@/components/ui/Button'
import styles from './SavePage.module.css'

export function SavePage() {
  const navigate = useNavigate()
  const { sorteios, atletas, salvarConfiguracao } = useSessionStore()

  const [incluiEstrutura, setIncluiEstrutura] = useState(true)
  const [incluiFaixa,     setIncluiFaixa]     = useState(true)
  const [incluiAtletas,   setIncluiAtletas]   = useState(atletas.length > 0)
  const [nomeConfig,      setNomeConfig]       = useState('')

  const handleSalvar = () => {
    const nome = nomeConfig.trim() || `Configuração ${new Date().toLocaleDateString('pt-BR')}`
    salvarConfiguracao(nome, { incluiEstrutura, incluiFaixa, incluiAtletas })
    const salva = useSessionStore.getState().configuracoesSalvas[0]
    exportarConfiguracoes([salva])
    navigate('/draw')
  }

  return (
    <div className={styles.page}>
      <AppHeader
        title={<>Salvar <span style={{ color: 'var(--or)' }}>configuração</span></>}
        subtitle="Opção: guarde esta configuração para reutilizar"
        backTo="/import"
      />

      <div className={styles.body}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>O que deseja salvar?</h2>

          <div className={styles.card}>
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
              placeholder="Ex: Sankofa Maio 2026"
              value={nomeConfig}
              onChange={(e) => setNomeConfig(e.target.value)}
            />
          </div>
        </section>

        <div className={styles.actions}>
          <Button fullWidth size="lg" onClick={handleSalvar}>
            Salvar e iniciar sorteio →
          </Button>
          <Button fullWidth size="md" variant="ghost" onClick={() => navigate('/draw')}>
            Pular, iniciar sem salvar
          </Button>
        </div>
      </div>
    </div>
  )
}
