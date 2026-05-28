# CCE Inscrições — Especificação do Projeto

Plataforma de inscrições para eventos do Corre Com Elas Running Club.
Projeto separado do Sorte.ia CCE, com integração planejada entre os dois.

**Status:** Aguardando estabilização do Sorte.ia CCE
**Prioridade:** Iniciar após v1.0.0 do Sorte.ia

---

## Premissas

- 100% gratuito para a organização (sem mensalidades ou taxas fixas)
- Pagamento via Mercado Pago — cobra apenas % por transação, sem custo fixo
- Hospedagem Vercel + Supabase free tier
- Design system compartilhado com o Sorte.ia CCE (mesmas cores, fontes e tokens)
- Projetos separados, mas com integração planejada

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React + Vite + TypeScript |
| Backend/DB | Supabase (PostgreSQL + Auth + Storage) |
| Pagamento | Mercado Pago SDK |
| E-mail | Resend (free tier — 3.000 e-mails/mês) |
| Deploy | Vercel |

---

## Funcionalidades

### Para a atleta
- Página pública do evento com descrição, data, local, lotes e valor
- Formulário de inscrição:
  - Nome completo, CPF, e-mail, telefone
  - Contato de emergência (nome e telefone)
  - Categoria por ritmo (ex: até 6min/km, 6–7min/km, acima de 7min/km)
  - Tamanho do kit/camiseta (P, M, G, GG, GGG)
- Pagamento via Pix ou cartão (Mercado Pago)
- Confirmação automática por e-mail com número de peito
- Página de consulta de inscrição por CPF ou e-mail

### Para a organizadora (painel admin)
- Login seguro via Supabase Auth
- Dashboard com totais: inscritos, pagamentos confirmados, pendentes
- Lista completa de inscritos com filtros por categoria, kit e status
- Gerenciamento de lotes (datas e valores por lote)
- Encerrar inscrições manualmente
- Exportar lista em CSV/XLSX no formato compatível com o Sorte.ia CCE
- Enviar e-mail em massa para inscritos

---

## Integração com Sorte.ia CCE

### Fase 1 (exportação manual)
- Exportar lista do CCE Inscrições já no formato que o Sorte.ia lê
- Duas colunas: número de peito e nome
- Compatível com a tela de importação de planilha do Sorte.ia

### Fase 2 (integração direta)
- Botão "Importar do CCE Inscrições" na tela de importação do Sorte.ia
- Autenticação compartilhada entre os dois sistemas
- Número de peito gerado na inscrição vai direto para o sorteio sem planilha
- API REST no Supabase exposta para o Sorte.ia consumir

---

## Modelo de dados (esboço)

```
eventos { id, nome, data, local, descricao, valor_lote_atual, inscricoes_abertas }
lotes   { id, evento_id, nome, valor, data_inicio, data_fim, vagas }
inscricoes {
  id, evento_id, lote_id,
  nome, cpf, email, telefone,
  contato_emergencia_nome, contato_emergencia_tel,
  categoria, tamanho_kit,
  numero_peito,
  status_pagamento (pendente | confirmado | cancelado),
  criado_em
}
pagamentos { id, inscricao_id, metodo, valor, id_mercadopago, status, criado_em }
```

---

## Repositório futuro

- Nome sugerido: `cce-inscricoes`
- GitHub: github.com/gustavosimaodev/cce-inscricoes
- Deploy: cce-inscricoes.vercel.app

---

*Documento criado em 03/05/2026 — aguardando v1.0.0 do Sorte.ia CCE para iniciar*
