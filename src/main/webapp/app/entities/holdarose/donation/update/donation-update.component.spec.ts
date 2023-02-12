import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DonationService } from '../service/donation.service';
import { IDonation, Donation } from '../donation.model';
import { IFoundation } from 'app/entities/holdarose/foundation/foundation.model';
import { FoundationService } from 'app/entities/holdarose/foundation/service/foundation.service';

import { DonationUpdateComponent } from './donation-update.component';

describe('Donation Management Update Component', () => {
  let comp: DonationUpdateComponent;
  let fixture: ComponentFixture<DonationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let donationService: DonationService;
  let foundationService: FoundationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DonationUpdateComponent],
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
      .overrideTemplate(DonationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DonationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    donationService = TestBed.inject(DonationService);
    foundationService = TestBed.inject(FoundationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Foundation query and add missing value', () => {
      const donation: IDonation = { id: 'CBA' };
      const foundation: IFoundation = { id: '0fe390e3-c1bb-4513-9fca-d6b604e669cf' };
      donation.foundation = foundation;

      const foundationCollection: IFoundation[] = [{ id: '5e0eecf2-e39a-4f9f-ae42-3f30adf599f5' }];
      jest.spyOn(foundationService, 'query').mockReturnValue(of(new HttpResponse({ body: foundationCollection })));
      const additionalFoundations = [foundation];
      const expectedCollection: IFoundation[] = [...additionalFoundations, ...foundationCollection];
      jest.spyOn(foundationService, 'addFoundationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ donation });
      comp.ngOnInit();

      expect(foundationService.query).toHaveBeenCalled();
      expect(foundationService.addFoundationToCollectionIfMissing).toHaveBeenCalledWith(foundationCollection, ...additionalFoundations);
      expect(comp.foundationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const donation: IDonation = { id: 'CBA' };
      const foundation: IFoundation = { id: '4debeff6-6fa7-4a64-aaf8-e5875b435cbf' };
      donation.foundation = foundation;

      activatedRoute.data = of({ donation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(donation));
      expect(comp.foundationsSharedCollection).toContain(foundation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Donation>>();
      const donation = { id: 'ABC' };
      jest.spyOn(donationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ donation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: donation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(donationService.update).toHaveBeenCalledWith(donation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Donation>>();
      const donation = new Donation();
      jest.spyOn(donationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ donation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: donation }));
      saveSubject.complete();

      // THEN
      expect(donationService.create).toHaveBeenCalledWith(donation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Donation>>();
      const donation = { id: 'ABC' };
      jest.spyOn(donationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ donation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(donationService.update).toHaveBeenCalledWith(donation);
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
