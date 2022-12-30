import React from 'react';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import config from './config.json';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Discover from './pages/Discover';
import Components from './pages/Components';
import Settings from './pages/Settings';

const THEME_DEFAULT = config.themes.dark;

function App() {
    const [theme, setTheme] = useState(THEME_DEFAULT);

    const [collection, setCollection] = useState([]);
    const websocket = new WebSocket(config.websocket.url);
    const [satelites, setSatelites] = useState([]);
    const [devices, setDevices] = useState([]);

    websocket.onopen = (e) => {
        websocket.send('ROLE=client');
    };

    websocket.onmessage = ({ data }) => {
        if (data.toLowerCase() === 'received') return;
        data = JSON.parse(data);
        console.log(data);

        setCollection(() => {
            const col = [...collection];
            for (let i in col) {
                if (col[i].satelite.mac === data.satelite.mac) {
                    col.splice(i, 1);
                    break;
                }
            }
            col.push(data);
            return col;
        });

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
        <div className={'App theme-' + theme}>
            <Sidebar />
            <div className="container">
                <div className="container-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/rooms"
                            element={
                                <Rooms
                                    collection={collection}
                                    websocket={websocket}
                                />
                            }
                        />
                        <Route
                            path="/discover"
                            element={
                                <Discover
                                    devices={devices}
                                    satelites={satelites}
                                />
                            }
                        />
                        <Route path="/components" element={<Components />} />
                        <Route
                            path="/settings"
                            element={
                                <Settings theme={theme} setTheme={setTheme} />
                            }
                        />
                    </Routes>
                </div>
            </div>
            {/* </div> */}
            {/* </ThemeContext.Provider> */}
        </div>
    );
}

export default App;
