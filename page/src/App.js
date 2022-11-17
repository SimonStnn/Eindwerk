import React from 'react';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import config from './config.json';
import Sidebar from './components/Sidebar';

import Home from './pages/Home';
import Contact from './pages/Contact';
import Components from './pages/Components';
import Settings from './pages/Settings';

import icon_sidebar_expand from './images/icons/sidebar/expand.svg';
import icon_sidebar_collapse from './images/icons/sidebar/collapse.svg';

let toggleIcon = icon_sidebar_expand;

let collection = [];

const websocket = new WebSocket(config.websocket.url);
function App() {
    const [satelites, setSatelites] = useState([]);
    const [devices, setDevices] = useState([]);

    websocket.onopen = (e) => {
        websocket.send('ROLE=client');
    };

    websocket.onmessage = ({ data }) => {
        if (data.toLowerCase() === 'received') return;
        data = JSON.parse(data);
        console.log(data);

        for (let i in collection) {
            if (collection[i].satelite.mac === data.satelite.mac) {
                collection.splice(i, 1);
                break;
            }
        }
        collection.push(data);

        // console.log(collection);
        const sats = [];
        const devs = [];
        for (let col of collection) {
            sats.push(col.satelite);
            devs.push(...col.devices);
        }

        setSatelites(data.satelite ? sats : satelites);
        setDevices(data.devices ? devs : devices);
    };

    return (
        <div className="App">
            <Sidebar />
            <div className="container">
                <div className="container-content">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Home satelites={satelites} devices={devices} />
                            }
                        />
                        <Route
                            path="/contact"
                            element={
                                <Contact
                                    satelites={satelites}
                                    devices={devices}
                                />
                            }
                        />
                        <Route path="/components" element={<Components />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App;
