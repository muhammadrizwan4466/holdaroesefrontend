import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AdoptionRequestDetailComponent } from './adoption-request-detail.component';

describe('AdoptionRequest Management Detail Component', () => {
  let comp: AdoptionRequestDetailComponent;
  let fixture: ComponentFixture<AdoptionRequestDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdoptionRequestDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ adoptionRequest: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(AdoptionRequestDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AdoptionRequestDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load adoptionRequest on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.adoptionRequest).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
