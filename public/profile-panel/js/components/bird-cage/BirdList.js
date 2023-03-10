    // console.log("[BirdList]");
    import /*React,*/ { Component, useEffect, Fragment } from "react";
    import { observer, inject } from "mobx-react";

    const BirdList = inject('BirdStore')(observer(
      (props) => {

        useEffect(() => {
          // console.log("[BirdList] props",props);

        })// useEffect

        let output = null;
        let birdIn;
        const { BirdStore } = props;

        const handleSubmit = (e) => {
          e.preventDefault();
          let bird = birdIn.value;
          bird = bird.trim();

          if(bird == "") return;// prevent blank submissions

          BirdStore.addBird(bird);
          birdIn.value = '';
        }

        if(props.BirdStore){


          output = (
            <Fragment>
              <h1>You have {BirdStore.birdCount} Birds.</h1>
              <div className="App">
                <form onSubmit={ e =>  handleSubmit(e) }>
                <input type="text" placeholder="Enter bird" ref={ input => birdIn = input } />
                <button>Add Bird</button>
                </form>
              </div>
              <ul>
              {
                BirdStore.birds.map( bird => (
                  <li key={bird}>
                  {bird}
                  </li>
                ))
              }
              </ul>
            </Fragment>

          );

        }//if


          return output;

      }
    ))

    export default BirdList;
