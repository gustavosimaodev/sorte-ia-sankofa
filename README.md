# Sorte.ia CCE

App de sorteio ao vivo para eventos do **Corre Com Elas Running Club**.

Progressive Web App (PWA) — roda no navegador, instala no iPhone e funciona offline.

🔗 **Produção:** https://sorte-ia-cce.vercel.app

---

## Funcionalidades

- Configuração de faixa numérica e múltiplos sorteios com nomes personalizados
- Importação de planilha de participantes (.xlsx, .xls, .csv)
- Sorteio com animação e confirmação de presença
- Desclassificação com resorteio automático
- Relatório final em PDF e CSV com auditoria de desclassificados
- Configurações salvas com export/import JSON entre dispositivos
- Validação de capacidade (sorteios únicos vs participantes disponíveis)

## Fluxo principal

```
Tela inicial → Configurar sorteio → Importar participantes → Salvar configuração → Sortear → Relatório
```

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite + PWA |
| Estado | Zustand |
| Roteamento | React Router v6 |
| Planilhas | SheetJS (xlsx) |
| PDF | jsPDF + autoTable |
| Deploy | Vercel |

## Rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

## Versionamento

Seguindo [Semantic Versioning](https://semver.org/lang/pt-BR/). Consulte o [CHANGELOG.md](./CHANGELOG.md) para o histórico completo.

Versão atual: **0.5.1**

---

*Desenvolvido para o Corre Com Elas Running Club*
