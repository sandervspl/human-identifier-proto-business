// dependencies
import $ from 'jquery';
import Gate from './Gate';

class GatePopup {
  private $htmlElement: JQuery;
  private gate: Gate;

  constructor(gate: Gate) {
    this.gate = gate;
    this.create();
  }

  public show(): void {
    this.create();
    $('body').append(this.$htmlElement);
  }

  public hide(): void {
    this.$htmlElement.remove();
  }

  private create(): void {
    this.$htmlElement = $(`<div class="gate-mouseover"></div>`);

    const $title = $(`<h3 class="person-mouseover__title">Gate ${this.gate.getId() + 1}</h3>`);
    this.$htmlElement.append($title);

    const $container = $(`<div class="person-mouseover__data"></div>`);
    const $list = $('<ul></ul>');

    const $totalCheckin = this.createListElement('Total checkin', this.gate.totalPeopleCheckedIn.toString());
    $list.append($totalCheckin);

    const $avgPplPerMin = this.createListElement(
      'Average check-ins per minute',
      this.gate.avgPeoplePerMinute.toString()
    );
    $list.append($avgPplPerMin);

    const $avgCheckinTime = this.createListElement(
      'Average check-in time',
      `${this.gate.avgCheckinTimeAmount.toString()} m`
    );
    $list.append($avgCheckinTime);

    $container.append($list);
    this.$htmlElement.append($container);
  }

  private createListElement(prop: string, data: string, data2?: string): JQuery<HTMLElement> {
    return $(
      `<li>
        <div class="person-mouseover__data-prop">${prop}</div>
          <div class="person-mouseover__data-value">${data} ${data2 ? data2 : ''}</div>
       </li>
      `
    );
  }
}

export default GatePopup;
