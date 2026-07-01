// "Amplop" pembungkus semua balasan API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Author {
  id: number;
  name: string;
  bio: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  availableCopies: number;
  totalCopies: number;
  authorId: number;
  categoryId: number;
  author: Author;
  category: Category;
}

// Bentuk isi "data" saat ambil daftar buku
export interface BooksResponse {
  books: Book[];
}


export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  profilePhoto: string;
  role: "ADMIN" | "USER";
}