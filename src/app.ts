// dependencies
import $ from 'jquery';
import Person from './Person';
import IdentitiesFetcher from './IdentitiesFetcher';
// import Gate from './Gate';
const random = require('random-js')();

// style
import './style/style.styl';
import IPersonIdentity from './interfaces/IPersonIdentity';

// assets
const gatesBackImg = require('./assets/images/gates-background.png');
const gatesFrontImg = require('./assets/images/gates-front.png');
const gatesRoofImg = require('./assets/images/gates-roof.png');

class App {
  private identities: IPersonIdentity[] = [];
  private people: Person[] = [];
  // private gates: Gate[] = [];

  constructor() {
    this.fetchIdentities();
  }

  private async fetchIdentities(): Promise<any> {
    // fetch identities from API
    this.identities = await IdentitiesFetcher.getInstance().fetchIdentities();

    // done loading
    $('#loader').removeClass('loading');

    // start app
    this.start();
  }

  private start(): void {
    this.generatePeople();
    // this.generateGates();
    this.generateWall();
  }

  // private generateGates(): void {
  //   for (let i = 0; i < 5; i += 1) {
  //     const gate = new Gate(i, i === 0, 0 + i * 50, window.innerHeight / 2);
  //     this.gates.push(gate);
  //   }
  // }

  private generateWall(): void {
    const wallBack = $('<div class="game-object wall-back"></div>');
    wallBack.css('backgroundImage', `url(${gatesBackImg})`);
    $('body').append(wallBack);

    const wallFront = $('<div class="game-object wall-front"></div>');
    wallFront.css('backgroundImage', `url(${gatesFrontImg})`);
    $('body').append(wallFront);

    const wallRoof = $('<div class="game-object wall-roof"></div>');
    wallRoof.css('backgroundImage', `url(${gatesRoofImg})`);
    $('body').append(wallRoof);
  }

  private generatePeople(): void {
    const personSize = 20;
    const maxX = window.innerWidth - personSize;
    const maxY = window.innerHeight - personSize;

    for (let i = 0; i < 50; i += 1) {
      const num = random.integer(0, this.identities.length - 1);
      const randomIdentity = this.identities[num];

      const randomX = random.integer(personSize, maxX);
      const randomY = random.integer(window.innerHeight * 0.75, maxY);

      const person = new Person(
        i,
        randomX,
        randomY,
        personSize,
        personSize,
        randomIdentity
      );

      this.people.push(person);
    }
  }
}

// start app
new App();

export default App;
