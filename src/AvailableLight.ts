// dependencies
import GameObject from './GameObject';

class AvailableLight extends GameObject {
  private isAvailable: boolean;

  constructor(isAvailable: boolean, x, y) {
    super(x, y, 100, 20, 0);

    this.isAvailable = isAvailable;

    this.createElement('available-light');
    this.draw();
  }

  private draw(): void {
    if (this.isAvailable) {
      this.$htmlElement.addClass('available');
    }
  }
}

export default AvailableLight;
