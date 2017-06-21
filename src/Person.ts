// dependencies
import $ from 'jquery';
import randomColor from 'randomcolor';
import IPersonIdentity from './interfaces/IPersonIdentity';
import GameObject from './GameObject';
import Gate from './Gate';
import QueueSpot from './QueueSpot';
import App from './app';

class Person extends GameObject {
  private id: number;
  private identity: IPersonIdentity;
  private $mouseOverElement: JQuery;
  private assignedGate: Gate;
  private assignedQueueSpot: QueueSpot;
  private arrivedAtQueueSpot: boolean;
  private app: App;

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
    super(x, y, w, h, 5);

    this.id = id;
    this.identity = identity;
    this.assignedGate = gate;
    this.arrivedAtQueueSpot = false;
    this.app = app;

    this.createElement('person');
    this.createMouseOverElement();
    this.draw();

    this.addEventHandlers();

    this.assignedQueueSpot = this.assignedGate.getQueue()[0];
  }

  public update(): void {
    this.updatePosition();
    this.checkIfArrived();
  }

  public updatePosition(): void {
    if (this.arrivedAtQueueSpot) {
      return;
    }

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
        console.log('y < queuey');
      } else if (y > queueY) {
        this.updatePositionY(this.position.y -= this.getSpeed());
        console.log('y > queuey');
      }
    }

    // if they are too close then just set them on location
    const diffX = Math.abs(this.position.x - queueX);
    const diffY = Math.abs(this.position.y - queueY);

    if (diffX < 5) {
      this.updatePositionX(Math.floor(queueX));
    }

    if (diffY < 5) {
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
      console.log(`person #${this.id} arrived`);
      this.arrivedAtQueueSpot = true;
      this.assignedQueueSpot.toggleTaken();
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
    if (this.assignedGate.getPopularity() <= 0) {
      this.assignNewGate();
    }

    this.assignedQueueSpot = this.assignedGate.getQueue().find(spot => !spot.hasBeenTaken());

    console.log(`gate: ${this.assignedGate.getId()} queue: ${this.assignedQueueSpot.getId()}`);
  }
}

export default Person;
