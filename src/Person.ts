// dependencies
import $ from 'jquery';
import randomColor from 'randomcolor';
const random = require('random-js')();
import IPersonIdentity from './interfaces/IPersonIdentity';
import GameObject from './GameObject';
import Gate from './Gate';
import QueueSpot from './QueueSpot';
import App from './app';

class Person extends GameObject {
  private app: App;
  private id: number;
  private identity: IPersonIdentity;
  private $mouseOverElement: JQuery;
  private assignedGate: Gate;
  private assignedQueueSpot: QueueSpot;
  private arrivedAtQueueSpot: boolean;
  private checkinTime: number;
  private startTimeCheckin: number;
  private hasCheckedIn: boolean;
  public isFinished: boolean;
  public isInQueue: boolean;

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

    this.createElement('person');
    this.createMouseOverElement();
    this.draw();

    this.addEventHandlers();

    this.assignedQueueSpot = this.assignedGate.getQueue()[0];

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

  private checkIfArrived(): void {
    const { x } = this.position;
    const { y } = this.position;

    const { x: queueX } = this.assignedQueueSpot.getMiddlePoint();
    const { y: queueY } = this.assignedQueueSpot.getMiddlePoint();

    const hasArrived = !this.arrivedAtQueueSpot && x === queueX && y === queueY;

    if (hasArrived) {
      // console.log(`person #${this.id} arrived`);

      if (!this.isInQueue) {
        this.assignedGate.incrementQueueNum();
      }

      this.arrivedAtQueueSpot = true;
      this.isInQueue = true;

      this.setSpeed(2);

      this.startTimeCheckin = Date.now();
      this.assignedQueueSpot.setTaken();
    }
  }

  private addEventHandlers(): void {
    this.$htmlElement.on('mouseenter', this.handleMouseEnter);
    this.$htmlElement.on('mouseleave', this.handleMouseLeave);
  }

  private handleMouseEnter = (): void => {
    $('body').append(this.$mouseOverElement);
    this.$htmlElement.addClass('selected');
  }

  private handleMouseLeave = (): void => {
    $(`[data-person-id=${this.id}]`).remove();
    this.$htmlElement.removeClass('selected');
  }

  private createMouseOverElement(): void {
    this.$mouseOverElement = $(`<div class="person-mouseover" data-person-id=${this.id}></div>`);

    const $list = $('<ul></ul>');

    const $name = $(`<li> ${this.identity.firstName} ${this.identity.lastName} </li>`);
    $list.append($name);

    this.$mouseOverElement.append($list);
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
      if (!this.isInQueue) {
        this.assignNewGate();
      }
    }

    this.assignedQueueSpot = this.assignedGate.getQueue().find(spot => !spot.hasBeenTaken());

    // console.log(`gate: ${this.assignedGate.getId()} queue: ${this.assignedQueueSpot.getId()}`);
  }

  private tryCheckIn(): void {
    if (this.assignedQueueSpot.getId() !== 0) { return; }

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
      this.isFinished = true;
      this.$htmlElement.remove();
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
