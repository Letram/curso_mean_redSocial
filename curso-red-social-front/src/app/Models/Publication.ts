export class Publication {
  constructor(
    // tslint:disable-next-line:variable-name
    public _id: string,
    public text: string,
    public file: string,
    public createdAt: string,
    public user: string
  ) {}
}
