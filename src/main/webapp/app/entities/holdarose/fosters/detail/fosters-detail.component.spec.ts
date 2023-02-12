import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FostersDetailComponent } from './fosters-detail.component';

describe('Fosters Management Detail Component', () => {
  let comp: FostersDetailComponent;
  let fixture: ComponentFixture<FostersDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FostersDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ fosters: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(FostersDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FostersDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load fosters on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.fosters).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
