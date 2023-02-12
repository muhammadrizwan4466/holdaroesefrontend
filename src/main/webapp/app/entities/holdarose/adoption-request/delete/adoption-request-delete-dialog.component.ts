import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAdoptionRequest } from '../adoption-request.model';
import { AdoptionRequestService } from '../service/adoption-request.service';

@Component({
  templateUrl: './adoption-request-delete-dialog.component.html',
})
export class AdoptionRequestDeleteDialogComponent {
  adoptionRequest?: IAdoptionRequest;

  constructor(protected adoptionRequestService: AdoptionRequestService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.adoptionRequestService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
