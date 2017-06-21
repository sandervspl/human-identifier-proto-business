// dependencies
import GameObject from './GameObject';

// assets
const gateImgs = [
  require('./assets/images/gate-number1.png'),
  require('./assets/images/gate-number2.png'),
  require('./assets/images/gate-number3.png'),
  require('./assets/images/gate-number4.png'),
  require('./assets/images/gate-number5.png'),
];

class Gate extends GameObject {
  private isAvailable: boolean;
  private popularity: number;

  constructor(id: number, available: boolean, x: number, y: number) {
    super(x, y, 100, 100, 0);

    this.isAvailable = available;
    this.popularity = 1;

    this.createElement('gate');
    this.draw(id);

    this.setPositionOfSprite(
      this.position.x,
      this.position.y - this.size.height / 2
    );
  }

  private draw(id): void {
    this.$htmlElement.css('backgroundImage', `url(${gateImgs[id]})`);
  }
}

export default Gate;
