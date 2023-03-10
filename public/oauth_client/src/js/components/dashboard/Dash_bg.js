import {useRef} from 'react';

const {randomizer} = require('../../tools/randomizer');
require('./Dash_bg.scss');

const Dash_bg = ({
  bg_images,
  text_only_mode = false
}) => {

  let rh_ref = useRef(randomizer(300,45));
  let random_hue = rh_ref.current;
  let img_ref = useRef(randomizer(bg_images.length - 1));
  let img_nbr = img_ref.current;


  let style_data = !text_only_mode ? {
    filter:`hue-rotate(${random_hue}deg) blur(1.3px)`,
    background: `url(${bg_images[img_nbr]}) center no-repeat`
  } : {backgroundColor: "#ccc"};

  return (
    <div className={`dash_bg`} style={style_data} data-comp={`Dash_bg`} >
    </div>
  )
}

export default Dash_bg;
