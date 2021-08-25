  // console.log("[TodoList]");
  import React, { Component } from "react";
  import { observer } from "mobx-react";

  import Mobx from "mobx";
  import { decorate, observable } from "mobx";

  @observer
  class TodoList extends Component{
    // constructor(props){
    //   super(props);
    // }
    filter(e){
      this.props.store.filter = e.target.value;
    }

    createNew(e){
      if(e.which === 13){
        this.props.store.createTodo(e.target.value);
        e.target.value = "";
      }
    }

    toggleComplete(todo){
      todo.complete = !todo.complete;
    }

    render(){

      const { todos, filter, filteredTodos } = this.props.store;
      const todoList = filteredTodos.map( todo => {
        let listStyle = {listStyle: "none"};
        return <li key={todo.id} style={listStyle}>
        <input type="checkbox" value={todo.complete} checked={todo.complete}
        onChange={this.toggleComplete.bind(this, todo)} />
        {todo.value}</li>
      });

      return (
        <React.Fragment>
          <h1>Mobx Todos</h1>
          <label>Filter</label>
          <input className="filter" value={filter} onChange={this.filter.bind(this)} />
          <label>add todo:</label>
          <input className="create" onKeyPress={this.createNew.bind(this)} />
          <ul>{todoList}</ul>
          <a href="#" onClick={this.props.store.clearComplete} >Clear Complete</a>
        </React.Fragment>
      );
    }
  }

  export default TodoList;
