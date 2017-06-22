// dependencies
import $ from 'jquery';
import IPersonIdentity from './interfaces/IPersonIdentity';

class PersonPopup {
  private identity: IPersonIdentity;
  private $htmlElement: JQuery;

  constructor(identity: IPersonIdentity) {
    this.identity = identity;
  }

  public show(title?: string): void {
    this.create(title);
    $('body').append(this.$htmlElement);
  }

  public hide(): void {
    if (this.$htmlElement) {
      this.$htmlElement.remove();
    }
  }

  private create(title: string): void {
    this.$htmlElement = $(`<div class="person-mouseover"></div>`);

    if (title) {
      const $title = $(`<h3 class="person-mouseover__title">${title}</h3>`);
      this.$htmlElement.append($title);
    }

    const $container = $(`<div class="person-mouseover__container"></div>`);

    const $photo = $(`<div class="person-mouseover__photo"></div>`);
    $photo.css('backgroundImage', `url(${this.identity.picture})`);
    $container.append($photo);

    const $dataContainer = $(`<div class="person-mouseover__data"></div>`);
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

    $dataContainer.append($list);
    $container.append($dataContainer);
    this.$htmlElement.append($container);
  }

  private createListElement(prop: string, data: string, data2?: string): JQuery<HTMLElement> {
    return $(`<li><div class="person-mouseover__data-prop">${prop}</div> ${data} ${data2 ? data2 : ''} </li>`);
  }
}

export default PersonPopup;
