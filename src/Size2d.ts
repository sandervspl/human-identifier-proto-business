class Size2d {
  public width: number;
  public height: number;

  constructor(w: number, h: number) {
    this.set(w, h);
  }

  public set(w: number, h: number): void {
    this.width = w;
    this.height = h;
  }
}

export default Size2d;
