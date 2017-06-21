// dependencies
import GameObject from './GameObject';
import Gate from './Gate';

class AvailableLight extends GameObject {
  private gate: Gate;

  constructor(gate: Gate, x, y) {
    super(x, y, 100, 20, 0);

    this.gate = gate;

    this.createElement('available-light');
    this.draw();
  }

  public draw(): void {
    if (this.gate.getIsAvailable()) {
      this.$htmlElement.addClass('available');
    } else {
      this.$htmlElement.removeClass('available');
    }
  }
}

export default AvailableLight;
