# Changelog — Sorte.ia CCE

Versionamento: **Major.Minor.Patch** — [semver.org](https://semver.org/lang/pt-BR/)

---

## [0.5.1] — 2026-05-03

### Corrigido
- Erros de TypeScript para build na Vercel (CSS modules, tipos implícitos, setAlpha do jsPDF)
- Criado src/vite-env.d.ts com referência ao cliente Vite

---

## [0.5.0] — 2026-05-03

### Adicionado
- Tela inicial (HomePage) com logo do Corre Com Elas, botões em laranja
- LoadPage — importação de configuração salva via arquivo .json
- SavePage — opção de salvar configuração antes de iniciar o sorteio
- Botão "Ressortear participantes" ao esgotar números disponíveis
- Nomes das atletas exibidos no relatório junto ao número sorteado
- Tabela de desclassificados para auditoria no relatório PDF

### Alterado
- Fluxo de navegação: / → /setup → /import → /save → /draw → /report
- Fluxo alternativo: / → /load → /setup → /import → /save → /draw → /report
- Botões da tela inicial com cor laranja para contraste

---

## [0.4.0] — 2026-05-03

### Adicionado
- Configurações salvas (presets) com escolha do que incluir: estrutura, faixa e/ou atletas
- Export/import JSON para transferência entre dispositivos
- Validação de capacidade: bloqueia sorteios únicos que excedem a faixa disponível
- Página /presets para gerenciamento de configurações salvas

---

## [0.2.0] — 2026-05-03

### Adicionado
- Importação de planilha: suporte a .xlsx, .xls e .csv
- Detecção automática de colunas (número de peito e nome)
- Pré-visualização das atletas importadas antes de confirmar
- Opção de sortear apenas pela faixa numérica sem planilha

---

## [0.1.3] — 2026-05-03

### Adicionado
- Resorteio por desclassificação com ganhador registrado apenas ao confirmar presença
- Desclassificados consolidados e ordenados no relatório
- Tabela de auditoria no PDF com todos os desclassificados por sorteio

### Corrigido
- Desclassificados reapareciam incorretamente em sorteios únicos seguintes

---

## [0.1.2] — 2026-05-03

### Adicionado
- Botões de confirmação após cada sorteio: "Desclassificado" e "Presente"

---

## [0.1.1] — 2026-05-03

### Adicionado
- Placeholder automático: "Sorteio 01", "Sorteio 02" etc.
- Nome do placeholder aplicado automaticamente se campo ficar vazio

---

## [0.1.0] — 2026-05-03

### Adicionado
- Fluxo base: Setup → Sorteio → Relatório
- Configuração de faixa numérica e múltiplos sorteios
- Animação de número rolando antes de revelar o sorteado
- Relatório com PDF e CSV
- Design system com tokens CSS, Syne + DM Sans
- PWA para instalação no iPhone e uso offline
