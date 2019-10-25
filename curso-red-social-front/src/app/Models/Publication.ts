import {User} from "./User";

export class Publication {
  constructor(
    // tslint:disable-next-line:variable-name
    public _id: string,
    public text: string,
    public file: string,
    public created_at: string,
    public user: User
  ) {}
}
