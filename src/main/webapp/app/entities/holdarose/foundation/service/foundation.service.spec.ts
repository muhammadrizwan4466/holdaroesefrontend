import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFoundation, Foundation } from '../foundation.model';

import { FoundationService } from './foundation.service';

describe('Foundation Service', () => {
  let service: FoundationService;
  let httpMock: HttpTestingController;
  let elemDefault: IFoundation;
  let expectedResult: IFoundation | IFoundation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FoundationService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      name: 'AAAAAAA',
      email: 'AAAAAAA',
      description: 'AAAAAAA',
      location: 'AAAAAAA',
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

    it('should create a Foundation', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Foundation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Foundation', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
          email: 'BBBBBB',
          description: 'BBBBBB',
          location: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Foundation', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          location: 'BBBBBB',
        },
        new Foundation()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Foundation', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
          email: 'BBBBBB',
          description: 'BBBBBB',
          location: 'BBBBBB',
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

    it('should delete a Foundation', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFoundationToCollectionIfMissing', () => {
      it('should add a Foundation to an empty array', () => {
        const foundation: IFoundation = { id: 'ABC' };
        expectedResult = service.addFoundationToCollectionIfMissing([], foundation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(foundation);
      });

      it('should not add a Foundation to an array that contains it', () => {
        const foundation: IFoundation = { id: 'ABC' };
        const foundationCollection: IFoundation[] = [
          {
            ...foundation,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addFoundationToCollectionIfMissing(foundationCollection, foundation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Foundation to an array that doesn't contain it", () => {
        const foundation: IFoundation = { id: 'ABC' };
        const foundationCollection: IFoundation[] = [{ id: 'CBA' }];
        expectedResult = service.addFoundationToCollectionIfMissing(foundationCollection, foundation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(foundation);
      });

      it('should add only unique Foundation to an array', () => {
        const foundationArray: IFoundation[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '6aa4c2a6-107a-4bb7-8405-0826b7cd10c6' }];
        const foundationCollection: IFoundation[] = [{ id: 'ABC' }];
        expectedResult = service.addFoundationToCollectionIfMissing(foundationCollection, ...foundationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const foundation: IFoundation = { id: 'ABC' };
        const foundation2: IFoundation = { id: 'CBA' };
        expectedResult = service.addFoundationToCollectionIfMissing([], foundation, foundation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(foundation);
        expect(expectedResult).toContain(foundation2);
      });

      it('should accept null and undefined values', () => {
        const foundation: IFoundation = { id: 'ABC' };
        expectedResult = service.addFoundationToCollectionIfMissing([], null, foundation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(foundation);
      });

      it('should return initial array if no Foundation is added', () => {
        const foundationCollection: IFoundation[] = [{ id: 'ABC' }];
        expectedResult = service.addFoundationToCollectionIfMissing(foundationCollection, undefined, null);
        expect(expectedResult).toEqual(foundationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
