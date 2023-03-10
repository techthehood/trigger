import /*React,*/ { useEffect, useRef, useState } from "react";
import Panel from './Panel';
require('./custom.scss');

const ProfilePanel = (props) => {
  // useEffect(() => {
  //   document.addEventListener('DOMContentLoaded', async function () {
  //     let home_btn = document.querySelector(".pp_panelHomeBtn");
  //     home_btn.href = `${location.origin}/core/`;
  //     home_btn.target = "_self";
  //   });
  // }, []);

  const {
    uuid = "",
    icon = "bars",
    name = "",
    project = "",
    wrapper = false,
    left = false,
    sign_out = false,
    exit_text,
    children
  } = props;

  const sidebar = useRef();
  const pos = left ? "left" : "";

  // const sidebar_id = `pp_sidebar${uuid}`;

  const panel_btn = (
    <div className={`pp_panelCtrl${uuid} ${name} ${project} ${pos} pp_panelCtrl pp_panelBtn pp_btn svg-icon-${icon}`}
      title="profile panel controls"
      onClick={() => {
        // document.querySelector(`#${sidebar_id}`).classList.toggle("active");
        let all_panels = document.querySelectorAll(".pp_sidebar");
        // close all other panels
        all_panels.forEach((panel) => {
          panel.classList.remove("active");
        });
        // open this panel
        sidebar.current.classList.toggle("active");
      }}
    >
      <Panel {...{ ...props, ref: sidebar }} />
      {/* ...props,  */}
    </div>
  )

  const pan_el = wrapper ? (
    <div className={`profile_panel_icon_box${uuid} ${name} ${project} ${pos} profile_panel_icon_box`} >
      {panel_btn}
    </div>
  ): panel_btn;


  return pan_el;

}// ProfilePanel

export default ProfilePanel;