// dependencies
import $ from 'jquery';
import randomColor from 'randomcolor';
import GameObject from './GameObject';
import IPersonIdentity from './interfaces/IPersonIdentity';

class Person extends GameObject {
  private id: number;
  private identity: IPersonIdentity;
  private $mouseOverElement: JQuery;

  constructor(
    id: number,
    x: number,
    y: number,
    w: number,
    h: number,
    // tslint:disable-next-line
    identity: IPersonIdentity
  ) {
    super(x, y, w, h, 5);

    this.id = id;
    this.identity = identity;

    this.createElement('person');
    this.createMouseOverElement();
    this.draw();

    this.addEventHandlers();
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
}

export default Person;
