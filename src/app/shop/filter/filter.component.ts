import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiBaseUrl + '/books';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Output() filtersApplied = new EventEmitter<any>();

  categories: string[] = [];
  authors: string[] = [];
  displayedCategories: string[] = [];
  displayedAuthors: string[] = [];
  ratings = [5, 4, 3, 2, 1];

  selectedCategories: string[] = [];
  selectedAuthors: string[] = [];
  selectedRating: number | null = null;

  itemsPerPage = 5;
  currentCategoryPage = 1;
  currentAuthorPage = 1;

  priceFloor: number = 0;
  priceCeil: number = 5000;
  selectedPriceMin: number = 0;
  selectedPriceMax: number = 5000;

  isCategorySelected: { [key: string]: boolean } = {};
  isAuthorSelected: { [key: string]: boolean } = {};
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadFilters();
  }

  loadFilters() {
    this.http.get<any>(`${API_URL}/categories`).subscribe(res => {
      if (res.success && res.data?.categories) {
        this.categories = res.data.categories.map((c: any) => c.name);
        this.loadMoreCategories();
      }
    });

    this.http.get<any>(`${API_URL}/authors`).subscribe(res => {
      if (res.success && res.data?.authors) {
        this.authors = res.data.authors.map((a: any) => a.name);
        this.loadMoreAuthors();
      }
    });
  }

  loadMoreCategories() {
    const start = (this.currentCategoryPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedCategories.push(...this.categories.slice(start, end));
    this.currentCategoryPage++;
  }

  loadMoreAuthors() {
    const start = (this.currentAuthorPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedAuthors.push(...this.authors.slice(start, end));
    this.currentAuthorPage++;
  }

  toggleSelection(array: string[], value: string, checked: boolean) {
    if (checked) {
      array.push(value);
    } else {
      const index = array.indexOf(value);
      if (index !== -1) array.splice(index, 1);
    }
  }

  toggleCategory(event: Event) {
    const target = event.target as HTMLInputElement;
    this.toggleSelection(this.selectedCategories, target.value, target.checked);
    this.applyFilters();
  }

  toggleAuthor(event: Event) {
    const target = event.target as HTMLInputElement;
    this.toggleSelection(this.selectedAuthors, target.value, target.checked);
    this.applyFilters();
  }

  changeRating(rate: number) {
    this.selectedRating = rate;
    this.applyFilters();
  }
  onCategoryModelChange(category: string, checked: boolean) {
    this.toggleSelection(this.selectedCategories, category, checked);
    this.applyFilters();
  }

  onAuthorModelChange(author: string, checked: boolean) {
    this.toggleSelection(this.selectedAuthors, author, checked);
    this.applyFilters();
  }
  getStars(rate: number): string {
    return '⭐'.repeat(rate) + '☆'.repeat(5 - rate);
  }

  clearAll() {
    this.selectedCategories = [];
    this.selectedAuthors = [];
    this.selectedRating = null;
    this.selectedPriceMin = 0;
    this.selectedPriceMax = 5000;

    this.isCategorySelected = {};
    this.isAuthorSelected = {};

    this.applyFilters();
  }

  applyFilters() {
    this.filtersApplied.emit({
      categories: this.selectedCategories,
      authors: this.selectedAuthors,
      rating: this.selectedRating,
      priceRange: {
        min: this.selectedPriceMin,
        max: this.selectedPriceMax
      }
    });
  }
}
