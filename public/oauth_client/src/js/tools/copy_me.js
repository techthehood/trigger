const {wait_a_second} = require('./waiter');

const copy_me = (e,txt) => {
  // copies text to the clipboard
  
  let copy_btn = e.target;
  let temp_txtarea = document.createElement("textarea");
  // temp_txtarea.style.display = "none";
  temp_txtarea.innerText  = txt;
  copy_btn.style.visibilty = "hidden";// can i hide and show the btn to avoid hiding the textarea directly
  copy_btn.appendChild(temp_txtarea);
  temp_txtarea.select();
  document.execCommand('copy');

  // delete the textarea and avoid memory leak
  copy_btn.removeChild(temp_txtarea);
  copy_btn.style.visibilty = "visible";// this actually does work - i can hide then show the btn

  // wait_a_minute();
  wait_a_second({action:"flash",seconds:1});

  return;
}// copy_me

module.exports = {copy_me};
