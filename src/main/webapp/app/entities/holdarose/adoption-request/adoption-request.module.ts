import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AdoptionRequestComponent } from './list/adoption-request.component';
import { AdoptionRequestDetailComponent } from './detail/adoption-request-detail.component';
import { AdoptionRequestUpdateComponent } from './update/adoption-request-update.component';
import { AdoptionRequestDeleteDialogComponent } from './delete/adoption-request-delete-dialog.component';
import { AdoptionRequestRoutingModule } from './route/adoption-request-routing.module';

@NgModule({
  imports: [SharedModule, AdoptionRequestRoutingModule],
  declarations: [
    AdoptionRequestComponent,
    AdoptionRequestDetailComponent,
    AdoptionRequestUpdateComponent,
    AdoptionRequestDeleteDialogComponent,
  ],
  entryComponents: [AdoptionRequestDeleteDialogComponent],
})
export class HoldaroseAdoptionRequestModule {}
