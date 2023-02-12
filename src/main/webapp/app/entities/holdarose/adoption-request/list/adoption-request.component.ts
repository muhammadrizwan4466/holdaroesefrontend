import {Component, OnInit} from '@angular/core';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {IAdoptionRequest} from '../adoption-request.model';

import {ASC, DESC, ITEMS_PER_PAGE, SORT} from 'app/config/pagination.constants';
import {AdoptionRequestService} from '../service/adoption-request.service';
import {AdoptionRequestDeleteDialogComponent} from '../delete/adoption-request-delete-dialog.component';
import {map} from "rxjs/operators";

@Component({
  selector: 'gx-r-adoption-request',
  templateUrl: './adoption-request.component.html',
})
export class AdoptionRequestComponent implements OnInit {
  adoptionRequests?: IAdoptionRequest[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  adoption: IAdoptionRequest | null = null;

  constructor(
    protected adoptionRequestService: AdoptionRequestService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.adoptionRequestService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IAdoptionRequest[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  acceptRequest(id: string | undefined): void {
    if (id) {
      this.adoptionRequestService.find(id)
        .pipe(map((res: HttpResponse<IAdoptionRequest>) => res.body ?? null))
        .subscribe((adoptionRequest: IAdoptionRequest | null) => {
          this.adoption = adoptionRequest
          if (adoptionRequest){
            adoptionRequest.approved = true;
            this.adoptionRequestService.update(adoptionRequest)
              .pipe(map((res: HttpResponse<IAdoptionRequest>)=> res.body ?? null))
              .subscribe((adoptionRequest1: IAdoptionRequest | null)=>{
               this.adoption = adoptionRequest1;
               this.loadPage();
              });
          }
        });
    }
  }

  trackId(_index: number, item: IAdoptionRequest): string {
    return item.id!;
  }

  delete(adoptionRequest: IAdoptionRequest): void {
    const modalRef = this.modalService.open(AdoptionRequestDeleteDialogComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.adoptionRequest = adoptionRequest;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: IAdoptionRequest[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/adoption-request'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.adoptionRequests = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
