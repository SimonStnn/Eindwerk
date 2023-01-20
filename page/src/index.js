import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './App.css';
import './pages/Home.css';
import './pages/Discover.css';
import './pages/Rooms.css';
import './pages/Settings.css';
import './components/Sidebar.css';
import './components/Satelite.css';
import './components/Device.css';
import './components/Canvas.css';
import './components/DotInfo.css';
import './components/Notification.css'
import './components/Callibrate.css'

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
