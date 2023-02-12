import { IDonation } from 'app/entities/holdarose/donation/donation.model';
import { IChild } from 'app/entities/holdarose/child/child.model';

export interface IFoundation {
  id?: string;
  name?: string;
  email?: string;
  description?: string | null;
  location?: string | null;
  donations?: IDonation[] | null;
  children?: IChild[] | null;
}

export class Foundation implements IFoundation {
  constructor(
    public id?: string,
    public name?: string,
    public email?: string,
    public description?: string | null,
    public location?: string | null,
    public donations?: IDonation[] | null,
    public children?: IChild[] | null
  ) {}
}

export function getFoundationIdentifier(foundation: IFoundation): string | undefined {
  return foundation.id;
}
