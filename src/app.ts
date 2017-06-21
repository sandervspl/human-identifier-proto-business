// dependencies
import $ from 'jquery';
import Person from './Person';
import IdentitiesFetcher from './IdentitiesFetcher';
const random = require('random-js')();

// style
import './style/style.styl';
import IPersonIdentity from './interfaces/IPersonIdentity';

class App {
  private identities: IPersonIdentity[] = [];
  private people: Person[] = [];

  constructor() {
    this.fetchIdentities();
  }

  private async fetchIdentities(): Promise<any> {
    this.identities = await IdentitiesFetcher.getInstance().fetchIdentities();

    $('#loader').removeClass('loading');

    // start app
    this.start();
  }

  private start(): void {
    this.generatePeople();
  }

  private generatePeople(): void {
    for (let i = 0; i < 50; i += 1) {
      const personSize = 20;
      const maxX = window.innerWidth - personSize;
      const maxY = window.innerHeight - personSize;

      const num = random.integer(0, this.identities.length - 1);
      const randomIdentity = this.identities[num];

      const randomX = random.integer(personSize, maxX);
      const randomY = random.integer(personSize, maxY);

      const person = new Person(randomX, randomY, 20, 20, randomIdentity);

      this.people.push(person);
    }
  }
}

// start app
new App();

export default App;
