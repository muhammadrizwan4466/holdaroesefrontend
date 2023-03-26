import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChildComponent} from '../list/child.component';
import {ChildDetailComponent} from '../detail/child-detail.component';
import {ChildUpdateComponent} from '../update/child-update.component';
import {ChildRoutingResolveService} from './child-routing-resolve.service';

const childRoute: Routes = [
  {
    path: '',
    component: ChildComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: ':id/view',
    component: ChildDetailComponent,
    resolve: {
      child: ChildRoutingResolveService,
    }
  },
  {
    path: 'new',
    component: ChildUpdateComponent,
    resolve: {
      child: ChildRoutingResolveService,
    }
  },
  {
    path: ':id/edit',
    component: ChildUpdateComponent,
    resolve: {
      child: ChildRoutingResolveService,
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(childRoute)],
  exports: [RouterModule],
})
export class ChildRoutingModule {}
