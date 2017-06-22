// dependencies
import randomColor from 'randomcolor';
const random = require('random-js')();
import IPersonIdentity from './interfaces/IPersonIdentity';
import GameObject from './GameObject';
import Gate from './Gate';
import QueueSpot from './QueueSpot';
import App from './app';
import PersonPopup from './PersonPopup';

class Person extends GameObject {
  private app: App;
  private id: number;
  private identity: IPersonIdentity;
  private assignedGate: Gate;
  private assignedQueueSpot: QueueSpot;
  private arrivedAtQueueSpot: boolean;
  private checkinTime: number;
  private startTimeCheckin: number;
  private hasCheckedIn: boolean;
  public popup: PersonPopup;
  public isFinished: boolean;
  public isInQueue: boolean;
  public startedWaiting: number;
  public waitedTime: number = 0;

  constructor(
    id: number,
    x: number,
    y: number,
    w: number,
    h: number,
    identity: IPersonIdentity,
    gate: Gate,
    app: App,
  ) {
    super(x, y, w, h, random.real(1, 2));

    this.app = app;
    this.id = id;
    this.identity = identity;
    this.assignedGate = gate;
    this.arrivedAtQueueSpot = false;
    this.checkinTime = random.integer(500, 5000);
    this.startTimeCheckin = null;
    this.hasCheckedIn = false;
    this.isFinished = false;
    this.isInQueue = false;
    this.popup = new PersonPopup(this.identity);

    this.createElement('person');
    this.draw();

    this.addEventHandlers();

    // this.assignedQueueSpot = this.assignedGate.getQueue()[0];
    this.assignQueueSpot();

    // console.log(`I am assigned to gate ${this.assignedGate.getId()} queue ${this.assignedQueueSpot.getId()}`);
  }

  public update(): void {
    if (this.isFinished) { return; }

    if (this.isInQueue) {
      this.checkIfShuffle();
    }

    if (!this.arrivedAtQueueSpot) {
      this.updatePosition();
      this.checkIfArrived();
    }

    if (this.arrivedAtQueueSpot && !this.hasCheckedIn) {
      this.tryCheckIn();
    }

    if (this.hasCheckedIn) {
      this.walkThroughGate();
    }
  }

  public updatePosition(): void {
    if (this.assignedQueueSpot.hasBeenTaken()) {
      this.assignQueueSpot();
    }

    if (!this.assignedGate.getIsAvailable()) {
      console.log(`Person: ${this.id} - while walking my gate closed. I need new gate.`);
      this.assignNewGate();
    }

    const { x } = this.position;
    const { y } = this.position;

    const { x: queueX } = this.assignedQueueSpot.getMiddlePoint();
    const { y: queueY } = this.assignedQueueSpot.getMiddlePoint();

    if (x !== queueX) {
      if (x < queueX) {
        this.updatePositionX(this.position.x += this.getSpeed());
      } else if (x > queueX) {
        this.updatePositionX(this.position.x -= this.getSpeed());
      }
    }

    if (y !== queueY) {
      if (y < queueY) {
        this.updatePositionY(this.position.y += this.getSpeed());
      } else if (y > queueY) {
        this.updatePositionY(this.position.y -= this.getSpeed());
      }
    }

    // if they are too close then just set them on location
    const diffX = Math.abs(this.position.x - queueX);
    const diffY = Math.abs(this.position.y - queueY);

    if (diffX < 2) {
      this.updatePositionX(Math.floor(queueX));
    }

    if (diffY < 2) {
      this.updatePositionY(Math.floor(queueY));
    }
  }

  private destructor(): void {
    this.assignedGate.avgCheckinTimes.push(this.checkinTime);

    this.popup.hide();
    this.$htmlElement.remove();
  }

  private checkIfArrived(): void {
    const { x } = this.position;
    const { y } = this.position;

    const { x: queueX } = this.assignedQueueSpot.getMiddlePoint();
    const { y: queueY } = this.assignedQueueSpot.getMiddlePoint();

    const hasArrived = !this.arrivedAtQueueSpot && x === queueX && y === queueY;

    if (hasArrived) {
      // console.log(`person #${this.id} arrived`);

      if (!this.isInQueue) {
        this.startedWaiting = Date.now();
        this.assignedGate.incrementQueueNum();
      }

      this.arrivedAtQueueSpot = true;
      this.isInQueue = true;

      this.setSpeed(2);

      this.startTimeCheckin = Date.now();
      this.assignedQueueSpot.setTaken();

      if (this.assignedQueueSpot.getId() === 0) {
        this.assignedQueueSpot.occupant = this;
      }
    }
  }

  private addEventHandlers(): void {
    this.$htmlElement.on('mouseenter', this.handleMouseEnter);
    this.$htmlElement.on('mouseleave', this.handleMouseLeave);
  }

  private handleMouseEnter = (): void => {
    this.$htmlElement.addClass('selected');
    this.popup.show();
  }

  private handleMouseLeave = (): void => {
    this.$htmlElement.removeClass('selected');
    this.popup.hide();
  }

  private draw(): void {
    this.$htmlElement.css('backgroundColor', randomColor());
  }

  private assignNewGate(): void {
    this.assignedGate = this.app.getNewGateAssigned(this.assignedGate.getId());
  }

  private assignQueueSpot(): void {
    // console.log(`gate ${this.assignedGate.getId() + 1} queue: ${this.assignedGate.getQueueNum()}`);

    if (this.assignedGate.getQueueNum() >= 10) {
      console.log(`gate ${this.assignedGate.getId()} has queue longer than 10`);
      if (!this.isInQueue) {
        console.log(`Person ${this.id} needs a new gate`);
        this.assignNewGate();
      }
    }

    this.assignedQueueSpot = this.assignedGate.getQueue().find(spot => !spot.hasBeenTaken());
    this.assignedQueueSpot.occupant = this;

    // console.log(`gate: ${this.assignedGate.getId()} queue: ${this.assignedQueueSpot.getId()}`);
  }

  private tryCheckIn(): void {
    if (this.assignedQueueSpot.getId() !== 0) { return; }

    if (this.waitedTime === 0) {
      this.waitedTime = Date.now() - this.startedWaiting;
      this.assignedGate.avgWaitTimes.push(this.waitedTime);
      console.log(`waited time: ${this.waitedTime}`);
    }

    const curTime = Date.now();
    const diff = curTime - this.startTimeCheckin;

    if (diff > this.checkinTime) {
      this.hasCheckedIn = true;

      // make queue spot available
      this.assignedQueueSpot.setNotTaken();

      // clear up spot in queue
      this.assignedGate.decrementQueueNum();
    }
  }

  private walkThroughGate(): void {
    this.updatePositionY(this.position.y -= this.getSpeed());

    if (this.position.y < this.assignedQueueSpot.getMiddlePoint().y - 20) {
      this.assignedQueueSpot.gate.totalPeopleCheckedIn += 1;
      this.isFinished = true;

      this.destructor();
    }
  }

  private checkIfShuffle(): void {
    const qid = this.assignedQueueSpot.getId();
    const queue = this.assignedGate.getQueue();
    const nextSpot: QueueSpot = queue[qid - 1];

    // console.log(nextSpot);

    if (nextSpot && !nextSpot.hasBeenTaken()) {
      this.assignedQueueSpot.setNotTaken();
      this.assignedQueueSpot = nextSpot;
      this.arrivedAtQueueSpot = false;
    }
  }
}

export default Person;
