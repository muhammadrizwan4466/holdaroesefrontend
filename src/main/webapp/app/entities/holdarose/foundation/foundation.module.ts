import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FoundationComponent } from './list/foundation.component';
import { FoundationDetailComponent } from './detail/foundation-detail.component';
import { FoundationUpdateComponent } from './update/foundation-update.component';
import { FoundationDeleteDialogComponent } from './delete/foundation-delete-dialog.component';
import { FoundationRoutingModule } from './route/foundation-routing.module';

@NgModule({
  imports: [SharedModule, FoundationRoutingModule],
  declarations: [FoundationComponent, FoundationDetailComponent, FoundationUpdateComponent, FoundationDeleteDialogComponent],
  entryComponents: [FoundationDeleteDialogComponent],
})
export class HoldaroseFoundationModule {}
