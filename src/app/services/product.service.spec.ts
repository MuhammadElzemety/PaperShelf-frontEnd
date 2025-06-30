import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve products from the API', () => {
    const dummyProducts = [
      {
        id: 1,
        title: 'Test Product 1',
        price: 10,
        description: 'Desc 1',
        category: 'cat 1',
        image: 'image1.jpg',
        rating: { rate: 4, count: 100 }
      },
      {
        id: 2,
        title: 'Test Product 2',
        price: 20,
        description: 'Desc 2',
        category: 'cat 2',
        image: 'image2.jpg',
        rating: { rate: 3, count: 50 }
      }
    ];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products[0].name).toEqual('Test Product 1');
      expect(products[1].price).toEqual(20);
    });

    const req = httpTestingController.expectOne('https://fakestoreapi.com/products');
    expect(req.request.method).toEqual('GET');
    req.flush(dummyProducts);
  });

  it('should retrieve a single product by ID', () => {
    const dummyProduct = {
      id: 1,
      title: 'Test Product 1',
      price: 10,
      description: 'Desc 1',
      category: 'cat 1',
      image: 'image1.jpg',
      rating: { rate: 4, count: 100 }
    };

    service.getProduct(1).subscribe(product => {
      expect(product.name).toEqual('Test Product 1');
      expect(product.price).toEqual(10);
    });

    const req = httpTestingController.expectOne('https://fakestoreapi.com/products/1');
    expect(req.request.method).toEqual('GET');
    req.flush(dummyProduct);
  });
});


