// dependencies
import GameObject from './GameObject';
import QueueSpot from './QueueSpot';
import AvailableLight from './AvailableLight';
import GatePopup from './GatePopup';

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
  private queueNum: number;
  private availableLight: AvailableLight;
  private popup: GatePopup;

  // data
  public startTimeDataFarming: number = Date.now();
  public avgPeoplePerMinute: number = 0;
  public avgCheckinTimes: number[] = [];
  public avgCheckinTimeAmount: number = 0;
  public avgWaitTime: number = 0;
  public totalPeopleCheckedIn: number = 0;

  constructor(id: number, available: boolean) {
    super(0, 0, 0, 0, 0);

    this.id = id;
    this.popularity = 10;
    this.queueNum = 0;
    this.popup = new GatePopup(this);

    this.createElement('gate-sign');
    this.draw();
    this.setAttributesForSign();

    this.isAvailable = available;

    this.availableLight = new AvailableLight(
      this,
      this.position.x,
      this.position.y + 60,
    );

    this.createQueueSpots();

    if (this.id === 1) {
      this.setAvailableStatus(true);
    }

    this.addEventHandlers();
  }

  public getId(): number {
    return this.id;
  }

  public getPopularity(): number {
    return this.popularity;
  }

  public getQueue(): QueueSpot[] {
    return this.queue;
  }

  public incrementQueueNum(): void {
    this.queueNum += 1;
    this.popularity -= 1;
  }

  public decrementQueueNum(): void {
    this.queueNum -= 1;
    this.popularity += 1;

    // console.log(`gate: ${this.id + 1} queue: ${this.queueNum}`);

    if (this.queueNum === 0) {
      // always leave at least one gate open
      if (this.id !== 0) {
        this.setAvailableStatus(false);
      }
    }
  }

  public getQueueNum(): number {
    return this.queueNum;
  }

  public setAvailableStatus(available: boolean): void {
    this.isAvailable = available;
    this.availableLight.draw();

    if (available === false) {
      this.queue[0].occupant = null;
    }
  }

  public getIsAvailable(): boolean {
    return this.isAvailable;
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

  private addEventHandlers(): void {
    this.$htmlElement.on('mouseenter', this.handleMouseEnter);
    this.$htmlElement.on('mouseleave', this.handleMouseLeave);
  }

  private handleMouseEnter = (): void => {
    // this.$htmlElement.addClass('selected');
    const person = this.queue[0].occupant;

    if (person) {
      person.popup.show('Currently checking in');
    }

    // set data
    // avg people per minute
    this.avgPeoplePerMinute = this.totalPeopleCheckedIn / ((Date.now() - this.startTimeDataFarming) / 60000);
    this.avgPeoplePerMinute = Math.floor(this.avgPeoplePerMinute);

    // avg checkin time
    if (this.avgCheckinTimes.length === 0) {
      this.avgCheckinTimeAmount = 0;
    } else {
      const sum = this.avgCheckinTimes.reduce((previous, current) => current += previous);
      this.avgCheckinTimeAmount = Math.round((sum / this.avgCheckinTimes.length) / 1000);
    }

    this.popup.show();
  }

  private handleMouseLeave = (): void => {
    // this.$htmlElement.removeClass('selected');
    const person = this.queue[0].occupant;

    if (person) {
      person.popup.hide();
    }

    this.popup.hide();
  }
}

export default Gate;
