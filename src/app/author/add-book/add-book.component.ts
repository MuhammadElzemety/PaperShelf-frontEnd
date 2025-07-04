import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  addBookForm: FormGroup;
  coverImageFile: File | null = null;
  coverImagePreview: string | null = null;
  additionalImageFiles: File[] = [];
  additionalImagePreviews: string[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  bookId: string | null = null;
  isEditMode: boolean = false;

  categories: string[] = ['Fiction', 'Science', 'History', 'Children', 'Other'];
  customCategory: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private bookService: BookService
  ) {
    this.addBookForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      isbn: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      pages: [0, [Validators.min(0)]],
      category: ['', Validators.required],
      coverImage: ['', Validators.required],
      images: [[]],
      stock: [1, [Validators.required, Validators.min(1)]],
      isNew: [false],
      isBestseller: [false],
      isFeatured: [false]
    });
  }

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id');
    if (this.bookId) {
      this.isEditMode = true;
      this.loadBookData(this.bookId);
    }
  }

  onCategoryChange(event: Event): void {
    const selected = (event.target as HTMLSelectElement).value;
    if (selected === 'Other') {
      this.customCategory = '';
    }
  }

  loadBookData(bookId: string): void {
    this.bookService.getBookById(bookId).subscribe({
      next: (res) => {
        const book = res.data;
        this.addBookForm.patchValue({
          title: book.title,
          description: book.description,
          isbn: book.isbn,
          price: book.price,
          discount: book.discount,
          pages: book.pages,
          category: book.category,
          coverImage: book.coverImage,
          images: book.images,
          stock: book.stock,
          isNew: book.isNew,
          isBestseller: book.isBestseller,
          isFeatured: book.isFeatured
        });
        this.coverImagePreview = this.bookService.getFullImageUrl(book.coverImage);
        this.additionalImagePreviews = book.images?.map((img: string) => this.bookService.getFullImageUrl(img)) || [];
      },
      error: () => {
        this.errorMessage = ' Failed to load book details.';
      }
    });
  }

  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.coverImageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.coverImagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.coverImageFile);
    }
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.additionalImageFiles = Array.from(input.files);
      this.additionalImagePreviews = [];

      this.additionalImageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.additionalImagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }



  async onSubmit(): Promise<void> {
  console.log('Form Submitted', this.addBookForm.value);
  console.log('Form Valid?', this.addBookForm.valid);

  this.successMessage = null;
  this.errorMessage = null;

  const category = this.addBookForm.get('category')?.value === 'Other'
    ? this.customCategory
    : this.addBookForm.get('category')?.value;

  this.addBookForm.patchValue({ category });

  try {
    // ✅ 1. Upload cover image
    if (this.coverImageFile) {
      const coverForm = new FormData();
      coverForm.append('coverImage', this.coverImageFile);
      const coverResponse = await this.bookService.uploadCoverImage(coverForm).toPromise();
      this.addBookForm.patchValue({ coverImage: coverResponse?.path });
    }

    // ✅ 2. Upload additional images
    if (this.additionalImageFiles.length > 0) {
      const imagesForm = new FormData();
      this.additionalImageFiles.forEach(file => {
        imagesForm.append('images', file);
      });
      const imagesResponse = await this.bookService.uploadMultipleImages(imagesForm).toPromise();
      this.addBookForm.patchValue({ images: imagesResponse?.paths || [] });
    }

    // ✅ 3. Check form validity *AFTER PATCHING*
    if (this.addBookForm.invalid) {
      this.addBookForm.markAllAsTouched();
      return;
    }

    // ✅ 4. Submit or update
    if (this.isEditMode && this.bookId) {
      this.bookService.updateBook(this.bookId, this.addBookForm.value).subscribe({
        next: () => {
          this.successMessage = ' Your changes have been submitted for review.';
          setTimeout(() => this.router.navigate(['/author/my-books']), 2000);
        },
        error: () => {
          this.errorMessage = ' Failed to update the book.';
        }
      });
    } else {
      this.bookService.addBook(this.addBookForm.value).subscribe({
        next: () => {
          this.successMessage = ' Book submitted successfully and awaiting admin approval.';
          setTimeout(() => this.router.navigate(['/author/my-books']), 2000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || ' Something went wrong while submitting the book.';
        }
      });
    }

  } catch (err) {
    this.errorMessage = ' Image upload failed.';
  }
}

  onImagesInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const urls = input.split(',').map(url => url.trim()).filter(url => url);
    this.addBookForm.patchValue({ images: urls });
  }
}
