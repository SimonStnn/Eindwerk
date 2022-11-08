import React from 'react';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import config from './config.json';

const websocket = new WebSocket(config.websocket.url);
function App() {
   const [sidebarOpen, setSideBarOpen] = useState(false);
   const toggleSidebar = () => {
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
         <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

         <div className="container">
            <Routes>
               <Route />
            </Routes>
         </div>
      </div>
   );
}

export default App;
