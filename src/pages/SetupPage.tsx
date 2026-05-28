import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '@/store/sessionStore'
import { AppHeader } from '@/components/ui/AppHeader'
import { Button }    from '@/components/ui/Button'
import { Input }     from '@/components/ui/Input'
import { Badge }     from '@/components/ui/Badge'
import type { ConfiguracaoSorteio } from '@/types'
import styles from './SetupPage.module.css'

export function SetupPage() {
  const navigate = useNavigate()
  const { setFaixa, setSorteios, setNomeEvento, nomeEvento,
          numeroInicial, numeroFinal, sorteios: sorteiosSalvos } = useSessionStore()

  const [numInicial,      setNumInicial]      = useState(String(numeroInicial))
  const [numFinal,        setNumFinal]        = useState(String(numeroFinal))
  const [nomeEv,          setNomeEv]          = useState(nomeEvento)
  const [erroCapacidade,  setErroCapacidade]  = useState('')
  const [sorteios,        setSorteiosLocal]   = useState<ConfiguracaoSorteio[]>(
    sorteiosSalvos.length > 0 ? sorteiosSalvos : [{ nome: '', permiteRepeticao: false }]
  )

  const adicionarSorteio = () =>
    setSorteiosLocal((s) => [...s, { nome: '', permiteRepeticao: false }])

  const removerSorteio = (i: number) =>
    setSorteiosLocal((s) => s.filter((_, idx) => idx !== i))

  const atualizarSorteio = (i: number, campo: keyof ConfiguracaoSorteio, valor: string | boolean) =>
    setSorteiosLocal((s) => s.map((item, idx) => idx === i ? { ...item, [campo]: valor } : item))

  const handleContinuar = () => {
    const ini = parseInt(numInicial)
    const fin = parseInt(numFinal)
    if (isNaN(ini) || isNaN(fin) || ini >= fin) return
    const totalUnicos  = sorteios.filter((s) => !s.permiteRepeticao).length
    const totalNumeros = fin - ini + 1
    if (totalUnicos > totalNumeros) {
      setErroCapacidade(
        `Você tem ${totalUnicos} sorteio(s) únicos mas apenas ${totalNumeros} números disponíveis na faixa. ` +
        `Reduza os sorteios únicos, amplie a faixa, ou marque alguns sorteios como 'repete'.`
      )
      return
    }
    setErroCapacidade('')
    setSorteios(sorteios.map((s, i) => ({ ...s, nome: s.nome.trim() || `Sorteio ${String(i + 1).padStart(2, '0')}` })))
    setNomeEvento(nomeEv)
    setFaixa(ini, fin)
    setSorteios(sorteios)
    navigate('/import')
  }

  const valido = !isNaN(parseInt(numInicial))
    && !isNaN(parseInt(numFinal))
    && parseInt(numInicial) < parseInt(numFinal)
    && sorteios.length > 0

  return (
    <div className={styles.page}>
      <AppHeader
        title={<>Configurar <span style={{ color: 'var(--or)' }}>sorteio</span></>}
        subtitle="Defina a faixa de números e os prêmios"
        backTo="/"
      />

      <div className={styles.body}>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Evento</h2>
          <Input
            label="Nome do evento"
            placeholder="Ex: Corre Sankofa — Maio 2026"
            value={nomeEv}
            onChange={(e) => setNomeEv(e.target.value)}
          />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Faixa de números</h2>
          <div className={styles.row}>
            <Input
              label="De"
              type="number"
              min={1}
              value={numInicial}
              onChange={(e) => { setNumInicial(e.target.value); setErroCapacidade('') }}
            />
            <Input
              label="Até"
              type="number"
              min={1}
              value={numFinal}
              onChange={(e) => { setNumFinal(e.target.value); setErroCapacidade('') }}
            />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Sorteios</h2>
            <button className={styles.addBtn} onClick={adicionarSorteio}>+ Adicionar</button>
          </div>

          <div className={styles.sorteioList}>
            {sorteios.map((s, i) => (
              <div key={i} className={styles.sorteioCard}>
                <div className={styles.sorteioNum}>{i + 1}</div>
                <div className={styles.sorteioBody}>
                  <input
                    className={styles.sorteioInput}
                    placeholder={`Sorteio ${String(i + 1).padStart(2, '0')}`}
                    value={s.nome}
                    onChange={(e) => { atualizarSorteio(i, 'nome', e.target.value); setErroCapacidade('') }}
                  />
                  <div className={styles.sorteioFooter}>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={s.permiteRepeticao}
                        onChange={(e) => { atualizarSorteio(i, 'permiteRepeticao', e.target.checked); setErroCapacidade('') }}
                      />
                      <span className={styles.toggleTrack} />
                      <span className={styles.toggleLabel}>Número pode repetir</span>
                    </label>
                    <Badge variant={s.permiteRepeticao ? 'orange' : 'pink'}>
                      {s.permiteRepeticao ? 'repete' : 'único'}
                    </Badge>
                  </div>
                </div>
                {sorteios.length > 1 && (
                  <button className={styles.removeBtn} onClick={() => removerSorteio(i)} aria-label="Remover">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {erroCapacidade && (
          <p style={{ color: '#e53e3e', fontSize: 'var(--text-sm)', lineHeight: 1.4 }}>{erroCapacidade}</p>
        )}

        <div className={styles.actions}>
          <Button fullWidth size="lg" onClick={handleContinuar} disabled={!valido}>
            Continuar →
          </Button>
        </div>
      </div>
    </div>
  )
}
