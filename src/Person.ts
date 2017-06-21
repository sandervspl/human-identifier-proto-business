// dependencies
import randomColor from 'randomcolor';
import GameObject from './GameObject';
import IPersonIdentity from './interfaces/IPersonIdentity';

class Person extends GameObject {
  private identity: IPersonIdentity;

  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    // tslint:disable-next-line
    identity: IPersonIdentity
  ) {
    super(x, y, w, h, 5);

    this.identity = identity;

    this.createElement('person');
    this.draw();

    console.log(this);
  }

  private draw(): void {
    this.$htmlElement.css('backgroundColor', randomColor());
  }
}

export default Person;
