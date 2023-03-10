
export const get_template = (form_type) => {
  switch(form_type)
  {
    case "cycle":
        return "MiniWonder";
      break;
    case "toggle":
    case "access":
        // return "phone";
        return "Access";
      break;
    default:
        return "Access";
      break;
  }//end switch
}//get_template
