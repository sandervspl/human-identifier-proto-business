import IPoint2d from '../interfaces/IPoint2d';
class VectorMath {
  public static vec_mag(vec: IPoint2d): number { // get the magnitude of the vector
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
  }

  public static vec_sub(a: IPoint2d, b: IPoint2d): IPoint2d { // subtract two vectors
    return { x: a.x - b.x, y: a.y - b.y };
  }

  public static vec_add(a: IPoint2d, b: IPoint2d): IPoint2d { // add two vectors
    return { x: a.x + b.x, y: a.y + b.y };
  }

  public static vec_mul(a: IPoint2d, c: number): IPoint2d { // multiply a vector by a scalar
    return { x: a.x * c, y: a.y * c };
  }

  public static vec_div(a: IPoint2d, c: number): IPoint2d { // divide == multiply by 1/c
    return VectorMath.vec_mul(a, 1.0 / c);
  }

  public static vec_normal(a: IPoint2d): IPoint2d { // normalize vector
    return VectorMath.vec_div(a, VectorMath.vec_mag(a));
  }
}

export default VectorMath;
