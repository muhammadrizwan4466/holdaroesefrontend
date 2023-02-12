import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFoundation } from '../foundation.model';

@Component({
  selector: 'gx-r-foundation-detail',
  templateUrl: './foundation-detail.component.html',
})
export class FoundationDetailComponent implements OnInit {
  foundation: IFoundation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ foundation }) => {
      this.foundation = foundation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
