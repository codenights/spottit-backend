import { Location } from './Location'

export class Spot {
  public constructor(
    public id: string,
    public name: string,
    public description: string | null,
    public location: Location,
    public authorId: string,
    public tags: string[]
  ) {}
}
