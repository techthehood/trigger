import { observable, computed, decorate } from 'mobx';

// class Todo {
//   @observable values
//   @observable id
//   @observable complete
//
//   constructor(value){
//     this.value = value
//     this.id = Date.now()
//     this.complete = false
//   }
// }

class Todo {
  values
  id
  complete

  constructor(value){
    this.value = value
    this.id = Date.now()
    this.complete = false
  }
}

decorate(Todo,{
  values: observable,
  id: observable,
  complete: observable
})

class TodoStore {
  @observable todos = []
  @observable filter = ""
  @computed get filteredTodos(){
    let matchesFilter = new RegExp(this.filter, "i")
    return this.todos.filter( todo => !this.filter || matchesFilter.test(todo.value))
  }
  createTodo(value){
    // this.todos.push(value);
    this.todos.push(new Todo(value))
  }

  clearComplete = () => {
    // this.todos = [];// this doesn't work with observable arrays
    let incompleteTodos = this.todos.filter( todo => !todo.complete )// will return all the values where complete == false
    this.todos.replace(incompleteTodos); //replace old array with new version - in this case with the incomplete values

  }

}//TodoStore

var store = window.store = new TodoStore;

export default store;
