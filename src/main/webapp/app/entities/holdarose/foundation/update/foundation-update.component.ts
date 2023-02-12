import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IFoundation, Foundation } from '../foundation.model';
import { FoundationService } from '../service/foundation.service';

@Component({
  selector: 'gx-r-foundation-update',
  templateUrl: './foundation-update.component.html',
})
export class FoundationUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    email: [null, [Validators.required]],
    description: [],
    location: [],
  });

  constructor(protected foundationService: FoundationService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ foundation }) => {
      this.updateForm(foundation);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const foundation = this.createFromForm();
    if (foundation.id !== undefined) {
      this.subscribeToSaveResponse(this.foundationService.update(foundation));
    } else {
      this.subscribeToSaveResponse(this.foundationService.create(foundation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFoundation>>): void {
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

  protected updateForm(foundation: IFoundation): void {
    this.editForm.patchValue({
      id: foundation.id,
      name: foundation.name,
      email: foundation.email,
      description: foundation.description,
      location: foundation.location,
    });
  }

  protected createFromForm(): IFoundation {
    return {
      ...new Foundation(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      email: this.editForm.get(['email'])!.value,
      description: this.editForm.get(['description'])!.value,
      location: this.editForm.get(['location'])!.value,
    };
  }
}
