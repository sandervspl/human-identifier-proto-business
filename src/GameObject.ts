// dependencies
import $ from 'jquery';
import Point2d from './Point2d';
import Size2d from './Size2d';
import IPoint2d from './interfaces/IPoint2d';

abstract class GameObject {
  protected size: Size2d;
  protected $htmlElement: JQuery;
  public position: Point2d;
  public speed: IPoint2d;

  constructor(x: number, y: number, w: number, h: number, speed: number) {
    this.position = new Point2d(x, y);
    this.size = new Size2d(w, h);
    this.speed = {
      x: speed,
      y: speed,
    };
  }

  public updatePosition(): void {
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    this.$htmlElement.css({
      left: this.position.x,
      top: this.position.y,
    });
  }

  public updatePositionX(x: number): void {
    this.position.x = x;
    this.setPositionOfSprite(x, this.position.y);
  }

  public updatePositionY(y: number): void {
    this.position.y = y;
    this.setPositionOfSprite(this.position.x, y);
  }

  public setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
    this.setPositionOfSprite(x, y);
  }

  public setSize(w: number, h: number): void {
    this.size.width = w;
    this.size.height = h;
    this.setSizeOfSprite(w, h);
  }

  protected createElement(className?: string): void {
    this.$htmlElement = $(`<div class="game-object ${className}"></div>`);

    this.setPositionOfSprite(this.position.x, this.position.y);
    this.setSizeOfSprite(this.size.width, this.size.height);

    $('body').append(this.$htmlElement);
  }

  private setPositionOfSprite(x: number, y: number): void {
    this.$htmlElement.css({ left: x, top: y });
  }

  private setSizeOfSprite(w: number, h: number): void {
    this.$htmlElement.css({ width: w, height: h });
  }
}

export default GameObject;
