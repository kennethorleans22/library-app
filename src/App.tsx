import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
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
    </Routes>
  );
}

export default App;
