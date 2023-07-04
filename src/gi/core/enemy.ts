export class Enemy {
  constructor(
    public name: string = '',
    public level: number = 90
  ) {
  }

  get damageReduction(): number {
    return 0;
  }
  get resistance(): number {
    return 0.1;
  }

}
