export interface Book {
    id: string;               // بدل _id
    title: string;
    author: string;
    description: string;
    isbn: string;
    price: number;
    discount: number;
    pages: number;
    category: string;
    coverImage?: string;      // سواء coverImage أو coverImageUrl
    images: string[];
    stock: number;
    rating: number;           // بدل averageRating
    totalReviews: number;
    totalSales: number;
    isNew: boolean;
    isBestseller: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
  }
  