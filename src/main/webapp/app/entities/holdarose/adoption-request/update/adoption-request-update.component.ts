import {Component, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {finalize, map} from 'rxjs/operators';

import {AdoptionRequest, IAdoptionRequest} from '../adoption-request.model';
import {AdoptionRequestService} from '../service/adoption-request.service';
import {IChild} from 'app/entities/holdarose/child/child.model';
import {ChildService} from 'app/entities/holdarose/child/service/child.service';
import {FoundationService} from "../../foundation/service/foundation.service";
import {IFoundation} from "../../foundation/foundation.model";

@Component({
  selector: 'gx-r-adoption-request-update',
  templateUrl: './adoption-request-update.component.html',
})
export class AdoptionRequestUpdateComponent implements OnInit {
  isSaving = false;

  childrenCollection: IChild[] = [];
  child: IChild | null = null;
  adoption: IAdoptionRequest = {};
  foundation: IFoundation = {};

  editForm = this.fb.group({
    id: [],
    childName: [null, [Validators.required]],
    cnic: [null, [Validators.required]],
    fosterName: [null, [Validators.required]],
    fosterJobTitle: [null, [Validators.required]],
    fosterAddress: [null, [Validators.required]],
    approved: [],
    foundationName: [null, [Validators.required]],
    child: [],
  });

  constructor(
    protected adoptionRequestService: AdoptionRequestService,
    protected childService: ChildService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({adoptionRequest}) => {
      if (adoptionRequest) {
        this.getChild(adoptionRequest.id);
      }
    });
  }


  previousState(): void {
    window.history.back();
  }

  getChild(id: string): void {
    this.childService.find(id)
      .pipe(map((res: HttpResponse<IChild>) => res.body ?? null))
      .subscribe((child: IChild | null) => {
        this.child = child;
        if (child?.name) {
          if (child.foundation?.id) {
            this.adoption.childName = child.name;
            this.adoption.foundationName = child.foundation.name;
            this.adoption.child = child;
            this.updateForm(this.adoption);
          }
        }
      });
  }

  save(): void {
    this.isSaving = true;
    const adoptionRequest = this.createFromForm();
    if (adoptionRequest.id !== undefined) {
      this.subscribeToSaveResponse(this.adoptionRequestService.update(adoptionRequest));
    } else {
      adoptionRequest.approved=false;
      this.subscribeToSaveResponse(this.adoptionRequestService.create(adoptionRequest));
    }
  }

  trackChildById(_index: number, item: IChild): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdoptionRequest>>): void {
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

  protected updateForm(adoptionRequest: IAdoptionRequest): void {
    this.editForm.patchValue({
      id: adoptionRequest.id,
      childName: adoptionRequest.childName,
      cnic: adoptionRequest.cnic,
      fosterName: adoptionRequest.fosterName,
      fosterJobTitle: adoptionRequest.fosterJobTitle,
      fosterAddress: adoptionRequest.fosterAddress,
      approved: adoptionRequest.approved,
      foundationName: adoptionRequest.foundationName,
      child: adoptionRequest.child,
    });
    this.childrenCollection = this.childService.addChildToCollectionIfMissing(this.childrenCollection, adoptionRequest.child)

  }

  protected loadRelationshipsOptions(): void {
    this.childService
      .query({filter: 'adoptionrequest-is-null'})
      .pipe(map((res: HttpResponse<IChild[]>) => res.body ?? []))
      .pipe(map((children: IChild[]) => this.childService.addChildToCollectionIfMissing(children, this.editForm.get('child')!.value)))
      .subscribe((children: IChild[]) => (this.childrenCollection = children));
  }

  protected createFromForm(): IAdoptionRequest {
    return {
      ...new AdoptionRequest(),
      id: this.editForm.get(['id'])!.value,
      childName: this.editForm.get(['childName'])!.value,
      cnic: this.editForm.get(['cnic'])!.value,
      fosterName: this.editForm.get(['fosterName'])!.value,
      fosterJobTitle: this.editForm.get(['fosterJobTitle'])!.value,
      fosterAddress: this.editForm.get(['fosterAddress'])!.value,
      approved: this.editForm.get(['approved'])!.value,
      foundationName: this.editForm.get(['foundationName'])!.value,
      child: this.editForm.get(['child'])!.value,
    };
  }
}
