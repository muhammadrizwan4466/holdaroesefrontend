import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFosters, Fosters } from '../fosters.model';
import { FostersService } from '../service/fosters.service';

@Injectable({ providedIn: 'root' })
export class FostersRoutingResolveService implements Resolve<IFosters> {
  constructor(protected service: FostersService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFosters> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fosters: HttpResponse<Fosters>) => {
          if (fosters.body) {
            return of(fosters.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Fosters());
  }
}
