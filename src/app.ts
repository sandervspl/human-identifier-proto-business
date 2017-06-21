// dependencies
import Person from './Person';
import IdentitiesFetcher from './IdentitiesFetcher';
const random = require('random-js')();

// style
import './style/style.styl';
import IPersonIdentity from './interfaces/IPersonIdentity';

class App {
  private identities: IPersonIdentity[] = [];
  private loaded: boolean;

  constructor() {
    this.loaded = false;

    this.fetchIdentities();
  }

  private async fetchIdentities(): Promise<any> {
    this.identities = await IdentitiesFetcher.getInstance().fetchIdentities();

    // start app
    this.start();
  }

  private start() {
    const num = random.integer(0, this.identities.length - 1);
    const randomIdentity = this.identities[num];

    new Person(50, 50, 20, 20, randomIdentity);
  }
}

// start app
new App();

export default App;
