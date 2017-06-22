import IPersonIdentity from './interfaces/IPersonIdentity';
class PersonPopup {
  private identity: IPersonIdentity;
  private $mouseOverElement: JQuery;

  constructor(identity: IPersonIdentity) {
    this.identity = identity;
    this.create();
  }

  private create(): void {
    this.$mouseOverElement = $(`<div class="person-mouseover"></div>`);

    const $list = $('<ul></ul>');

    const $name = $(`<li> ${this.identity.firstName} ${this.identity.lastName} </li>`);
    $list.append($name);

    this.$mouseOverElement.append($list);
  }
}

export default PersonPopup;
