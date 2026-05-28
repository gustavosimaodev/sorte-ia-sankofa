import { ReactNode } from 'react'
import styles from './Badge.module.css'

type Variant = 'pink' | 'orange' | 'gray' | 'success'

interface BadgeProps {
  variant?: Variant
  children: ReactNode
}

export function Badge({ variant = 'gray', children }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[variant]].join(' ')}>
      {children}
    </span>
  )
}
