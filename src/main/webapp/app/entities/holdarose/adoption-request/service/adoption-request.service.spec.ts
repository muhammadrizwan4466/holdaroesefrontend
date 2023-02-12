import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAdoptionRequest, AdoptionRequest } from '../adoption-request.model';

import { AdoptionRequestService } from './adoption-request.service';

describe('AdoptionRequest Service', () => {
  let service: AdoptionRequestService;
  let httpMock: HttpTestingController;
  let elemDefault: IAdoptionRequest;
  let expectedResult: IAdoptionRequest | IAdoptionRequest[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AdoptionRequestService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      childName: 'AAAAAAA',
      cnic: 'AAAAAAA',
      fosterName: 'AAAAAAA',
      fosterJobTitle: 'AAAAAAA',
      fosterAddress: 'AAAAAAA',
      approved: false,
      foundationName: 'AAAAAAA',
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

    it('should create a AdoptionRequest', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AdoptionRequest()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AdoptionRequest', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          childName: 'BBBBBB',
          cnic: 'BBBBBB',
          fosterName: 'BBBBBB',
          fosterJobTitle: 'BBBBBB',
          fosterAddress: 'BBBBBB',
          approved: true,
          foundationName: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AdoptionRequest', () => {
      const patchObject = Object.assign(
        {
          cnic: 'BBBBBB',
          foundationName: 'BBBBBB',
        },
        new AdoptionRequest()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AdoptionRequest', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          childName: 'BBBBBB',
          cnic: 'BBBBBB',
          fosterName: 'BBBBBB',
          fosterJobTitle: 'BBBBBB',
          fosterAddress: 'BBBBBB',
          approved: true,
          foundationName: 'BBBBBB',
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

    it('should delete a AdoptionRequest', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAdoptionRequestToCollectionIfMissing', () => {
      it('should add a AdoptionRequest to an empty array', () => {
        const adoptionRequest: IAdoptionRequest = { id: 'ABC' };
        expectedResult = service.addAdoptionRequestToCollectionIfMissing([], adoptionRequest);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(adoptionRequest);
      });

      it('should not add a AdoptionRequest to an array that contains it', () => {
        const adoptionRequest: IAdoptionRequest = { id: 'ABC' };
        const adoptionRequestCollection: IAdoptionRequest[] = [
          {
            ...adoptionRequest,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addAdoptionRequestToCollectionIfMissing(adoptionRequestCollection, adoptionRequest);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AdoptionRequest to an array that doesn't contain it", () => {
        const adoptionRequest: IAdoptionRequest = { id: 'ABC' };
        const adoptionRequestCollection: IAdoptionRequest[] = [{ id: 'CBA' }];
        expectedResult = service.addAdoptionRequestToCollectionIfMissing(adoptionRequestCollection, adoptionRequest);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(adoptionRequest);
      });

      it('should add only unique AdoptionRequest to an array', () => {
        const adoptionRequestArray: IAdoptionRequest[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '96c2a4c7-8a16-471c-b1ac-a625094e7548' }];
        const adoptionRequestCollection: IAdoptionRequest[] = [{ id: 'ABC' }];
        expectedResult = service.addAdoptionRequestToCollectionIfMissing(adoptionRequestCollection, ...adoptionRequestArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const adoptionRequest: IAdoptionRequest = { id: 'ABC' };
        const adoptionRequest2: IAdoptionRequest = { id: 'CBA' };
        expectedResult = service.addAdoptionRequestToCollectionIfMissing([], adoptionRequest, adoptionRequest2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(adoptionRequest);
        expect(expectedResult).toContain(adoptionRequest2);
      });

      it('should accept null and undefined values', () => {
        const adoptionRequest: IAdoptionRequest = { id: 'ABC' };
        expectedResult = service.addAdoptionRequestToCollectionIfMissing([], null, adoptionRequest, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(adoptionRequest);
      });

      it('should return initial array if no AdoptionRequest is added', () => {
        const adoptionRequestCollection: IAdoptionRequest[] = [{ id: 'ABC' }];
        expectedResult = service.addAdoptionRequestToCollectionIfMissing(adoptionRequestCollection, undefined, null);
        expect(expectedResult).toEqual(adoptionRequestCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
