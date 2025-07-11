import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WishlistComponent } from './wishlist.component';
import { ProductService } from '../services/product.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('WishlistComponent', () => {
  let component: WishlistComponent;
  let fixture: ComponentFixture<WishlistComponent>;
  let mockProductService: any;

  beforeEach(async () => {
    mockProductService = {
      getWishlist: jasmine.createSpy('getWishlist').and.returnValue(of([])),
      removeFromWishlist: jasmine
        .createSpy('removeFromWishlist')
        .and.returnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [WishlistComponent, CommonModule, FormsModule],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compileComponents();

    fixture = TestBed.createComponent(WishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load wishlist items on init', () => {
    expect(mockProductService.getWishlist).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.wishlistItems.length).toBe(0);
  });

  it('should toggle select all', () => {
    component.wishlistItems = [
      {
        id: '1',
        name: 'Book 1',
        price: 10,
        image: '',
        inStock: true,
        selected: false,
      },
      {
        id: '2',
        name: 'Book 2',
        price: 20,
        image: '',
        inStock: false,
        selected: false,
      },
    ];
    component.toggleSelectAll();
    expect(component.wishlistItems.every((i) => i.selected)).toBeTrue();
  });

  it('should show toast message', () => {
    component.showToast('Test Toast', 'success');
    expect(component.toastMessage).toBe('Test Toast');
    expect(component.toastType).toBe('success');
    expect(component.showToastFlag).toBeTrue();
  });

  it('should handle deleteItem success', () => {
    component.wishlistItems = [
      {
        id: '1',
        name: 'Book 1',
        price: 10,
        image: '',
        inStock: true,
        selected: false,
      },
    ];

    component.deleteItem(component.wishlistItems[0]);
    expect(mockProductService.removeFromWishlist).toHaveBeenCalledWith('1');
  });

  it('should handle deleteItem failure', () => {
    mockProductService.removeFromWishlist.and.returnValue(
      throwError(() => new Error('fail'))
    );
    spyOn(console, 'error');

    component.wishlistItems = [
      {
        id: '1',
        name: 'Book 1',
        price: 10,
        image: '',
        inStock: true,
        selected: false,
      },
    ];

    component.deleteItem(component.wishlistItems[0]);
    expect(console.error).toHaveBeenCalled();
  });
});
