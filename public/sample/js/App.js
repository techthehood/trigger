// import React from 'react';
// { Component } = React;
class App extends React.Component {

  //i dont need a constructor
  constructor(props) {
    super(props);
    this.state = {name:"scratchy 1.0"}
  }

  state = {name:"scratchy 1.1"};

  addText = function(){
    this.setState({name:"And some more scratchy"})
  }

  render(){
    return(
      <div>
      <h2>scratchy app test</h2>
      <h2 onClick={this.addText.bind(this)}>app name:{this.state.name}</h2>
      </div>
    )
  }
}//Scratchy


export default App
