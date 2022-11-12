import React from 'react';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import config from './config.json';
import Sidebar from './components/Sidebar';

import Home from './pages/Home';
import Contact from './pages/Contact';
import Settings from './pages/Settings';

import icon_sidebar_expand from './images/icons/sidebar/expand.svg';
import icon_sidebar_collapse from './images/icons/sidebar/collapse.svg';

let toggleIcon = icon_sidebar_expand;

const websocket = new WebSocket(config.websocket.url);
function App() {
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const toggleSidebar = () => {
        if (sidebarOpen) toggleIcon = icon_sidebar_expand;
        else toggleIcon = icon_sidebar_collapse;

        setSideBarOpen(!sidebarOpen);
    };

    const [devices, setDevices] = useState([]);

    websocket.onopen = (e) => {
        websocket.send('ROLE=client');
    };

    websocket.onmessage = ({ data }) => {
        if (data.toLowerCase() === 'received') return;
        console.log(data);
        data = JSON.parse(data);
        setDevices(data);
    };

    return (
        <div className="App">
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                toggleIcon={toggleIcon}
            />
            <div className="container">
                <div className='container-content'>
                    <Routes>
                        <Route
                            path="/"
                            element={<Home satelites={[]} devices={devices} />}
                        />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App;
