import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFosters } from '../fosters.model';
import { FostersService } from '../service/fosters.service';

@Component({
  templateUrl: './fosters-delete-dialog.component.html',
})
export class FostersDeleteDialogComponent {
  fosters?: IFosters;

  constructor(protected fostersService: FostersService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.fostersService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
