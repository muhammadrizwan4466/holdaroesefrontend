import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FostersComponent } from './list/fosters.component';
import { FostersDetailComponent } from './detail/fosters-detail.component';
import { FostersUpdateComponent } from './update/fosters-update.component';
import { FostersDeleteDialogComponent } from './delete/fosters-delete-dialog.component';
import { FostersRoutingModule } from './route/fosters-routing.module';

@NgModule({
  imports: [SharedModule, FostersRoutingModule],
  declarations: [FostersComponent, FostersDetailComponent, FostersUpdateComponent, FostersDeleteDialogComponent],
  entryComponents: [FostersDeleteDialogComponent],
})
export class HoldaroseFostersModule {}
