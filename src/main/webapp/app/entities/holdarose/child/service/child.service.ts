import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChild, getChildIdentifier } from '../child.model';

export type EntityResponseType = HttpResponse<IChild>;
export type EntityArrayResponseType = HttpResponse<IChild[]>;

@Injectable({ providedIn: 'root' })
export class ChildService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/children', 'holdarose');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(child: IChild): Observable<EntityResponseType> {
    return this.http.post<IChild>(this.resourceUrl, child, { observe: 'response' });
  }

  update(child: IChild): Observable<EntityResponseType> {
    return this.http.put<IChild>(`${this.resourceUrl}/${getChildIdentifier(child) as string}`, child, { observe: 'response' });
  }

  partialUpdate(child: IChild): Observable<EntityResponseType> {
    return this.http.patch<IChild>(`${this.resourceUrl}/${getChildIdentifier(child) as string}`, child, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IChild>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChild[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChildToCollectionIfMissing(childCollection: IChild[], ...childrenToCheck: (IChild | null | undefined)[]): IChild[] {
    const children: IChild[] = childrenToCheck.filter(isPresent);
    if (children.length > 0) {
      const childCollectionIdentifiers = childCollection.map(childItem => getChildIdentifier(childItem)!);
      const childrenToAdd = children.filter(childItem => {
        const childIdentifier = getChildIdentifier(childItem);
        if (childIdentifier == null || childCollectionIdentifiers.includes(childIdentifier)) {
          return false;
        }
        childCollectionIdentifiers.push(childIdentifier);
        return true;
      });
      return [...childrenToAdd, ...childCollection];
    }
    return childCollection;
  }
}
