export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  isbn: string;
  price: number;
  discount: number;
  pages: number;
  category: string;
  coverImage?: string;
  images: string[];
  stock: number;
  rating: number;
  totalReviews: number;
  totalSales: number;
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface BookPagination {
  currentPage: number;
  totalPages: number;
  totalBooks: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}