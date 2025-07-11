import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService, WishlistItem } from './product.service';
import { environment } from '../../environments/environment'; 
const API_URL = environment.apiBaseUrl;


describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const dummyToken = 'fake-jwt-token';
  const dummyWishlistResponse = {
    data: [
      {
        _id: '1',
        title: 'Book One',
        price: 100,
        coverImage: 'cover.jpg',
        stock: 5,
      },
      {
        _id: '2',
        title: 'Book Two',
        price: 150,
        coverImage: 'http://image.com/cover2.jpg',
        stock: 0,
      },
    ],
  };

  beforeEach(() => {
    localStorage.setItem('accessToken', dummyToken);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch wishlist', () => {
    service.getWishlist().subscribe((items: WishlistItem[]) => {
      expect(items.length).toBe(2);
      expect(items[0].id).toBe('1');
      expect(items[0].inStock).toBeTrue();
      expect(items[1].inStock).toBeFalse();
    });

    const req = httpMock.expectOne(`${API_URL}/wishlist`); 
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${dummyToken}`
    );
    req.flush(dummyWishlistResponse);
  });

  it('should add to wishlist', () => {
    const bookId = '123';
    service.addToWishlist(bookId).subscribe((res) => {
      expect(res.success).toBeTrue();
    });
    const req = httpMock.expectOne(`${API_URL}/wishlist`); 
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ bookId });
    req.flush({ success: true });
  });

  it('should remove from wishlist', () => {
    const bookId = '123';
    service.removeFromWishlist(bookId).subscribe((res) => {
      expect(res.success).toBeTrue();
    });

       const req = httpMock.expectOne(`${API_URL}/wishlist/${bookId}`); 

    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
});
