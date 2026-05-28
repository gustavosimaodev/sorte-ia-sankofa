import type { ConfiguracaoSalva } from '@/types'

export function exportarConfiguracoes(configs: ConfiguracaoSalva[]): void {
  const payload = { app: 'sorte-ia-cce', versao: '1.0', exportadoEm: new Date().toISOString(), configs }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `configuracoes-cce-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importarConfiguracoes(file: File): Promise<ConfiguracaoSalva[]> {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.json')) { reject(new Error('Selecione um arquivo .json')); return }
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target!.result as string)
        if (data.app !== 'sorte-ia-cce' || !Array.isArray(data.configs)) {
          reject(new Error('Arquivo inválido ou de outro app')); return
        }
        resolve(data.configs)
      } catch { reject(new Error('Erro ao ler o arquivo')) }
    }
    reader.onerror = () => reject(new Error('Erro ao abrir o arquivo'))
    reader.readAsText(file)
  })
}
