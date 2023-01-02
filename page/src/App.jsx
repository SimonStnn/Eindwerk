import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import config from './config.json';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Discover from './pages/Discover';
import Components from './pages/Components';
import Settings from './pages/Settings';

const THEME_DEFAULT = config.themes.dark;
const WEBSOCKET_URL = `${
    config.websocket.url
}:${config.websocket.port.toString()}`;

function App() {
    const [theme, setTheme] = useState(THEME_DEFAULT);
    const websocketRef = useRef(null);
    const [collection, setCollection] = useState({});

    useEffect(() => {
        const websocket = new WebSocket(WEBSOCKET_URL);
        websocketRef.current = websocket;
        websocket.onopen = (e) => {
            console.log('Connected to websocket: ', WEBSOCKET_URL);
            websocket.send('REQ=collection');
        };

        websocket.onmessage = ({ data }) => {
            if (data.toLowerCase() === 'received') return;

            if (data.startsWith('{') && data.endsWith('}')) {
                data = JSON.parse(data);
                // console.log(data);

                setCollection(data);
            }
        };
        // Clean up the WebSocket connection when the component unmounts
        return () => {
            console.log('Disconnected from websocket');
            /* 
            When the page loads the app component unmounts 
            and remounts causing the websocket to close 
            before a connection can be established. I added 
            this temporary setTimeout to prevent this warning.
            */
            // setTimeout(() => {
                websocket.close();
            // }, 80);
        };
    }, []);

    const websocket = websocketRef.current;
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
                            element={<Discover collection={collection} />}
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
        </div>
    );
}

export default App;
