import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: any = {};
  selectedImage = '';
  tab: 'description' | 'info' | 'reviews' = 'description';
  quantity: number = 1;
  relatedProducts: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http
        .get(`http://localhost:3000/api/v1/books/${id}`)
        .subscribe((data: any) => {
          console.log(data);
          this.product = data.data.book;
          console.log('product:', this.product);
          // this.selectedImage = this.product.images?.[0];
          this.selectedImage = this.product.coverImage.startsWith('http')
            ? this.product.coverImage
            : `http://localhost:3000/${this.product.coverImage}`;
          this.loadRelated(this.product.category);
        });
    }
  }

  changeImage(img: string) {
    this.selectedImage = img;
  }

  buyNow() {
    alert(
      `✅ You are buying ${this.quantity} × "${this.product.title}" for $${
        this.product.price * this.quantity
      }`
    );
  }

  addToWishlist() {
    alert(`❤️ "${this.product.title}" has been added to your wishlist!`);
  }

  loadRelated(category: string) {
    this.http
      .get(`http://localhost:3000/api/v1/books?category=${category}&limit=4`)
      .subscribe((res: any) => {
        // this.relatedProducts = res.data.filter(
        //   (p: any) => p._id !== this.product._id
        // );
        //   if (Array.isArray(res.data)) {
        //     this.relatedProducts = res.data.filter(
        //       (p: any) => p._id !== this.product._id
        //     );
        //   } else {
        //     this.relatedProducts = [];
        //   }
        // });
        if (Array.isArray(res.data.books)) {
          this.relatedProducts = res.data.books.filter(
            (p: any) => p._id !== this.product._id
          );
        } else {
          this.relatedProducts = [];
        }
      });
  }
}
