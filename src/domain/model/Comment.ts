export class Comment {
  public constructor(
    public id: string,
    public authorId: string,
    public spotId: string,
    public body: string,
    public createdAt: Date
  ) {}
}
