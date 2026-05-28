import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AppHeader.module.css'

interface AppHeaderProps {
  title: ReactNode
  subtitle?: ReactNode
  backTo?: string
  action?: ReactNode
}

export function AppHeader({ title, subtitle, backTo, action }: AppHeaderProps) {
  const navigate = useNavigate()
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        {backTo && (
          <button className={styles.back} onClick={() => navigate(backTo)} aria-label="Voltar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
        )}
        <span className={styles.logo}>SORTE.IA · CCE</span>
        {action && <div className={styles.action}>{action}</div>}
      </div>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  )
}
