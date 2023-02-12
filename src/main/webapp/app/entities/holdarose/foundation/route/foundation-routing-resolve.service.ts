import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFoundation, Foundation } from '../foundation.model';
import { FoundationService } from '../service/foundation.service';

@Injectable({ providedIn: 'root' })
export class FoundationRoutingResolveService implements Resolve<IFoundation> {
  constructor(protected service: FoundationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFoundation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((foundation: HttpResponse<Foundation>) => {
          if (foundation.body) {
            return of(foundation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Foundation());
  }
}
