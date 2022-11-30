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
        name: 'Halmqskdjfmlqskjdfmlqksdjfmlqskdjfqmsdlkfjqmslkdjfmqlksjdflmkqjd sqdlkmfj mqlsdjk flmksjdllo',
        addr: 'address2',
        majorClass: 'Phone',
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
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Audio/Video',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Audio/Video',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Audio/Video',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Imaging',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'LAN/Network Access point',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Imaging',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Imaging',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'LAN/Network Access point',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Audio/Video',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
    {
        name: 'Hallo',
        addr: 'address2',
        majorClass: 'Phone',
        classes: [],
        rssi: -58,
    },
];

const Home = ({ satelites, devices }) => {
    return (
        <>
            <h1>Connected Satellites</h1>
            <div className="satelite-container">
                {satelite_samples.map((data, i) => {
                    return <Satelite data={data} key={i} />;
                })}
                {satelites.length ? (
                    satelites.map((data, i) => {
                        return <Satelite data={data} key={i} />;
                    })
                ) : (
                    <>No Connected Satellites</>
                )}
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
