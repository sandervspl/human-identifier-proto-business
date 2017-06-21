// dependencies
import $ from 'jquery';
import Point2d from './Point2d';
import Size2d from './Size2d';

abstract class GameObject {
  protected position: Point2d;
  protected size: Size2d;
  protected $htmlElement: JQuery;
  private speed: number;

  constructor(x: number, y: number, w: number, h: number, speed: number) {
    this.position = new Point2d(x, y);
    this.size = new Size2d(w, h);
    this.speed = speed;
  }

  // public update(): void {}

  public updatePosition(): void {
    this.$htmlElement.css({
      left: this.position.x + this.speed,
      top: this.position.y + this.speed,
    });
  }

  public setPositionOfSprite(x: number, y: number): void {
    this.$htmlElement.css({ left: x, top: y });
  }

  public setSizeOfSprite(w: number, h: number): void {
    this.$htmlElement.css({ width: w, height: h });
  }

  protected createElement(className?: string): void {
    this.$htmlElement = $(`<div class="game-object ${className}"></div>`);

    this.setPositionOfSprite(this.position.x, this.position.y);
    this.setSizeOfSprite(this.size.width, this.size.height);

    $('body').append(this.$htmlElement);
  }
}

export default GameObject;
