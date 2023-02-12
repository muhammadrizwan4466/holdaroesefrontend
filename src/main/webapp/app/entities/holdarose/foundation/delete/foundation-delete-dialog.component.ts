import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFoundation } from '../foundation.model';
import { FoundationService } from '../service/foundation.service';

@Component({
  templateUrl: './foundation-delete-dialog.component.html',
})
export class FoundationDeleteDialogComponent {
  foundation?: IFoundation;

  constructor(protected foundationService: FoundationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.foundationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
