import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDonation, Donation } from '../donation.model';
import { DonationService } from '../service/donation.service';
import { IFoundation } from 'app/entities/holdarose/foundation/foundation.model';
import { FoundationService } from 'app/entities/holdarose/foundation/service/foundation.service';
import { PaymentMethod } from 'app/entities/enumerations/payment-method.model';

@Component({
  selector: 'gx-r-donation-update',
  templateUrl: './donation-update.component.html',
})
export class DonationUpdateComponent implements OnInit {
  isSaving = false;
  paymentMethodValues = Object.keys(PaymentMethod);

  foundationsSharedCollection: IFoundation[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    cnic: [null, [Validators.required]],
    address: [],
    foundationName: [],
    donationAmount: [],
    paymentMethod: [],
    foundation: [],
  });

  constructor(
    protected donationService: DonationService,
    protected foundationService: FoundationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ donation }) => {
      this.updateForm(donation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const donation = this.createFromForm();
    if (donation.id !== undefined) {
      this.subscribeToSaveResponse(this.donationService.update(donation));
    } else {
      this.subscribeToSaveResponse(this.donationService.create(donation));
    }
  }

  trackFoundationById(_index: number, item: IFoundation): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDonation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(donation: IDonation): void {
    this.editForm.patchValue({
      id: donation.id,
      name: donation.name,
      cnic: donation.cnic,
      address: donation.address,
      foundationName: donation.foundationName,
      donationAmount: donation.donationAmount,
      paymentMethod: donation.paymentMethod,
      foundation: donation.foundation,
    });

    this.foundationsSharedCollection = this.foundationService.addFoundationToCollectionIfMissing(
      this.foundationsSharedCollection,
      donation.foundation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.foundationService
      .query()
      .pipe(map((res: HttpResponse<IFoundation[]>) => res.body ?? []))
      .pipe(
        map((foundations: IFoundation[]) =>
          this.foundationService.addFoundationToCollectionIfMissing(foundations, this.editForm.get('foundation')!.value)
        )
      )
      .subscribe((foundations: IFoundation[]) => (this.foundationsSharedCollection = foundations));
  }

  protected createFromForm(): IDonation {
    return {
      ...new Donation(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      cnic: this.editForm.get(['cnic'])!.value,
      address: this.editForm.get(['address'])!.value,
      foundationName: this.editForm.get(['foundationName'])!.value,
      donationAmount: this.editForm.get(['donationAmount'])!.value,
      paymentMethod: this.editForm.get(['paymentMethod'])!.value,
      foundation: this.editForm.get(['foundation'])!.value,
    };
  }
}
