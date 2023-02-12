import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FoundationService } from '../service/foundation.service';
import { IFoundation, Foundation } from '../foundation.model';

import { FoundationUpdateComponent } from './foundation-update.component';

describe('Foundation Management Update Component', () => {
  let comp: FoundationUpdateComponent;
  let fixture: ComponentFixture<FoundationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let foundationService: FoundationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FoundationUpdateComponent],
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
      .overrideTemplate(FoundationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FoundationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    foundationService = TestBed.inject(FoundationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const foundation: IFoundation = { id: 'CBA' };

      activatedRoute.data = of({ foundation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(foundation));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Foundation>>();
      const foundation = { id: 'ABC' };
      jest.spyOn(foundationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ foundation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: foundation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(foundationService.update).toHaveBeenCalledWith(foundation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Foundation>>();
      const foundation = new Foundation();
      jest.spyOn(foundationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ foundation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: foundation }));
      saveSubject.complete();

      // THEN
      expect(foundationService.create).toHaveBeenCalledWith(foundation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Foundation>>();
      const foundation = { id: 'ABC' };
      jest.spyOn(foundationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ foundation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(foundationService.update).toHaveBeenCalledWith(foundation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
