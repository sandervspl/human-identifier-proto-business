// dependencies
import IPoint2d from './interfaces/IPoint2d';

class Point2d implements IPoint2d {
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
