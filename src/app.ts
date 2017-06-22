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
  private prevSpawnTime: number;
  private diffTimeSpawn: number;

  constructor() {
    this.fetchIdentities();

    this.prevSpawnTime = Date.now();
    this.diffTimeSpawn = 2000;
  }

  public getNewGateAssigned(gateId: number): Gate {
    const curGate = this.gates[gateId];
    let preferredGate = null;

    this.gates.forEach(gate => {
      if (gate.getId() === gateId) { return; }
      if (!gate.getIsAvailable()) { return; }
      if (gate.getPopularity() <= curGate.getPopularity()) { return; }

      preferredGate = gate;
    });

    let newGateOpened = false;

    if (preferredGate === null) {
      this.gates.forEach(gate => {
        if (newGateOpened) { return false; }
        if (gate.getId() === gateId) { return; }
        if (gate.getPopularity() <= curGate.getPopularity()) { return; }

        gate.setAvailableStatus(true);

        preferredGate = gate;
        newGateOpened = true;
      });
    }

    if (preferredGate === null) {
      preferredGate = this.gates[0];
    }

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
    this.generatePeople(2);
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

  private generatePeople(amount: number): void {
    const personSize = 20;
    const maxX = window.innerWidth - personSize;

    for (let i = 0; i < amount; i += 1) {
      const num = random.integer(0, this.identities.length - 1);
      const randomIdentity = this.identities[num];

      const randomX = random.integer(personSize, maxX);
      const randomY = window.innerHeight + random.integer(personSize, 250);

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
      if (gate.getIsAvailable() && preferredGate.getPopularity() < gate.getPopularity()) {
        preferredGate = gate;
      }
    });

    // console.log(`gate: ${preferredGate}`);

    return preferredGate;
  }

  private checkSpawnNewPeople(): void {
    const curTime = Date.now();

    if (curTime - this.prevSpawnTime > this.diffTimeSpawn) {
      this.generatePeople(random.integer(1, 6));

      this.diffTimeSpawn = random.integer(2000, 7000);
      this.prevSpawnTime = curTime;
    }
  }

  private update = (): void => {
    for (let i = this.people.length - 1; i >= 0; i -= 1) {
      const person = this.people[i];

      if (person.isFinished) {
        this.people.slice(i, 1);
      } else {
        person.update();
      }
    }

    this.checkSpawnNewPeople();

    requestAnimationFrame(this.update);
  }
}

// start app
new App();

export default App;
