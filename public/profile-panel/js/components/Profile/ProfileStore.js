import { observable, computed } from 'mobx';

class Profile {
  @observable values
  @observable id
  @observable complete

  constructor(value){
    this.value = value
    this.id = Date.now()
    this.complete = false
  }
}

class ProfileStore {
  @observable Profiles = []
  @observable filter = ""
  @computed get filteredProfiles(){
    let matchesFilter = new RegExp(this.filter, "i")
    return this.Profiles.filter( Profile => !this.filter || matchesFilter.test(Profile.value))
  }
  createProfile(value){
    // this.Profiles.push(value);
    this.Profiles.push(new Profile(value))
  }

  clearComplete = () => {
    // this.Profiles = [];// this doesn't work with observable arrays
    let incompleteProfiles = this.Profiles.filter( Profile => !Profile.complete )// will return all the values where complete == false
    this.Profiles.replace(incompleteProfiles); //replace old array with new version - in this case with the incomplete values

  }

}//ProfileStore

var store = window.pStore = new ProfileStore;

export default store;
