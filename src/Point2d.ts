class Point2d {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.setPosition(x, y);
  }

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export default Point2d;
