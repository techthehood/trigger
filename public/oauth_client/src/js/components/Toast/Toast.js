import React from 'react';
import ReactDOM from 'react-dom';
import "./Toast.scss";
// const {toaster} = require('./toaster.js');// produces an error - is not a function
import {toaster} from './toaster';//works
const {exists} = require('../../tools/exists');
// const { demo } = require('../../tools/demo');

  // what does this button do???
  /**
   * @module Toast
   * @category Tools
   * @desc Toast component
   * @future visible countdown b4 auto hiding, close btn (along with clicking anywhere to make closing clearer),
   */

  /**
   * @file
   */

  /**
   * @class Toast
   * @requires exists
   * @see [toast-msg (linkback)]{@link module:toast-msg}
   * @see ./toast.scss
   * @example
   * import  Toast from './toast';
   * <Toast data={{state,home:`.${prefix}message_display_span`,message:sort_txt_obj[label_txt],auto:true,sec:5}} wrapper={true}/>,
   */

  export default class Toast extends React.Component {

    /**
     * Toast constructor
    * @constructs Toast
    * @param {Object} props component props
    * @param {Object} props.data data object prop
    * @param  {Object} props.data.state                         app state object (store)
    * @param  {String} data.message                       message to the viewer
    * @param  {String} data.name                          unique identifier string
    * @param  {Number} [data.iUN=Math.round(Math.random() *             10000)] individual unique number
    * @param  {Number} [data.seconds]                       [description]
    * @param  {Number} [data.sec]                           [description]
    * @param  {Boolean} [data.auto]
    */
    constructor(props){
      super(props);
      this.state = {};
      // toaster({mode:"test"});
      // this.state.click = toaster;
      this.toast_cont = React.createRef();
    }// constructor

    timer = "";
    timer2 = "";

    componentDidMount(){
      //this section is for setting up initial values just after page is rendered
      // console.log("active component is ready to roll!");
      // console.log(`available data = ${this.props.data}`);
      this.prep_vars(this.props.data);

    }//componentDidMount

    remove_self = () => {
      try {

        let s =  this.state;
        let data = this.props.data;
        let targ_el = this.toast_cont.current;
        let target_container = targ_el.parentNode;

        ReactDOM.unmountComponentAtNode(target_container);// this is like innerHTML = "" for react components
        if(exists(this.props.wrapper) && this.props.wrapper == true){
          // then remove the parent element
          let bigDaddy = target_container.parentNode;
          bigDaddy.removeChild(target_container);
        }// if
      } catch (err) {
        console.error("[remove_self] an error occured",err);
      }
    }

    /**
     * passes props.data to the this.state
     * @function prep_vars
     * @memberof Toast
     * @param  {Object} state                         app state object (store)
     * @param  {String} message                       message to the viewer
     * @param  {String} name                          unique identifier string
     * @param  {Number} [iUN=Math.round(Math.random() *             10000)] individual unique number
     * @param  {Number} [seconds]                       [description]
     * @param  {Number} [sec]                           [description]
     * @param  {Boolean} [auto]              [description]
     * @return {Object}                               [description]
     */
    prep_vars = ({
      message,
      name,
      custom,
      iUN = Math.round(Math.random() * 10000),
      seconds,
      sec,
      auto = true,
      card = true,
      link,
      close = false
    }) => {

      let _this = this;

      this.setState({
        message,
        name,
        iUN,
        custom,
        card,
        link,
        close,
      });//setState

      if(auto){
        // if its auto its going to fade in and out by the specified duration
        // clearTimeout(this.timer);
        let hold_time = (seconds) ? seconds * 1000 : (sec) ? sec * 1000 : 3000;// 1000 = 1s
        // let container_str = `.${name}_toast_cont_${iUN}`;

        //apply the fade out
        clearTimeout(this.timer);
        clearTimeout(this.timer2);

        this.timer = setTimeout(function()
        {
          clearTimeout(_this.timer);
          // let targ_el = document.querySelector(container_str);
          // targ_el.classList.add("d3-fade-out-quick");
          _this.toast_cont.current.classList.add("d3-fade-out-quick");

          _this.timer2 = setTimeout(function () {
            clearTimeout(_this.timer2);
            // targ_el.classList.remove("d3-fade-out-quick");
            _this.toast_cont.current.classList.remove("d3-fade-out-quick");
            // toaster({state,mode:"hide"});
            _this.remove_self();
          }, 1000);// the hold_time is below - this time is for the end of the fader "timer2"

          //i can use a fade delay that will do the same thing as a timer - do both?

        }, hold_time);//timer


      }//if

    }// prep_vars

    componentDidUpdate(){
      //this section is for executing just after first state update - all init vars are set by now

    }//componentDidUpdate

    componentWillUnmount(){
      clearTimeout(this.timer);
      clearTimeout(this.timer2);
    }

    update_state = (obj) => {
      this.prep_vars(obj);
    }
    /*<img src={`${ARC_IMG_URL}flame@xs.png`} />*/



    render() {
      // enter logic here
      let s =  this.state;
      let toast_class = (s.custom) ? s.custom : "";
      let show_card = (s.card == true) ? "w3-card" : "";
      let toast_close_id = `${s.name}_toast_close_${s.iUN}`;

      let close_btn = s.close ? (
        <div className={`${toast_close_id} toast_close d3-ico d3-bg d3-disc-outer d3-disc-bg d3-abs icon-cross`}
          onClick={(e) => {
            e.preventDefault(); 
            let _this = this;
            // demo(toast_close_id, () => {
            //   _this.remove_self();
            // });
            _this.remove_self();
          }}
        ></div>
      ) : null;

      let toast_id = `${s.name}_toast_cont_${s.iUN}`;

      return(
        <div className={`${toast_id} toast_cont d3_toast ${toast_class} ${show_card} d3-slide-in-bottom d3-fade-in-quick`}
          ref={this.toast_cont}
          data-comp={`Toast`}
          onClick={(e) => {
            e.preventDefault(); 
            let _this = this;
            // demo(toast_id, () => {
            //   _this.remove_self();
            // });
            _this.remove_self();
          }} >
          {close_btn}
          <p>{unescape(s.message)}</p>
          {s.link ? (
            <a onClick={(e) => {
              e.preventDefault();
              e.persist();
              // demo(toast_id, () => {
              //   s.link.callback(e,s.link.data)
              // });
              s.link.callback(e, s.link.data)
            }}>{s.link.text}</a>
          ) : null}
        </div>
      );
    }// render

  }// Toast
  // toaster({mode:"hide"})
