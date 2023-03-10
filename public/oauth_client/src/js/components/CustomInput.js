import /*React,*/ {Component, createRef} from 'react';

export default class CustomInput extends Component {

  constructor(props){
    super(props);
    this.inputRef = createRef();
  }

  render(){
    const { value = "", onChange, name, register = ()=>{}, reg_data = {} } = this.props;

    const attrib = {};
    if(onChange) attrib.onChange = (e) => {
      onChange({e,name})
    };

    if(onChange){ 
      attrib.value = value;
    }else{
      attrib.defaultValue = value;
    }

    return (
      <div className={`form-group`}>
      <label htmlFor={this.props.id} >{ this.props.label }</label>
      <input name={name}
      id={this.props.id}
      // ref={register}
      ref={(el) => {
        register(el,reg_data);
        this.inputRef.current = el;
      }}
      placeholder={this.props.placeholder}
      className="form-control"
      type={this.props.type}
      {...attrib}
      // {...register(this.inputRef)}
      onClick={() => {
        this.inputRef.current.select();
      }}
      // onChange={onChange}
      />
      </div>
    );
  }// render
}

//<input name={this.props.name}

/**
  <form className={`pTree_form`} onSubmit={handleSubmit(onSubmit)}>
    <fieldset>
      <CustomInput
        name="title"
        type="text"
        id="title"
        label="Add a link title"
        placeholder="Enter title text..."
        // {...register("email")}
        register={register}
        {...title_data}
      />
    </fieldset>
  </form>

  // or add onchange and a state value for a controlled component
  
  const updateInput = (uI) => {
    let {name} = uI;
    let values = form_data.getValues();
    let item_update = {};
    item_update[`${name}`] = values[name];
    setItemData(item_update);
    debugger;
  }

  let title_data = {};
  title_data.value = item_data.title;
  ...
  <CustomInput
      name="title"
      type="text"
      id="title"
      label="Add a link title"
      placeholder="Enter title text..."
      onChange={updateInput}
      // {...register("email")}
      register={register}
      {...title_data}
    />
 */
