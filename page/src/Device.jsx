import React from 'react';

import uncatigorized from './images/icons/devices/uncatigorized.svg';
import miscellaneous from './images/icons/devices/miscellaneous.svg';
import computer from './images/icons/devices/computer.svg';
import phone from './images/icons/devices/phone.svg';
import accessPoint from './images/icons/devices/accessPoint.svg';
import audio from './images/icons/devices/audio.svg';
import peripheral from './images/icons/devices/peripheral.svg';
import imaging from './images/icons/devices/imaging.svg';

const Device = ({ name, addr, majorClass, classes, rssi }) => {
   const img = (() => {
      switch (majorClass) {
         case 'Miscellaneous':
            return miscellaneous;
         case 'Computer':
            return computer;
         case 'Phone':
            return phone;
         case 'LAN/Network Access point':
            return accessPoint;
         case 'Audio/Video':
            return audio;
         case 'Peripheral':
            return peripheral;
         case 'Imaging':
            return imaging;
         default:
            return uncatigorized;
      }
   })();

   return (
      <div className="device">
         <div className='info'>
            <ul>
               <li>
                  <img
                     src={img}
                     alt={majorClass ? majorClass : 'Device Type'}
                  />
               </li>
               <li>
                  <div>{name}</div>
               </li>
               <li>
                  <div>{addr}</div>
               </li>
               <li>
                  <div>{rssi}</div>
               </li>
            </ul>
         </div>
           <div className='classes'>
               <ul>
            {classes.map((cl) => {
                return <li>{cl}</li>;
            })}
            </ul>
         </div>
      </div>
   );
};

export default Device;
