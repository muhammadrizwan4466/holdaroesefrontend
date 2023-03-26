import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AdoptionRequestComponent } from '../list/adoption-request.component';
import { AdoptionRequestDetailComponent } from '../detail/adoption-request-detail.component';
import { AdoptionRequestUpdateComponent } from '../update/adoption-request-update.component';
import { AdoptionRequestRoutingResolveService } from './adoption-request-routing-resolve.service';
import {ChildRoutingResolveService} from "../../child/route/child-routing-resolve.service";

const adoptionRequestRoute: Routes = [
  {
    path: '',
    component: AdoptionRequestComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: ':id/view',
    component: AdoptionRequestDetailComponent,
    resolve: {
      adoptionRequest: AdoptionRequestRoutingResolveService,
    },
  },
  {
    path: 'new',
    component: AdoptionRequestUpdateComponent,
    resolve: {
      adoptionRequest: AdoptionRequestRoutingResolveService,
    },
  },
  {
    path: 'child/:id',
    component: AdoptionRequestUpdateComponent,
    resolve: {
      adoptionRequest: ChildRoutingResolveService,
    },
  },
  {
    path: ':id/edit',
    component: AdoptionRequestUpdateComponent,
    resolve: {
      adoptionRequest: AdoptionRequestRoutingResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(adoptionRequestRoute)],
  exports: [RouterModule],
})
export class AdoptionRequestRoutingModule {}
