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
import Notification from './components/Notification';
import Loading from './components/Loading';

const THEME_DEFAULT = config.themes.dark;
const WEBSOCKET_URL = `${
    config.websocket.url
}:${config.websocket.port.toString()}`;

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState(THEME_DEFAULT);
    const websocketRef = useRef(null);
    const [collection, setCollection] = useState({});
    const [notifications, setNotifications] = useState([]);

    // Add window.onload event listener
    window.onload = () => {
        setIsLoading(false);
    };
    useEffect(() => {
        const websocket = new WebSocket(WEBSOCKET_URL);
        websocketRef.current = websocket;

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            console.log('Disconnected from websocket');
            addNotification({
                content: 'Disconnected from websocket',
            });
            /* 
            When the page loads the app component unmounts 
            and remounts causing the websocket to close 
            before a connection can be established. I added 
            this temporary setTimeout to prevent this warning.
            */
            // setTimeout(() => {
            websocket.close();
            // }, 80);
            window.onload = null;
            setTimeout(() => setIsLoading(false), 5000);
        };
    }, []);

    const addNotification = (notification) => {
        const key = Date.now();
        notification.visible = true;
        notification.key = key;
        setNotifications((prev) => {
            return [...prev, notification];
        });
        setTimeout(() => {
            notification.visible = false;
            // setNotifications((prev) =>
            //     prev.map((obj) =>
            //         obj.key === key ? { ...obj, visible: false } : obj
            //     )
            // );
            // setTimeout(() => {
            setNotifications((prev) => prev.filter((item) => item.key !== key));
            // }, 1000);
        }, 5000);
    };

    const websocket = websocketRef.current;

    if (isLoading || !websocket) {
        return <Loading />;
    }

    websocket.onopen = (e) => {
        console.log('Connected to websocket: ', WEBSOCKET_URL);
        websocket.send('REQ=collection');
    };

    websocket.onmessage = ({ data }) => {
        if (data.startsWith('COLLECTION=')) {
            data = data.replace('COLLECTION=', '');
            data = JSON.parse(data);
            setCollection(data);
        } else if (data.startsWith('CHANGE=')) {
            if (collection === {}) return;
            data = data.replace('CHANGE=', '');
            const [mac_addr, change] = data.split('&', 2);

            // Check for existence of mac_addr in collection.sats
            if (collection.sats && mac_addr in collection.sats) {
                setCollection((prevCollection) => {
                    prevCollection.sats[mac_addr] = JSON.parse(change);
                    return prevCollection;
                });
            } else if (collection.devs && mac_addr in collection.devs) {
                setCollection((prevCollection) => {
                    prevCollection.devs[mac_addr] = JSON.parse(change);
                    return prevCollection;
                });
            }

            console.log("change",collection);
            return;
        }

        // addNotification({
        //     content: 'Received data',
        // });
        console.log('Incoming data:', data);
    };

    return (
        <div className={'App theme-' + theme}>
            <Sidebar />
            <div
                className={`notification-shadow ${
                    notifications.length !== 0 ? '' : 'hidden'
                }`}
            >
                <div className="notification-container">
                    {notifications.map((notification, i) => (
                        <Notification notification={notification} key={i} />
                    ))}
                </div>
            </div>
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
                                    addNotification={addNotification}
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
                                <Settings
                                    collection={collection}
                                    theme={theme}
                                    setTheme={setTheme}
                                    addNotification={addNotification}
                                    websocket={websocket}
                                />
                            }
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App;
