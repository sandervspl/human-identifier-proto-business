// dependencies
import randomColor from 'randomcolor';
import GameObject from './GameObject';

class Person extends GameObject {
  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);

    this.createElement('person');
    this.draw();
  }

  private draw(): void {
    this.$htmlElement.css('backgroundColor', randomColor());
  }
}

export default Person;
