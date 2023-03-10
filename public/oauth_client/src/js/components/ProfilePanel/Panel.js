import /*React,*/ { forwardRef, useEffect, useRef } from "react";
require('./ProfilePanel.scss');
require('./style.scss');


const Panel = forwardRef(({
  uuid = "",
  name = "",
  project = "",
  left = false,
  children,
  sign_out = false,
  exit_text = "Sign Out",
}, ref) => {
  // useEffect(() => {
  //   let sign_out_btn = document.querySelector(".pp_sign_out");
  //   // home_btn.href = `${location.origin}/core/`;
  //   // home_btn.target = "_self";
  //   sign_out_btn.addEventListener("click", () => {
  //     localStorage.removeItem('JWT_TOKEN');
  //     axios.defaults.headers.common['Authorization'] = '';

  //     location.reload();
  //   })
  // }, [])
  // const sidebar = useRef();
  const sidebar_id = `pp_sidebar${uuid}`;
  const pos = left ? "left" : "";

  // if(typeof ref.current == "undefined") ref.current = {};
  // if(typeof ref.current.sidebar == "undefined") ref.current.sidebar = sidebar;

  return (
    <div className={`wrapper ${name} ${project} ${pos}`} onClick={(e) => e.stopPropagation()/*click catcher*/}>
      {/* <!-- Sidebar --> */}
      <nav ref={ref} id={sidebar_id} className={`pp_panel pp_sidebar dark_bg ${name} ${project} ${pos}`}>

        <div id="pp_close_cont" className={`pp_close_cont ${name} ${project} ${pos}`}>
          <div id="pp_panel_cls_btn" className={`${sidebar_id} ${name} ${project} ${pos} pp_panel_cls_btn pp_dismiss close_btn icon-cross`}
          onClick={(e) => {
            // document.querySelector(`#${sidebar_id}`).classList.remove('active');
            e.preventDefault();// all these need preventDefault to work otherwise id clicks the parent btn
            ref.current.classList.remove('active');// this works
            e.stopPropagation();
          }}
          ></div>
        </div>
        <div id="pp_content_cont" className={`pp_content_cont ${name} ${project} ${pos}`}>{children}</div>
        { sign_out ? <div id="pp_sign_out" className={`pp_sign_out ${name} ${project} ${pos}`} 
          onClick={() => {
            sign_out();
          }}
        >{exit_text}</div>
        : null}
      </nav>

    </div>
  )
});

export default Panel;