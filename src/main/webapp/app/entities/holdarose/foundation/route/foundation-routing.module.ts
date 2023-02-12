import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FoundationComponent } from '../list/foundation.component';
import { FoundationDetailComponent } from '../detail/foundation-detail.component';
import { FoundationUpdateComponent } from '../update/foundation-update.component';
import { FoundationRoutingResolveService } from './foundation-routing-resolve.service';

const foundationRoute: Routes = [
  {
    path: '',
    component: FoundationComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FoundationDetailComponent,
    resolve: {
      foundation: FoundationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FoundationUpdateComponent,
    resolve: {
      foundation: FoundationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FoundationUpdateComponent,
    resolve: {
      foundation: FoundationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(foundationRoute)],
  exports: [RouterModule],
})
export class FoundationRoutingModule {}
