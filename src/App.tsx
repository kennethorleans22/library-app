import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookListPage from './pages/BookListPage'
import BookDetailPage from './pages/BookDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<Layout />}>
        <Route path="/" element={<BookListPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App