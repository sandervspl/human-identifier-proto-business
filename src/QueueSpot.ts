// dependencies
import GameObject from './GameObject';
import Gate from './Gate';
import IPoint2d from './interfaces/IPoint2d';

class QueueSpot extends GameObject {
  private id: number;
  private isTaken: boolean;
  private gate: Gate;

  constructor(id: number, x: number, y: number, gate: Gate) {
    super(x, y, 20, 20, 0);

    this.id = id;
    this.isTaken = false;
    this.gate = gate;

    this.createElement('queue-spot');
    this.$htmlElement.attr({'data-gate-id': this.gate.getId(), 'data-queue-id': this.id });

    // position correction
    this.setPosition(
      Math.floor(this.position.x - this.size.width / 2),
      Math.floor(this.position.y + this.id * (this.size.height + 5))
    );
  }

  public getId(): number {
    return this.id;
  }

  public hasBeenTaken(): boolean {
    return this.isTaken;
  }

  public toggleTaken(): void {
    this.isTaken = !this.isTaken;
  }

  public getMiddlePoint(): IPoint2d {
    return {
      x: this.position.x,
      y: this.position.y,
    };
  }
}

export default QueueSpot;
