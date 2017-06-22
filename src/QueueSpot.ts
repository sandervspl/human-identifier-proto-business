// dependencies
import GameObject from './GameObject';
import Gate from './Gate';
import IPoint2d from './interfaces/IPoint2d';
import Person from './Person';

class QueueSpot extends GameObject {
  private id: number;
  private isTaken: boolean;
  public gate: Gate;
  public occupant: Person;

  constructor(id: number, x: number, y: number, gate: Gate) {
    super(x, y, 20, 20, 0);

    this.id = id;
    this.isTaken = false;
    this.gate = gate;
    this.occupant = null;

    this.createElement('queue-spot');
    // this.$htmlElement.attr({'data-gate-id': this.gate.getId(), 'data-queue-id': this.id });

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

  public setNotTaken(): void {
    this.isTaken = false;
    // this.gate.decrementQueueNum();
    this.draw();
  }

  public setTaken(): void {
    this.isTaken = true;
    // this.gate.incrementQueueNum();
    this.draw();
  }

  public getMiddlePoint(): IPoint2d {
    return {
      x: this.position.x,
      y: this.position.y,
    };
  }

  private draw(): void {
    // if (this.isTaken) {
    //   this.$htmlElement.addClass('taken');
    // } else {
    //   this.$htmlElement.removeClass('taken');
    // }
  }
}

export default QueueSpot;
