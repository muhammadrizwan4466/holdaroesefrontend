import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAdoptionRequest } from '../adoption-request.model';

@Component({
  selector: 'gx-r-adoption-request-detail',
  templateUrl: './adoption-request-detail.component.html',
})
export class AdoptionRequestDetailComponent implements OnInit {
  adoptionRequest: IAdoptionRequest | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ adoptionRequest }) => {
      this.adoptionRequest = adoptionRequest;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
