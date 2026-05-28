import * as XLSX from 'xlsx'
import type { Atleta } from '@/types'

export async function parseAtletasFromFile(file: File): Promise<Atleta[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data     = new Uint8Array(e.target!.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet    = workbook.Sheets[workbook.SheetNames[0]]
        const rows     = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { header: 1 })

        const atletas: Atleta[] = []

        // Detecta automaticamente qual coluna é número e qual é nome
        // Aceita variações: "número", "num", "peito", "nome", "atleta", "participante"
        const headerRow = rows[0] as unknown as unknown[]
        let colNum = -1
        let colNome = -1

        headerRow.forEach((cell, i) => {
          const h = String(cell).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          if (/num|peito|cod|n\./.test(h)) colNum  = i
          if (/nom|atleta|partic/.test(h)) colNome = i
        })

        // Fallback: assume col 0 = número, col 1 = nome
        if (colNum  === -1) colNum  = 0
        if (colNome === -1) colNome = 1

        for (let i = 1; i < rows.length; i++) {
          const row  = rows[i] as unknown as unknown[]
          const num  = Number(row[colNum])
          const nome = String(row[colNome] ?? '').trim()

          if (!isNaN(num) && num > 0 && nome) {
            atletas.push({ numeroPeito: num, nome })
          }
        }

        resolve(atletas)
      } catch (err) {
        reject(new Error('Erro ao ler a planilha. Verifique o formato do arquivo.'))
      }
    }

    reader.onerror = () => reject(new Error('Erro ao abrir o arquivo.'))
    reader.readAsArrayBuffer(file)
  })
}

export const parseAtletasFromXLSX = parseAtletasFromFile
