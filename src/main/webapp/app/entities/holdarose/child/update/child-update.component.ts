import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import {FormBuilder, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IChild, Child } from '../child.model';
import { ChildService } from '../service/child.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IFoundation } from 'app/entities/holdarose/foundation/foundation.model';
import { FoundationService } from 'app/entities/holdarose/foundation/service/foundation.service';
import { Gender } from 'app/entities/enumerations/gender.model';
import {Status} from "../../../enumerations/status.model";

@Component({
  selector: 'gx-r-child-update',
  templateUrl: './child-update.component.html',
})
export class ChildUpdateComponent implements OnInit {
  isSaving = false;
  genderValues = Object.keys(Gender);
  statusValues = Object.keys(Status);

  foundationsSharedCollection: IFoundation[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    age: [],
    image: [],
    imageContentType: [],
    gender: [],
    status: [],
    foundation: [],
  });


  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected childService: ChildService,
    protected foundationService: FoundationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ child }) => {
      this.updateForm(child);
      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('holdaroesefrontendApp.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const child = this.createFromForm();
    if (child.id !== undefined) {
      this.subscribeToSaveResponse(this.childService.update(child));
    } else {
      this.subscribeToSaveResponse(this.childService.create(child));
    }
  }

  trackFoundationById(_index: number, item: IFoundation): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChild>>): void {
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

  protected updateForm(child: IChild): void {
    this.editForm.patchValue({
      id: child.id,
      name: child.name,
      age: child.age,
      image: child.image,
      imageContentType: child.imageContentType,
      gender: child.gender,
      status: child.status,
      foundation: child.foundation,
    });

    this.foundationsSharedCollection = this.foundationService.addFoundationToCollectionIfMissing(
      this.foundationsSharedCollection,
      child.foundation
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

  protected createFromForm(): IChild {
    return {
      ...new Child(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      age: this.editForm.get(['age'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      gender: this.editForm.get(['gender'])!.value,
      status: this.editForm.get(['status'])!.value,
      foundation: this.editForm.get(['foundation'])!.value,
    };
  }
}
