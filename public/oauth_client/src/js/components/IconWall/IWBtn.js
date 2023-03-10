import IconWall from './IconWall';
const {wrapr} = require('../../tools/wrapr');

const IWBtn = ({
  button = {icon:"options",variant:""},
  callback,
  data,
  options = ['edit','delete','add'],
  icons = ['pencil','bin','plus'],
  active = "",
  attrib = {single_click: true, modal: true},
  name = "",
  home = ".modal_home",
  variant = "block",// class variant
  label = ""/*{
    text: "favorites controls:",
    description: "add edit or delete options"
  }*/
}) => {

  const init_wall = () => {

    let flavor_option_cont = wrapr({name:`${name}_cont`, home , custom: `w3-part ${variant}`});
// the names of the different options

    let data_obj = {
      callback,
      name,
      default_options: options,
      option_icons: icons,
      active_options: active
    };

    if(label != ""){
      data_obj.label = label;
    }// if

    if(data){
      data_obj.data = data;
    }

    ReactDOM.render(
      <IconWall data={data_obj} {...attrib} />,
      flavor_option_cont
    );

  }// init_wall

  return (
    <div className={`${name}_options ${name}_options ${name}_ctrls icons ${button.variant} icon-${button.icon}`}
      onClick={(e) => {
        init_wall();
        e.stopPropagation();
      }}
    ></div>
  );

}// IWBtn

export default IWBtn;

// <IWBtn callback={options_callback} name={"SelectOptions_cont"} options={[]} icons={[]}  data={} />
