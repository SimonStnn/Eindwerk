import React from 'react';
import { useState } from 'react';
// import config from './config.json';

import icon_user from './images/icons/sidebar/user.svg';

import icon_home from './images/icons/sidebar/home.svg';
import icon_git from './images/icons/sidebar/git.svg';
import icon_bluetooth from './images/icons/sidebar/bluetooth.svg';
import icon_terminal from './images/icons/sidebar/terminal.svg';
import icon_components from './images/icons/sidebar/components.svg';
import icon_settings from './images/icons/sidebar/settings.svg';

import icon_sidebar_expand from './images/icons/sidebar/expand.svg';
import icon_sidebar_collapse from './images/icons/sidebar/collapse.svg';

const link_home = '#';
const link_git = '#';
const link_bluetooth = '#';
const link_terminal = '#';
const link_settings = '#';
const link_components = '../../consept/onderdelen/arduino.html';

let sidebarOpen = false;

const SidebarItem = ({ icon, alt, text, link }) => {
   return (
      <div>
         <a href={link} className="sidebar-item">
            <img src={icon} alt={alt} />
            {sidebarOpen ? <div>{text}</div> : <></>}
         </a>
      </div>
   );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
   sidebarOpen = isOpen;
   return (
      <div className={isOpen ? 'sidebar open' : 'sidebar'}>
         <div className="logo">
            <img src={icon_user} alt="Logo" />
            {sidebarOpen ? <div>Eindwerk</div> : <></>}
         </div>
         <div className="items">
            <hr />
            <SidebarItem
               icon={icon_home}
               alt="Home Icon"
               text="Home"
               link={link_home}
            />
            <SidebarItem
               icon={icon_git}
               alt="Git Icon"
               text="Git"
               link={link_git}
            />
            <SidebarItem
               icon={icon_bluetooth}
               alt="Bluetooth Icon"
               text="Bluetooth"
               link={link_bluetooth}
            />
            <SidebarItem
               icon={icon_terminal}
               alt="Terminal Icon"
               text="Terminal"
               link={link_terminal}
            />
         </div>
         <div className="items last">
            <hr />
            <SidebarItem
               icon={icon_settings}
               alt="Settings Icon"
               text="Settings"
               link={link_settings}
            />
            <SidebarItem
               icon={icon_components}
               alt="Components Icon"
               text="Components"
               link={link_components}
            />
            {/* <Toggle /> */}
            <div
               className={isOpen ? 'width-toggle open' : 'width-toggle'}
               onClick={toggleSidebar}
            >
               <img src={icon_sidebar_expand} alt="Toggle" />
            </div>
         </div>
      </div>
   );
};

export default Sidebar;
