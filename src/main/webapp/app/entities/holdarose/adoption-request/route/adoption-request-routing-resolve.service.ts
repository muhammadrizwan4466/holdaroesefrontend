import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAdoptionRequest, AdoptionRequest } from '../adoption-request.model';
import { AdoptionRequestService } from '../service/adoption-request.service';

@Injectable({ providedIn: 'root' })
export class AdoptionRequestRoutingResolveService implements Resolve<IAdoptionRequest> {
  constructor(protected service: AdoptionRequestService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAdoptionRequest> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((adoptionRequest: HttpResponse<AdoptionRequest>) => {
          if (adoptionRequest.body) {
            return of(adoptionRequest.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AdoptionRequest());
  }
}
