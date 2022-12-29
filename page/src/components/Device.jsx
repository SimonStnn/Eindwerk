import React from 'react';
import config from '../config.json';

import uncatigorized from '../images/icons/device_types/uncatigorized.svg';
// import miscellaneous from '../images/icons/devices/miscellaneous.svg';
import computer from '../images/icons/device_types/computer.svg';
import phone from '../images/icons/device_types/phone.svg';
import accessPoint from '../images/icons/device_types/accessPoint.svg';
import audio from '../images/icons/device_types/audio.svg';
import peripheral from '../images/icons/device_types/peripheral.svg';
import imaging from '../images/icons/device_types/imaging.svg';

const Device = ({ data }) => {
   const { name, addr, majorClass, classes, rssi } = data;
   const img = (() => {
      switch (majorClass) {
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
         case 'Miscellaneous':
         default:
            // return miscellaneous;
            return uncatigorized;
      }
   })();

   const Classes = ({ classes }) => {
      if (!classes?.length) {
         return (
            <>
               <div>No classes available</div>
            </>
         );
      }

      return (
         <>
            {classes.map((cl, i) => {
               return <div key={i}>{cl}</div>;
            })}
         </>
      );
   };

   return (
      <div className="device">
         {/* Empty div for spacing in flexbox*/}
         <div></div>
         <div className="info">
            <div>
               <img src={img} alt={majorClass ? majorClass : 'Device Type'} />
            </div>
            <div>
               {config.showNames ? (
                  <>
                     <div>{name}</div>
                  </>
               ) : (
                  <></>
               )}
               <div>{addr}</div>
            </div>
            <div>{rssi != null ? rssi : <>null</>}</div>
         </div>
         <div className="classes">
            <Classes classes={classes} />
         </div>
      </div>
   );
};

export default Device;
