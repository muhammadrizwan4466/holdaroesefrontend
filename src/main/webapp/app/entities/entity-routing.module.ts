import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'adoption-request',
        data: { pageTitle: 'holdaroesefrontendApp.holdaroseAdoptionRequest.home.title' },
        loadChildren: () => import('./holdarose/adoption-request/adoption-request.module').then(m => m.HoldaroseAdoptionRequestModule),
      },
      {
        path: 'child',
        data: { pageTitle: 'holdaroesefrontendApp.holdaroseChild.home.title' },
        loadChildren: () => import('./holdarose/child/child.module').then(m => m.HoldaroseChildModule),
      },
      {
        path: 'donation',
        data: { pageTitle: 'holdaroesefrontendApp.holdaroseDonation.home.title' },
        loadChildren: () => import('./holdarose/donation/donation.module').then(m => m.HoldaroseDonationModule),
      },
      {
        path: 'fosters',
        data: { pageTitle: 'holdaroesefrontendApp.holdaroseFosters.home.title' },
        loadChildren: () => import('./holdarose/fosters/fosters.module').then(m => m.HoldaroseFostersModule),
      },
      {
        path: 'foundation',
        data: { pageTitle: 'holdaroesefrontendApp.holdaroseFoundation.home.title' },
        loadChildren: () => import('./holdarose/foundation/foundation.module').then(m => m.HoldaroseFoundationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
