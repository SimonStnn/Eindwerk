import React from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { useState } from 'react';
// import config from './config.json';

import icon_logo from '../images/icons/sidebar/logo.svg';

import icon_home from '../images/icons/sidebar/home.svg';
import icon_rooms from '../images/icons/sidebar/rooms.svg';
import icon_discover from '../images/icons/sidebar/discover.svg';
import icon_components from '../images/icons/sidebar/components.svg';
import icon_settings from '../images/icons/sidebar/settings.svg';

import icon_sidebar_expand from '../images/icons/sidebar/expand.svg';
let toggleIcon = icon_sidebar_expand;

const link_home = '/';
const link_rooms = '/rooms';
const link_discover = '/discover';
const link_components = '/components';
const link_settings = '/settings';

const Sidebar = () => {
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const toggleSidebar = () => {
        setSideBarOpen(!sidebarOpen);
    };

    const SidebarItem = ({ icon, text, link }) => {
        const location = useLocation();
        const path = location.pathname.slice(1);
        return (
            <div>
                <Link
                    to={link}
                    className={
                        path === text.toLowerCase() ||
                        (text === 'Home' && path === '')
                            ? 'sidebar-item active'
                            : 'sidebar-item'
                    }
                    title={text}
                >
                    <img src={icon} alt={text + ' icon'} />
                    <div className='text'>{text}</div>
                </Link>
            </div>
        );
    };

    return (
        <div className={sidebarOpen ? 'sidebar open' : 'sidebar'}>
            <div className="logo">
                <img src={icon_logo} alt="Logo" />
                <div className='logo-text'>Eindproef</div>
            </div>
            <hr />
            <div className="items main">
                <SidebarItem icon={icon_home} text="Home" link={link_home} />
                <SidebarItem icon={icon_rooms} text="Rooms" link={link_rooms} />
                <SidebarItem
                    icon={icon_discover}
                    text="Discover"
                    link={link_discover}
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
            </div>
            <div
                className={sidebarOpen ? 'width-toggle open' : 'width-toggle'}
                onClick={toggleSidebar}
            >
                <img src={toggleIcon} alt="Toggle" />
            </div>
        </div>
    );
};

export default Sidebar;
