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
  averageRating: number;
  totalReviews: number;
  totalSales: number;
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  isApproved: boolean;
  pendingDelete?: boolean;
  createdAt: string;
  updatedAt: string;
  reviews: any[];
}

export interface BookPagination {
  currentPage: number;
  totalPages: number;
  totalBooks: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}