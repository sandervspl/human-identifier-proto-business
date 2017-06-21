// dependencies
// import $ from 'jquery';
import Person from './Person';

// style
import './style/style.styl';

class App {
  constructor() {
    // create test person
    const person = new Person(50, 50, 20, 20);
    console.log(person);
  }
}

// start app
new App();

export default App;
