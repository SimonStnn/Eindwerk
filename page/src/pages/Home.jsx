import React from "react";
// import { useState } from 'react';
import Device from '../components/Device';
// import config from '../config.json';


const samples = [
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
];


const Home = ({devices}) => {
    return (
       <>
          <h1>Found devices</h1>
          <div className="device-container">
             {/* <Device data={samples[0]} />
             <Device data={samples[1]} />
             <Device data={samples[2]} /> */}
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
}

export default Home


// import React from "react";

// const Home = () => {
//     return (
//         <>

//         </>
//     )
// }

// export default Home