import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FostersService } from '../service/fosters.service';
import { IFosters, Fosters } from '../fosters.model';
import { IChild } from 'app/entities/holdarose/child/child.model';
import { ChildService } from 'app/entities/holdarose/child/service/child.service';

import { FostersUpdateComponent } from './fosters-update.component';

describe('Fosters Management Update Component', () => {
  let comp: FostersUpdateComponent;
  let fixture: ComponentFixture<FostersUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fostersService: FostersService;
  let childService: ChildService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FostersUpdateComponent],
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
      .overrideTemplate(FostersUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FostersUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fostersService = TestBed.inject(FostersService);
    childService = TestBed.inject(ChildService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Child query and add missing value', () => {
      const fosters: IFosters = { id: 'CBA' };
      const child: IChild = { id: '25967a08-cf54-4041-adcd-c597757c621a' };
      fosters.child = child;

      const childCollection: IChild[] = [{ id: '166b146f-6b88-416b-9dc5-1b3ad616268a' }];
      jest.spyOn(childService, 'query').mockReturnValue(of(new HttpResponse({ body: childCollection })));
      const additionalChildren = [child];
      const expectedCollection: IChild[] = [...additionalChildren, ...childCollection];
      jest.spyOn(childService, 'addChildToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ fosters });
      comp.ngOnInit();

      expect(childService.query).toHaveBeenCalled();
      expect(childService.addChildToCollectionIfMissing).toHaveBeenCalledWith(childCollection, ...additionalChildren);
      expect(comp.childrenSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const fosters: IFosters = { id: 'CBA' };
      const child: IChild = { id: '69ab1190-8141-46d9-a2e1-2176e1d9bd59' };
      fosters.child = child;

      activatedRoute.data = of({ fosters });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(fosters));
      expect(comp.childrenSharedCollection).toContain(child);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Fosters>>();
      const fosters = { id: 'ABC' };
      jest.spyOn(fostersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fosters });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fosters }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(fostersService.update).toHaveBeenCalledWith(fosters);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Fosters>>();
      const fosters = new Fosters();
      jest.spyOn(fostersService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fosters });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fosters }));
      saveSubject.complete();

      // THEN
      expect(fostersService.create).toHaveBeenCalledWith(fosters);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Fosters>>();
      const fosters = { id: 'ABC' };
      jest.spyOn(fostersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fosters });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fostersService.update).toHaveBeenCalledWith(fosters);
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
