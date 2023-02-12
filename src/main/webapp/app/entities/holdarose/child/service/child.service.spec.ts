import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Gender } from 'app/entities/enumerations/gender.model';
import { IChild, Child } from '../child.model';

import { ChildService } from './child.service';

describe('Child Service', () => {
  let service: ChildService;
  let httpMock: HttpTestingController;
  let elemDefault: IChild;
  let expectedResult: IChild | IChild[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChildService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      name: 'AAAAAAA',
      age: 0,
      imageContentType: 'image/png',
      image: 'AAAAAAA',
      gender: Gender.MALE,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Child', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Child()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Child', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
          age: 1,
          image: 'BBBBBB',
          gender: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Child', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          age: 1,
          gender: 'BBBBBB',
        },
        new Child()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Child', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
          age: 1,
          image: 'BBBBBB',
          gender: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Child', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChildToCollectionIfMissing', () => {
      it('should add a Child to an empty array', () => {
        const child: IChild = { id: 'ABC' };
        expectedResult = service.addChildToCollectionIfMissing([], child);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(child);
      });

      it('should not add a Child to an array that contains it', () => {
        const child: IChild = { id: 'ABC' };
        const childCollection: IChild[] = [
          {
            ...child,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addChildToCollectionIfMissing(childCollection, child);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Child to an array that doesn't contain it", () => {
        const child: IChild = { id: 'ABC' };
        const childCollection: IChild[] = [{ id: 'CBA' }];
        expectedResult = service.addChildToCollectionIfMissing(childCollection, child);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(child);
      });

      it('should add only unique Child to an array', () => {
        const childArray: IChild[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '10c66fe8-3149-4852-b181-84d03c619cbd' }];
        const childCollection: IChild[] = [{ id: 'ABC' }];
        expectedResult = service.addChildToCollectionIfMissing(childCollection, ...childArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const child: IChild = { id: 'ABC' };
        const child2: IChild = { id: 'CBA' };
        expectedResult = service.addChildToCollectionIfMissing([], child, child2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(child);
        expect(expectedResult).toContain(child2);
      });

      it('should accept null and undefined values', () => {
        const child: IChild = { id: 'ABC' };
        expectedResult = service.addChildToCollectionIfMissing([], null, child, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(child);
      });

      it('should return initial array if no Child is added', () => {
        const childCollection: IChild[] = [{ id: 'ABC' }];
        expectedResult = service.addChildToCollectionIfMissing(childCollection, undefined, null);
        expect(expectedResult).toEqual(childCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
