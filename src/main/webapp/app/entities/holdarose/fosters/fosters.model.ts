import { IChild } from 'app/entities/holdarose/child/child.model';

export interface IFosters {
  id?: string;
  name?: string | null;
  cnic?: string | null;
  email?: string | null;
  jobTitle?: string | null;
  location?: string | null;
  child?: IChild | null;
}

export class Fosters implements IFosters {
  constructor(
    public id?: string,
    public name?: string | null,
    public cnic?: string | null,
    public email?: string | null,
    public jobTitle?: string | null,
    public location?: string | null,
    public child?: IChild | null
  ) {}
}

export function getFostersIdentifier(fosters: IFosters): string | undefined {
  return fosters.id;
}
