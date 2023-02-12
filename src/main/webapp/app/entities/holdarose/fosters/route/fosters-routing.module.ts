import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FostersComponent } from '../list/fosters.component';
import { FostersDetailComponent } from '../detail/fosters-detail.component';
import { FostersUpdateComponent } from '../update/fosters-update.component';
import { FostersRoutingResolveService } from './fosters-routing-resolve.service';

const fostersRoute: Routes = [
  {
    path: '',
    component: FostersComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FostersDetailComponent,
    resolve: {
      fosters: FostersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FostersUpdateComponent,
    resolve: {
      fosters: FostersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FostersUpdateComponent,
    resolve: {
      fosters: FostersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fostersRoute)],
  exports: [RouterModule],
})
export class FostersRoutingModule {}
