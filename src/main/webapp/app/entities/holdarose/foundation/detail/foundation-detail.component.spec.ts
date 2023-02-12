import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FoundationDetailComponent } from './foundation-detail.component';

describe('Foundation Management Detail Component', () => {
  let comp: FoundationDetailComponent;
  let fixture: ComponentFixture<FoundationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoundationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ foundation: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(FoundationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FoundationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load foundation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.foundation).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
