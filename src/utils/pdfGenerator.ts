import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { ResultadoSorteio, Sessao } from '@/types'

export function gerarRelatorioPDF(sessao: Sessao, resultados: ResultadoSorteio[]) {
  const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pk   = [240, 180, 41]  as [number, number, number]
  const or   = [192, 57,  43]  as [number, number, number]
  const dark = [17,  17,  17]  as [number, number, number]
  const gray = [120, 120, 120] as [number, number, number]

  const W = doc.internal.pageSize.getWidth()

  // --- Header ---
  doc.setFillColor(...pk)
  doc.rect(0, 0, W, 42, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(17, 17, 17)
  doc.setCharSpace(1.5)
  doc.text('CORRE SANKOFA', 14, 14)
  doc.setCharSpace(0)

  doc.setFontSize(22)
  doc.text('SORTE.IA SANKOFA', 14, 26)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(17, 17, 17)
  doc.text(`Evento: ${sessao.nomeEvento || 'Corre Sankofa'}`, 14, 35)
  doc.text(`Faixa: ${sessao.numeroInicial}-${sessao.numeroFinal}  ·  Sorteios: ${resultados.length}`, 100, 35)

  // --- Info strip ---
  const dataGerado = new Date().toLocaleString('pt-BR')
  doc.setFillColor(245, 245, 245)
  doc.rect(0, 42, W, 10, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...gray)
  doc.text(`Gerado em: ${dataGerado}`, 14, 48.5)
  doc.text(`Total de atletas na base: ${sessao.atletas.length}`, W - 14, 48.5, { align: 'right' })

  // --- Tabela de resultados ---
  autoTable(doc, {
    startY: 58,
    head: [['#', 'Sorteio', 'No Peito', 'Atleta', 'Desclassificados', 'Horario']],
    body: resultados.map((r, i) => [
      i + 1,
      r.nomeSorteio,
      String(r.numeroPeito).padStart(3, '0'),
      r.nomeAtleta ?? '-',
      r.desclassificados?.length
        ? [...r.desclassificados].sort((a, b) => a - b).map(n => String(n).padStart(3, '0')).join(', ')
        : '-',
      new Date(r.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    ]),
    headStyles: {
      fillColor: pk,
      textColor: [17, 17, 17],
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: { top: 5, bottom: 5, left: 6, right: 6 },
    },
    bodyStyles: {
      textColor: dark,
      fontSize: 9,
      cellPadding: { top: 4, bottom: 4, left: 6, right: 6 },
    },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      2: { cellWidth: 22, halign: 'center', fontStyle: 'bold', textColor: pk },
      4: { textColor: or },
      5: { cellWidth: 28, halign: 'right', textColor: gray },
    },
    margin: { left: 14, right: 14 },
  })

  // --- Tabela de auditoria de desclassificados ---
  const comDesclassificados = resultados.filter((r) => r.desclassificados?.length > 0)
  if (comDesclassificados.length > 0) {
    const auditY = (doc as any).lastAutoTable.finalY + 10
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...gray)
    doc.setCharSpace(1)
    doc.text('DESCLASSIFICADOS (AUDITORIA)', 14, auditY)
    doc.setCharSpace(0)
    autoTable(doc, {
      startY: auditY + 4,
      head: [['Sorteio', 'Numeros Desclassificados']],
      body: comDesclassificados.map((r) => [
        r.nomeSorteio,
        [...r.desclassificados].sort((a, b) => a - b).map((n) => String(n).padStart(3, '0')).join(', '),
      ]),
      headStyles: {
        fillColor: or,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        cellPadding: { top: 5, bottom: 5, left: 6, right: 6 },
      },
      bodyStyles: {
        textColor: dark,
        fontSize: 9,
        cellPadding: { top: 4, bottom: 4, left: 6, right: 6 },
      },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      columnStyles: { 1: { textColor: or } },
      margin: { left: 14, right: 14 },
    })
  }

  // --- Footer ---
  const finalY = (doc as any).lastAutoTable.finalY + 10
  doc.setFillColor(...or)
  doc.setDrawColor(...or)
  doc.roundedRect(14, finalY, W - 28, 14, 3, 3, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  doc.setCharSpace(1)
  doc.text('SORTE.IA · RESULTADOS AUDITAVEIS · CORRE SANKOFA', W / 2, finalY + 8.5, { align: 'center' })

  doc.save(`sorteio-sankofa-${Date.now()}.pdf`)
}
