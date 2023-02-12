import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAdoptionRequest, getAdoptionRequestIdentifier } from '../adoption-request.model';

export type EntityResponseType = HttpResponse<IAdoptionRequest>;
export type EntityArrayResponseType = HttpResponse<IAdoptionRequest[]>;

@Injectable({ providedIn: 'root' })
export class AdoptionRequestService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/adoption-requests', 'holdarose');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(adoptionRequest: IAdoptionRequest): Observable<EntityResponseType> {
    return this.http.post<IAdoptionRequest>(this.resourceUrl, adoptionRequest, { observe: 'response' });
  }

  update(adoptionRequest: IAdoptionRequest): Observable<EntityResponseType> {
    return this.http.put<IAdoptionRequest>(
      `${this.resourceUrl}/${getAdoptionRequestIdentifier(adoptionRequest) as string}`,
      adoptionRequest,
      { observe: 'response' }
    );
  }

  partialUpdate(adoptionRequest: IAdoptionRequest): Observable<EntityResponseType> {
    return this.http.patch<IAdoptionRequest>(
      `${this.resourceUrl}/${getAdoptionRequestIdentifier(adoptionRequest) as string}`,
      adoptionRequest,
      { observe: 'response' }
    );
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IAdoptionRequest>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAdoptionRequest[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAdoptionRequestToCollectionIfMissing(
    adoptionRequestCollection: IAdoptionRequest[],
    ...adoptionRequestsToCheck: (IAdoptionRequest | null | undefined)[]
  ): IAdoptionRequest[] {
    const adoptionRequests: IAdoptionRequest[] = adoptionRequestsToCheck.filter(isPresent);
    if (adoptionRequests.length > 0) {
      const adoptionRequestCollectionIdentifiers = adoptionRequestCollection.map(
        adoptionRequestItem => getAdoptionRequestIdentifier(adoptionRequestItem)!
      );
      const adoptionRequestsToAdd = adoptionRequests.filter(adoptionRequestItem => {
        const adoptionRequestIdentifier = getAdoptionRequestIdentifier(adoptionRequestItem);
        if (adoptionRequestIdentifier == null || adoptionRequestCollectionIdentifiers.includes(adoptionRequestIdentifier)) {
          return false;
        }
        adoptionRequestCollectionIdentifiers.push(adoptionRequestIdentifier);
        return true;
      });
      return [...adoptionRequestsToAdd, ...adoptionRequestCollection];
    }
    return adoptionRequestCollection;
  }
}
