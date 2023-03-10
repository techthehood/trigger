import {useRef} from 'react';

const CustomTextArea = (props) => {
  const {
    id,
    value = "",
    onChange = () => { },
    name,
    tag = "customTArea",
    register = () => { },
    label,
    placeholder = ""
  } = props;

  const desc_ref = useRef();

  const attrib = {};
  if (onChange) attrib.onChange = (e) => {
    onChange({ e, name })
  };
  if (onChange) {
    attrib.value = value;
  } else {
    attrib.defaultValue = value;
  }

  return (
    <div className={`${tag} cTA_display_cont ${name} `} >
      <label htmlFor={id} className={`${tag} CTA_label `}>
        {label}
      </label>
      <textarea 
        id={id} 
        name={name}
        className="form-control"
        ref={(ref) => {
          desc_ref.current = ref;
          register(ref)
        }}
        onFocus={(e) => {
          e.preventDefault();
          e.target.select();
        }}
        {...attrib}
        placeholder={placeholder} ></textarea>
    </div>
  );
}

export default CustomTextArea

