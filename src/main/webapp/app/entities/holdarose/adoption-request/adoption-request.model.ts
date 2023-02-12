import { IChild } from 'app/entities/holdarose/child/child.model';

export interface IAdoptionRequest {
  id?: string;
  childName?: string;
  cnic?: string;
  fosterName?: string | null;
  fosterJobTitle?: string | null;
  fosterAddress?: string | null;
  approved?: boolean | null;
  foundationName?: string;
  child?: IChild | null;
}

export class AdoptionRequest implements IAdoptionRequest {
  constructor(
    public id?: string,
    public childName?: string,
    public cnic?: string,
    public fosterName?: string | null,
    public fosterJobTitle?: string | null,
    public fosterAddress?: string | null,
    public approved?: boolean | null,
    public foundationName?: string,
    public child?: IChild | null
  ) {
    this.approved = this.approved ?? false;
  }
}

export function getAdoptionRequestIdentifier(adoptionRequest: IAdoptionRequest): string | undefined {
  return adoptionRequest.id;
}
