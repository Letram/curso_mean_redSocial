export class Message {
  constructor(
    public _id: string,
    public text: string,
    public viewed: string,
    public createdAt: string,
    public emmiter: string,
    public receiver: string
  ) {}
}
