import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFosters, Fosters } from '../fosters.model';
import { FostersService } from '../service/fosters.service';
import { IChild } from 'app/entities/holdarose/child/child.model';
import { ChildService } from 'app/entities/holdarose/child/service/child.service';

@Component({
  selector: 'gx-r-fosters-update',
  templateUrl: './fosters-update.component.html',
})
export class FostersUpdateComponent implements OnInit {
  isSaving = false;

  childrenSharedCollection: IChild[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    cnic: [],
    email: [],
    jobTitle: [],
    location: [],
    child: [],
  });

  constructor(
    protected fostersService: FostersService,
    protected childService: ChildService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fosters }) => {
      this.updateForm(fosters);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fosters = this.createFromForm();
    if (fosters.id !== undefined) {
      this.subscribeToSaveResponse(this.fostersService.update(fosters));
    } else {
      this.subscribeToSaveResponse(this.fostersService.create(fosters));
    }
  }

  trackChildById(_index: number, item: IChild): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFosters>>): void {
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

  protected updateForm(fosters: IFosters): void {
    this.editForm.patchValue({
      id: fosters.id,
      name: fosters.name,
      cnic: fosters.cnic,
      email: fosters.email,
      jobTitle: fosters.jobTitle,
      location: fosters.location,
      child: fosters.child,
    });

    this.childrenSharedCollection = this.childService.addChildToCollectionIfMissing(this.childrenSharedCollection, fosters.child);
  }

  protected loadRelationshipsOptions(): void {
    this.childService
      .query()
      .pipe(map((res: HttpResponse<IChild[]>) => res.body ?? []))
      .pipe(map((children: IChild[]) => this.childService.addChildToCollectionIfMissing(children, this.editForm.get('child')!.value)))
      .subscribe((children: IChild[]) => (this.childrenSharedCollection = children));
  }

  protected createFromForm(): IFosters {
    return {
      ...new Fosters(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      cnic: this.editForm.get(['cnic'])!.value,
      email: this.editForm.get(['email'])!.value,
      jobTitle: this.editForm.get(['jobTitle'])!.value,
      location: this.editForm.get(['location'])!.value,
      child: this.editForm.get(['child'])!.value,
    };
  }
}
