// dependencies
import GameObject from './GameObject';
import QueueSpot from './QueueSpot';

// assets
const gateImgs = [
  require('./assets/images/gate-number1.png'),
  require('./assets/images/gate-number2.png'),
  require('./assets/images/gate-number3.png'),
  require('./assets/images/gate-number4.png'),
  require('./assets/images/gate-number5.png'),
];

class Gate extends GameObject {
  private id: number;
  private isAvailable: boolean;
  private popularity: number;
  private queue: QueueSpot[] = [];

  constructor(id: number, available: boolean) {
    super(0, 0, 0, 0, 0);

    this.id = id;
    this.isAvailable = available;
    this.popularity = 1;

    this.createElement('gate-sign');
    this.draw();
    this.setAttributesForSign();

    this.createQueueSpots();
  }

  public getId(): number {
    return this.id;
  }

  private createQueueSpots(): void {
    for (let i = 0; i < 10; i += 1) {
      const x = this.position.x + this.size.width / 2;
      const y = this.position.y + 120;

      const spot = new QueueSpot(i, x, y, this);

      this.queue.push(spot);
    }
  }

  private setAttributesForSign(): void {
    switch (this.id) {
      case 0:
        this.setPosition(190, 122);
        this.setSize(79, 43);
        break;

      case 1:
        this.setPosition(380, 122);
        this.setSize(79, 44);
        break;

      case 2:
        this.setPosition(593, 122);
        this.setSize(74, 43);
        break;

      case 3:
        this.setPosition(833, 122);
        this.setSize(80, 45);
        break;

      case 4:
        this.setPosition(1023, 122);
        this.setSize(80, 45);
        break;

      default: break;
    }
  }

  private draw(): void {
    this.$htmlElement.css('backgroundImage', `url(${gateImgs[this.id]})`);
  }
}

export default Gate;
