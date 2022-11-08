import React from 'react';
// import { useState } from 'react';
import Satelite from '../components/Satelite';
import Device from '../components/Device';
// import config from '../config.json';

const satelite_samples = [
   {
      name: 'Test Sateliet',
      mac: '3c:49:b5:10:8b:ea',
      ip: '165.136.126.11',
      posx: 54651,
      posy: 0,
   },
   {
      name: 'Test Samlsqd kjfmlskdjfsdlmk fjqsmd lkfjteliet',
      mac: '3c:49:b5:10:8b:ea',
      ip: '165.136.126.11',
      posx: 0,
      posy: 0,
   },
   {
      name: 'Test Sateliet',
      mac: '3c:49:b5:10:8b:ea',
      ip: '165.136.126.11',
      posx: 0,
      posy: 0,
   },
   {
      name: 'Test Sateliet',
      mac: '3c:49:b5:10:8b:ea',
      ip: '165.136.126.11',
      posx: 0,
      posy: 0,
   },
];

const device_samples = [
   {
      name: 'Hallo dmlqf',
      addr: 'address',
      majorClass: 'Computer',
      classes: [],
      rssi: -58,
   },
   {
      name: 'H',
      addr: 'address',
      majorClass: 'Computer',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
   {
      name: 'Hallo',
      addr: 'address2',
      majorClass: 'Miscellaneous',
      classes: [],
      rssi: -58,
   },
];

const Home = ({ satelites, devices }) => {
   return (
      <>
         <h1>Connected Satelites</h1>
         <div className="satelite-container">
            {satelites.length
               ? satelites.map((data, i) => {
                    return <Satelite data={data} key={i} />;
                 })
               : // <>No Connected Satelites</>
                 satelite_samples.map((data, i) => {
                    return <Satelite data={data} key={i} />;
                 })}
         </div>
         <h1>Found devices</h1>
         <div className="device-container">
            {device_samples.map((data, i) => {
               return <Device data={data} key={i} />;
            })}
            {devices.length ? (
               devices.map((data, i) => {
                  return <Device data={data} key={i} />;
               })
            ) : (
               <>No Devices Found</>
            )}
         </div>
      </>
   );
};

export default Home;

// import React from "react";

// const Home = () => {
//     return (
//         <>

//         </>
//     )
// }

// export default Home
