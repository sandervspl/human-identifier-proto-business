// dependencies
import $ from 'jquery';
import Person from './Person';
import IdentitiesFetcher from './IdentitiesFetcher';
import Gate from './Gate';
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
  private gates: Gate[] = [];

  constructor() {
    this.fetchIdentities();
  }

  public getNewGateAssigned(gateId: number): Gate {
    const curGate = this.gates[gateId];
    let preferredGate = this.gates[0];

    let newGateOpened = false;

    this.gates.forEach(gate => {
      if (!newGateOpened &&
        gate.getId() !== gateId &&
        gate.getPopularity() > curGate.getPopularity()) {
        gate.toggleAvailability();
        preferredGate = gate;

        console.log(`opening gate ${gate.getId()}`);
        newGateOpened = true;
      }
    });

    return preferredGate;
  }

  private async fetchIdentities(): Promise<any> {
    // fetch identities from API
    this.identities = await IdentitiesFetcher.getInstance().fetchIdentities();

    // done loading
    $('#loader').removeClass('loading');

    // start app
    this.start();

    this.update();
  }

  private start(): void {
    this.generateWall();
    this.generateGates();
    this.generatePeople();
  }

  private generateGates(): void {
    for (let i = 0; i < 5; i += 1) {
      const gate = new Gate(i, i === 0);
      this.gates.push(gate);
    }
  }

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

      const gate = this.chooseGateForPerson();

      const person = new Person(
        i,
        randomX,
        randomY,
        personSize,
        personSize,
        randomIdentity,
        gate,
        this,
      );

      this.people.push(person);
    }
  }

  private chooseGateForPerson(): Gate {
    let preferredGate: Gate = this.gates[0];

    this.gates.forEach(gate => {
      if (preferredGate.getPopularity() < gate.getPopularity()) {
        preferredGate = gate;
      }
    });

    // console.log(`gate: ${preferredGate}`);

    return preferredGate;
  }

  private update = (): void => {
    this.people.forEach(person => person.update());
    requestAnimationFrame(this.update);

    // let openNextGate = false;
    //
    // this.gates.forEach(gate => {
    //   if (openNextGate) {
    //     gate.toggleAvailability();
    //     openNextGate = false;
    //   }
    //
    //   if (gate.getQueueNum() >= 10) {
    //     openNextGate = true;
    //   }
    // });
  }
}

// start app
new App();

export default App;
