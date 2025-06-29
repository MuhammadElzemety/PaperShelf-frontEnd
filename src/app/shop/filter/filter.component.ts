import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
  publishers: string[] = [];
  displayedCategories: string[] = [];
  displayedAuthors: string[] = [];
  displayedPublishers: string[] = [];
  ratings = [5, 4, 3, 2, 1];

  selectedCategories: string[] = [];
  selectedAuthors: string[] = [];
  selectedPublishers: string[] = [];
  selectedRating: number | null = null;

  itemsPerPage = 5;
  currentCategoryPage = 1;
  currentAuthorPage = 1;
  currentPublisherPage = 1;

  priceFloor: number = 0;
  priceCeil: number = 5000;
  selectedPriceMin: number = 0;
  selectedPriceMax: number = 5000;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadFilters();
  }

  loadFilters() {
    this.http.get<string[]>('http://localhost:3000/categories').subscribe(data => {
      this.categories = data;
      this.loadMoreCategories();
    });
    this.http.get<string[]>('http://localhost:3000/authors').subscribe(data => {
      this.authors = data;
      this.loadMoreAuthors();
    });
    this.http.get<string[]>('http://localhost:3000/publishers').subscribe(data => {
      this.publishers = data;
      this.loadMorePublishers();
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

  loadMorePublishers() {
    const start = (this.currentPublisherPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedPublishers.push(...this.publishers.slice(start, end));
    this.currentPublisherPage++;
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
  }

  toggleAuthor(event: Event) {
    const target = event.target as HTMLInputElement;
    this.toggleSelection(this.selectedAuthors, target.value, target.checked);
  }

  togglePublisher(event: Event) {
    const target = event.target as HTMLInputElement;
    this.toggleSelection(this.selectedPublishers, target.value, target.checked);
  }

  changeRating(rate: number) {
    this.selectedRating = rate;
  }

  getStars(rate: number): string {
    return '★'.repeat(rate) + '☆'.repeat(5 - rate);
  }

  clearAll() {
    this.selectedCategories = [];
    this.selectedAuthors = [];
    this.selectedPublishers = [];
    this.selectedRating = null;
    this.selectedPriceMin = 0;
    this.selectedPriceMax = 1000;
  }

  applyFilters() {
    this.filtersApplied.emit({
      categories: this.selectedCategories,
      authors: this.selectedAuthors,
      publishers: this.selectedPublishers,
      rating: this.selectedRating,
      priceRange: {
        min: this.selectedPriceMin,
        max: this.selectedPriceMax
      }
    });
  }
}
