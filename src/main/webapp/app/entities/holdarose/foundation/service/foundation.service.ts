import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFoundation, getFoundationIdentifier } from '../foundation.model';

export type EntityResponseType = HttpResponse<IFoundation>;
export type EntityArrayResponseType = HttpResponse<IFoundation[]>;

@Injectable({ providedIn: 'root' })
export class FoundationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/foundations', 'holdarose');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(foundation: IFoundation): Observable<EntityResponseType> {
    return this.http.post<IFoundation>(this.resourceUrl, foundation, { observe: 'response' });
  }

  update(foundation: IFoundation): Observable<EntityResponseType> {
    return this.http.put<IFoundation>(`${this.resourceUrl}/${getFoundationIdentifier(foundation) as string}`, foundation, {
      observe: 'response',
    });
  }

  partialUpdate(foundation: IFoundation): Observable<EntityResponseType> {
    return this.http.patch<IFoundation>(`${this.resourceUrl}/${getFoundationIdentifier(foundation) as string}`, foundation, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IFoundation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFoundation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFoundationToCollectionIfMissing(
    foundationCollection: IFoundation[],
    ...foundationsToCheck: (IFoundation | null | undefined)[]
  ): IFoundation[] {
    const foundations: IFoundation[] = foundationsToCheck.filter(isPresent);
    if (foundations.length > 0) {
      const foundationCollectionIdentifiers = foundationCollection.map(foundationItem => getFoundationIdentifier(foundationItem)!);
      const foundationsToAdd = foundations.filter(foundationItem => {
        const foundationIdentifier = getFoundationIdentifier(foundationItem);
        if (foundationIdentifier == null || foundationCollectionIdentifiers.includes(foundationIdentifier)) {
          return false;
        }
        foundationCollectionIdentifiers.push(foundationIdentifier);
        return true;
      });
      return [...foundationsToAdd, ...foundationCollection];
    }
    return foundationCollection;
  }
}
