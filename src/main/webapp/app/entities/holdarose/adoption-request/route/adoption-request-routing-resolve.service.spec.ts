import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAdoptionRequest, AdoptionRequest } from '../adoption-request.model';
import { AdoptionRequestService } from '../service/adoption-request.service';

import { AdoptionRequestRoutingResolveService } from './adoption-request-routing-resolve.service';

describe('AdoptionRequest routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AdoptionRequestRoutingResolveService;
  let service: AdoptionRequestService;
  let resultAdoptionRequest: IAdoptionRequest | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(AdoptionRequestRoutingResolveService);
    service = TestBed.inject(AdoptionRequestService);
    resultAdoptionRequest = undefined;
  });

  describe('resolve', () => {
    it('should return IAdoptionRequest returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAdoptionRequest = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultAdoptionRequest).toEqual({ id: 'ABC' });
    });

    it('should return new IAdoptionRequest if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAdoptionRequest = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAdoptionRequest).toEqual(new AdoptionRequest());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AdoptionRequest })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAdoptionRequest = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultAdoptionRequest).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
