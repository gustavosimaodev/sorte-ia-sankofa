import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import styles from './HomePage.module.css'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <img
          src="/logo-cce.jpeg"
          alt="Corre Com Elas"
          className={styles.logo}
        />
        <h1 className={styles.title}>SORTE.IA<br /><span className={styles.titleAccent}>CCE</span></h1>
        <p className={styles.tagline}>Sorteios auditáveis para o seu evento</p>
      </div>

      <div className={styles.actions}>
        <div className={styles.actionsInner}>
          <Button fullWidth size="lg" onClick={() => navigate('/setup')} style={{ background: 'var(--or)' }}>
            Novo sorteio
          </Button>
          <div className={styles.divider}>ou</div>
          <Button fullWidth size="md" variant="outline" onClick={() => navigate('/load')} style={{ color: 'var(--or)', borderColor: 'var(--or)' }}>
            Importar configuração
          </Button>
        </div>
      </div>
    </div>
  )
}
