import { useState } from "react";
import Device from "./Device";

const classes = ['rendering', 'object transfer', 'audio', 'information']

const samples = [
  {
    name: "Simon's A53",
    addr: 'F0:65:AE:2F:C5:D5',
    majorClass: 'Phone',
    classes: ['rendering', 'object transfer', 'audio', 'information'],
    rssi: -38,
  },
  {
    name: "A50 van Anouck",
    addr: 'F1:76:AD:3F:C6:D6',
    majorClass: 'Phone',
    classes: ['rendering', 'object transfer', 'audio', 'information'],
    rssi: -24,
  },
];

function App() {
  const [devices, setDevices] = useState([])


  return (
    <div className="App">
      <div className="container">
        <Device name="Miscellaneous" addr="" majorClass="Miscellaneous" classes={["auc", ...classes]} rssi="-47" />
        <Device name="Computer" addr="" majorClass="Computer" classes={classes} rssi="-31" />
        <Device name="LAN/Network Access point" addr="" majorClass="LAN/Network Access point" classes={classes} rssi="-26" />
        <Device name="Audio/Video" addr="" majorClass="Audio/Video" classes={classes} rssi="-53" />
        <Device name="Peripheral" addr="" majorClass="Peripheral" classes={classes} rssi="-18" />
        <Device name="Imaging" addr="" majorClass="Imaging" classes={classes} rssi="-23" />
        {/* {
          samples.map(({name, addr, majorClass, classes, rssi}) => {
            return (
              <Device name={name} addr={addr} majorClass={majorClass} classes={classes} rssi={rssi}/>
            )
          })
        } */}
      </div>
    </div>
  );
}

export default App;
