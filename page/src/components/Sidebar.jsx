import React from 'react';
import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import config from './config.json';

import icon_logo from '../images/icons/sidebar/logo.svg';

import icon_home from '../images/icons/sidebar/home.svg';
import icon_contact from '../images/icons/sidebar/contact.svg';
import icon_components from '../images/icons/sidebar/components.svg';
import icon_settings from '../images/icons/sidebar/settings.svg';

const link_home = '/';
const link_contact = '/contact';
const link_settings = '/settings';
const link_components = '/components';

let sidebarOpen = false;
const SidebarItem = ({ icon, text, link }) => {
   return (
      <div>
         <Link to={link} className="sidebar-item">
            <img src={icon} alt={text + ' Icon'} />
            {sidebarOpen ? <div>{text}</div> : <></>}
         </Link>
      </div>
   );
};

const Sidebar = ({ isOpen, toggleSidebar, toggleIcon }) => {
   sidebarOpen = isOpen;
   return (
      <div className={isOpen ? 'sidebar open' : 'sidebar'}>
         <div className="logo">
            <img src={icon_logo} alt="Logo" />
            {sidebarOpen ? <div>Eindwerk</div> : <></>}
         </div>
         <hr />
         <div className="items main">
            <SidebarItem icon={icon_home} text="Home" link={link_home} />
            <SidebarItem
               icon={icon_contact}
               text="Contact"
               link={link_contact}
            />
         </div>
         <hr />
         <div className="items">
            <SidebarItem
               icon={icon_components}
               text="Components"
               link={link_components}
            />
            <SidebarItem
               icon={icon_settings}
               text="Settings"
               link={link_settings}
            />
            {/* <Toggle /> */}
            <div
               className={isOpen ? 'width-toggle open' : 'width-toggle'}
               onClick={toggleSidebar}
            >
               <img src={toggleIcon} alt="Toggle" />
            </div>
         </div>
      </div>
   );
};

export default Sidebar;
