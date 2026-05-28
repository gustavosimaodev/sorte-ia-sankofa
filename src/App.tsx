import { Routes, Route, Navigate } from 'react-router-dom'
import { HomePage }  from '@/pages/HomePage'
import { SetupPage } from '@/pages/SetupPage'
import { LoadPage }  from '@/pages/LoadPage'
import { SavePage }  from '@/pages/SavePage'
import { ImportPage } from '@/pages/ImportPage'
import { DrawPage }   from '@/pages/DrawPage'
import { ReportPage } from '@/pages/ReportPage'

export default function App() {
  return (
    <Routes>
      <Route path="/"       element={<HomePage />} />
      <Route path="/setup"  element={<SetupPage />} />
      <Route path="/load"   element={<LoadPage />} />
      <Route path="/import" element={<ImportPage />} />
      <Route path="/save"   element={<SavePage />} />
      <Route path="/draw"   element={<DrawPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="*"       element={<Navigate to="/" replace />} />
    </Routes>
  )
}
