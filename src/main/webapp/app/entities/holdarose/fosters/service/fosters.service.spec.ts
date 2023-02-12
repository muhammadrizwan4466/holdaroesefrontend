import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFosters, Fosters } from '../fosters.model';

import { FostersService } from './fosters.service';

describe('Fosters Service', () => {
  let service: FostersService;
  let httpMock: HttpTestingController;
  let elemDefault: IFosters;
  let expectedResult: IFosters | IFosters[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FostersService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      name: 'AAAAAAA',
      cnic: 'AAAAAAA',
      email: 'AAAAAAA',
      jobTitle: 'AAAAAAA',
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

    it('should create a Fosters', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Fosters()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Fosters', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
          cnic: 'BBBBBB',
          email: 'BBBBBB',
          jobTitle: 'BBBBBB',
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

    it('should partial update a Fosters', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          location: 'BBBBBB',
        },
        new Fosters()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Fosters', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
          cnic: 'BBBBBB',
          email: 'BBBBBB',
          jobTitle: 'BBBBBB',
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

    it('should delete a Fosters', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFostersToCollectionIfMissing', () => {
      it('should add a Fosters to an empty array', () => {
        const fosters: IFosters = { id: 'ABC' };
        expectedResult = service.addFostersToCollectionIfMissing([], fosters);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fosters);
      });

      it('should not add a Fosters to an array that contains it', () => {
        const fosters: IFosters = { id: 'ABC' };
        const fostersCollection: IFosters[] = [
          {
            ...fosters,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addFostersToCollectionIfMissing(fostersCollection, fosters);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Fosters to an array that doesn't contain it", () => {
        const fosters: IFosters = { id: 'ABC' };
        const fostersCollection: IFosters[] = [{ id: 'CBA' }];
        expectedResult = service.addFostersToCollectionIfMissing(fostersCollection, fosters);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fosters);
      });

      it('should add only unique Fosters to an array', () => {
        const fostersArray: IFosters[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '0165c0ac-1b5b-4860-bedb-965d50916f6e' }];
        const fostersCollection: IFosters[] = [{ id: 'ABC' }];
        expectedResult = service.addFostersToCollectionIfMissing(fostersCollection, ...fostersArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const fosters: IFosters = { id: 'ABC' };
        const fosters2: IFosters = { id: 'CBA' };
        expectedResult = service.addFostersToCollectionIfMissing([], fosters, fosters2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fosters);
        expect(expectedResult).toContain(fosters2);
      });

      it('should accept null and undefined values', () => {
        const fosters: IFosters = { id: 'ABC' };
        expectedResult = service.addFostersToCollectionIfMissing([], null, fosters, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fosters);
      });

      it('should return initial array if no Fosters is added', () => {
        const fostersCollection: IFosters[] = [{ id: 'ABC' }];
        expectedResult = service.addFostersToCollectionIfMissing(fostersCollection, undefined, null);
        expect(expectedResult).toEqual(fostersCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
