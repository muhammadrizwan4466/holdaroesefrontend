import { IFosters } from 'app/entities/holdarose/fosters/fosters.model';
import { IAdoptionRequest } from 'app/entities/holdarose/adoption-request/adoption-request.model';
import { IFoundation } from 'app/entities/holdarose/foundation/foundation.model';
import { Gender } from 'app/entities/enumerations/gender.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IChild {
  id?: string;
  name?: string | null;
  age?: number | null;
  imageContentType?: string | null;
  image?: string | null;
  gender?: Gender | null;
  status?: Status | null;
  fosters?: IFosters[] | null;
  adoptionRequest?: IAdoptionRequest | null;
  foundation?: IFoundation | null;
}

export class Child implements IChild {
  constructor(
    public id?: string,
    public name?: string | null,
    public age?: number | null,
    public imageContentType?: string | null,
    public image?: string | null,
    public gender?: Gender | null,
    public status?: Status | null,
    public fosters?: IFosters[] | null,
    public adoptionRequest?: IAdoptionRequest | null,
    public foundation?: IFoundation | null
  ) {}
}

export function getChildIdentifier(child: IChild): string | undefined {
  return child.id;
}
