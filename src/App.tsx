import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAdmin from './components/admin/RequireAdmin';
import AdminLayout from './components/admin/AdminLayout';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import CategoryPage from './pages/CategoryPage';
import AuthorBooksPage from './pages/AuthorBooksPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import BorrowSuccessPage from './pages/BorrowSuccessPage';
import LoansPage from './pages/LoansPage';
import ProfilePage from './pages/ProfilePage';
import ReviewsPage from './pages/ReviewsPage';
import AdminLoansPage from './pages/admin/AdminLoansPage';
import AdminBooksPage from './pages/admin/AdminBooksPage';
import AdminPlainLayout from './components/admin/AdminPlainLayout';
import AdminBookPreviewPage from './pages/admin/AdminBookPreviewPage';
import AddBookPage from './pages/admin/AddBookPage';
import EditBookPage from './pages/admin/EditBookPage';

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

      {/* ===== Area USER (navbar + footer) ===== */}
      <Route element={<Layout />}>
        <Route path='/' element={<BookListPage />} />
        <Route path='/category' element={<CategoryPage />} />
        <Route path='/books/:id' element={<BookDetailPage />} />
        <Route path='/authors/:id' element={<AuthorBooksPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        <Route path='/borrow-success' element={<BorrowSuccessPage />} />
        <Route path='/loans' element={<LoansPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/reviews' element={<ReviewsPage />} />
      </Route>

      {/* ===== Area ADMIN dengan TAB ===== */}
      <Route
        path='/admin'
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to='/admin/user' replace />} />
        <Route path='user' element={<AdminUsersPage />} />
        <Route path='loans' element={<AdminLoansPage />} />
        <Route path='books' element={<AdminBooksPage />} />
      </Route>

      {/* ===== Area ADMIN tanpa tab (Preview, Add, Edit) ===== */}
      <Route
        element={
          <RequireAdmin>
            <AdminPlainLayout />
          </RequireAdmin>
        }
      >
        <Route path='/admin/books/new' element={<AddBookPage />} />
        <Route path='/admin/books/:id/edit' element={<EditBookPage />} />
        <Route path='/admin/books/:id/preview' element={<AdminBookPreviewPage />} />
      </Route>
    </Routes>
  );
}

export default App;