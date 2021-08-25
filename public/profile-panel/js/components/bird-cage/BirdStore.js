
  import { observable, action, computed } from 'mobx';

  class BirdStore {
    @observable birds = [];

    @action addBird = (bird) => {
      this.birds.push(bird);
    }// addBird

    @computed get birdCount() {
      return this.birds.length;
    }
  }

  const Birdy = window.Birdy = new BirdStore();

  export default Birdy;// prevents many copies of the same store. we want a single store
