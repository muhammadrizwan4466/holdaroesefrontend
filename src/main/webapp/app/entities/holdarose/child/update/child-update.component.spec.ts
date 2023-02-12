import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChildService } from '../service/child.service';
import { IChild, Child } from '../child.model';
import { IFoundation } from 'app/entities/holdarose/foundation/foundation.model';
import { FoundationService } from 'app/entities/holdarose/foundation/service/foundation.service';

import { ChildUpdateComponent } from './child-update.component';

describe('Child Management Update Component', () => {
  let comp: ChildUpdateComponent;
  let fixture: ComponentFixture<ChildUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let childService: ChildService;
  let foundationService: FoundationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChildUpdateComponent],
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
      .overrideTemplate(ChildUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChildUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    childService = TestBed.inject(ChildService);
    foundationService = TestBed.inject(FoundationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Foundation query and add missing value', () => {
      const child: IChild = { id: 'CBA' };
      const foundation: IFoundation = { id: 'd57a3609-ebc8-41f2-83b3-92324d6764de' };
      child.foundation = foundation;

      const foundationCollection: IFoundation[] = [{ id: '4afebb74-c2eb-4aa7-b4e5-1e7c0f19f732' }];
      jest.spyOn(foundationService, 'query').mockReturnValue(of(new HttpResponse({ body: foundationCollection })));
      const additionalFoundations = [foundation];
      const expectedCollection: IFoundation[] = [...additionalFoundations, ...foundationCollection];
      jest.spyOn(foundationService, 'addFoundationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ child });
      comp.ngOnInit();

      expect(foundationService.query).toHaveBeenCalled();
      expect(foundationService.addFoundationToCollectionIfMissing).toHaveBeenCalledWith(foundationCollection, ...additionalFoundations);
      expect(comp.foundationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const child: IChild = { id: 'CBA' };
      const foundation: IFoundation = { id: '354d74a2-3747-4928-b662-60a07ba7a8ac' };
      child.foundation = foundation;

      activatedRoute.data = of({ child });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(child));
      expect(comp.foundationsSharedCollection).toContain(foundation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Child>>();
      const child = { id: 'ABC' };
      jest.spyOn(childService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ child });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: child }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(childService.update).toHaveBeenCalledWith(child);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Child>>();
      const child = new Child();
      jest.spyOn(childService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ child });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: child }));
      saveSubject.complete();

      // THEN
      expect(childService.create).toHaveBeenCalledWith(child);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Child>>();
      const child = { id: 'ABC' };
      jest.spyOn(childService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ child });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(childService.update).toHaveBeenCalledWith(child);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFoundationById', () => {
      it('Should return tracked Foundation primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackFoundationById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
