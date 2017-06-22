// dependencies
import $ from 'jquery';
import IPersonIdentity from './interfaces/IPersonIdentity';

class PersonPopup {
  private identity: IPersonIdentity;
  private $htmlElement: JQuery;

  constructor(identity: IPersonIdentity) {
    this.identity = identity;
    this.create();
  }

  public show(): void {
    $('body').append(this.$htmlElement);
  }

  public hide(): void {
    this.$htmlElement.remove();
  }

  private create(): void {
    this.$htmlElement = $(`<div class="person-mouseover"></div>`);

    const $photo = $(`<div class="person-mouseover__photo"></div>`);
    $photo.css('backgroundImage', `url(${this.identity.picture})`);
    this.$htmlElement.append($photo);

    const $container = $(`<div class="person-mouseover__data"></div>`);
    const $list = $('<ul></ul>');

    const $name = this.createListElement('Name', this.identity.firstName, this.identity.lastName);
    $list.append($name);

    const $dob = this.createListElement('DOB', this.identity.dateOfBirth);
    $list.append($dob);

    const $gender = this.createListElement('Gender', this.identity.gender);
    $list.append($gender);

    const $ppid = this.createListElement('passport id', this.identity.passportId);
    $list.append($ppid);

    const $nat = this.createListElement('nationality', this.identity.nationality);
    $list.append($nat);

    $container.append($list);
    this.$htmlElement.append($container);
  }

  private createListElement(prop: string, data: string, data2?: string): JQuery<HTMLElement> {
    return $(`<li><div class="person-mouseover__data-prop">${prop}</div> ${data} ${data2 ? data2 : ''} </li>`);
  }
}

export default PersonPopup;
