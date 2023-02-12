import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFosters } from '../fosters.model';

@Component({
  selector: 'gx-r-fosters-detail',
  templateUrl: './fosters-detail.component.html',
})
export class FostersDetailComponent implements OnInit {
  fosters: IFosters | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fosters }) => {
      this.fosters = fosters;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
