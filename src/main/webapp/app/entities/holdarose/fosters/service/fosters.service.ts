import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFosters, getFostersIdentifier } from '../fosters.model';

export type EntityResponseType = HttpResponse<IFosters>;
export type EntityArrayResponseType = HttpResponse<IFosters[]>;

@Injectable({ providedIn: 'root' })
export class FostersService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fosters', 'holdarose');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(fosters: IFosters): Observable<EntityResponseType> {
    return this.http.post<IFosters>(this.resourceUrl, fosters, { observe: 'response' });
  }

  update(fosters: IFosters): Observable<EntityResponseType> {
    return this.http.put<IFosters>(`${this.resourceUrl}/${getFostersIdentifier(fosters) as string}`, fosters, { observe: 'response' });
  }

  partialUpdate(fosters: IFosters): Observable<EntityResponseType> {
    return this.http.patch<IFosters>(`${this.resourceUrl}/${getFostersIdentifier(fosters) as string}`, fosters, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IFosters>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFosters[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFostersToCollectionIfMissing(fostersCollection: IFosters[], ...fostersToCheck: (IFosters | null | undefined)[]): IFosters[] {
    const fosters: IFosters[] = fostersToCheck.filter(isPresent);
    if (fosters.length > 0) {
      const fostersCollectionIdentifiers = fostersCollection.map(fostersItem => getFostersIdentifier(fostersItem)!);
      const fostersToAdd = fosters.filter(fostersItem => {
        const fostersIdentifier = getFostersIdentifier(fostersItem);
        if (fostersIdentifier == null || fostersCollectionIdentifiers.includes(fostersIdentifier)) {
          return false;
        }
        fostersCollectionIdentifiers.push(fostersIdentifier);
        return true;
      });
      return [...fostersToAdd, ...fostersCollection];
    }
    return fostersCollection;
  }
}
