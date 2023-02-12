import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AdoptionRequestService } from '../service/adoption-request.service';
import { IAdoptionRequest, AdoptionRequest } from '../adoption-request.model';
import { IChild } from 'app/entities/holdarose/child/child.model';
import { ChildService } from 'app/entities/holdarose/child/service/child.service';

import { AdoptionRequestUpdateComponent } from './adoption-request-update.component';

describe('AdoptionRequest Management Update Component', () => {
  let comp: AdoptionRequestUpdateComponent;
  let fixture: ComponentFixture<AdoptionRequestUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let adoptionRequestService: AdoptionRequestService;
  let childService: ChildService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AdoptionRequestUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AdoptionRequestUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdoptionRequestUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    adoptionRequestService = TestBed.inject(AdoptionRequestService);
    childService = TestBed.inject(ChildService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call child query and add missing value', () => {
      const adoptionRequest: IAdoptionRequest = { id: 'CBA' };
      const child: IChild = { id: '408f3071-7e65-44e1-b53e-40029ad2959b' };
      adoptionRequest.child = child;

      const childCollection: IChild[] = [{ id: '49e75064-ab3e-4ee8-8f51-8f081aafa37a' }];
      jest.spyOn(childService, 'query').mockReturnValue(of(new HttpResponse({ body: childCollection })));
      const expectedCollection: IChild[] = [child, ...childCollection];
      jest.spyOn(childService, 'addChildToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ adoptionRequest });
      comp.ngOnInit();

      expect(childService.query).toHaveBeenCalled();
      expect(childService.addChildToCollectionIfMissing).toHaveBeenCalledWith(childCollection, child);
      expect(comp.childrenCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const adoptionRequest: IAdoptionRequest = { id: 'CBA' };
      const child: IChild = { id: '865331ab-8e47-44eb-85cd-d751d7b4aeb2' };
      adoptionRequest.child = child;

      activatedRoute.data = of({ adoptionRequest });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(adoptionRequest));
      expect(comp.childrenCollection).toContain(child);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AdoptionRequest>>();
      const adoptionRequest = { id: 'ABC' };
      jest.spyOn(adoptionRequestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adoptionRequest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: adoptionRequest }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(adoptionRequestService.update).toHaveBeenCalledWith(adoptionRequest);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AdoptionRequest>>();
      const adoptionRequest = new AdoptionRequest();
      jest.spyOn(adoptionRequestService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adoptionRequest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: adoptionRequest }));
      saveSubject.complete();

      // THEN
      expect(adoptionRequestService.create).toHaveBeenCalledWith(adoptionRequest);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AdoptionRequest>>();
      const adoptionRequest = { id: 'ABC' };
      jest.spyOn(adoptionRequestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adoptionRequest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(adoptionRequestService.update).toHaveBeenCalledWith(adoptionRequest);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackChildById', () => {
      it('Should return tracked Child primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackChildById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
