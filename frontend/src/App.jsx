import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HashGenerator from './pages/HashGenerator'
import HashVerifier from './pages/HashVerifier'
import FileHasher from './pages/FileHasher'
import AlgorithmInfo from './pages/AlgorithmInfo'
import History from './pages/History'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HashGenerator />} />
        <Route path="/verifier" element={<HashVerifier />} />
        <Route path="/file-hasher" element={<FileHasher />} />
        <Route path="/info" element={<AlgorithmInfo />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  )
}
