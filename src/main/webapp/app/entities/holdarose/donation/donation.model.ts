import { IFoundation } from 'app/entities/holdarose/foundation/foundation.model';
import { PaymentMethod } from 'app/entities/enumerations/payment-method.model';

export interface IDonation {
  id?: string;
  name?: string | null;
  cnic?: string;
  address?: string | null;
  foundationName?: string | null;
  donationAmount?: string | null;
  paymentMethod?: PaymentMethod | null;
  foundation?: IFoundation | null;
}

export class Donation implements IDonation {
  constructor(
    public id?: string,
    public name?: string | null,
    public cnic?: string,
    public address?: string | null,
    public foundationName?: string | null,
    public donationAmount?: string | null,
    public paymentMethod?: PaymentMethod | null,
    public foundation?: IFoundation | null
  ) {}
}

export function getDonationIdentifier(donation: IDonation): string | undefined {
  return donation.id;
}
