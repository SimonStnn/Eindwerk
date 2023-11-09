import React from 'react';
import Satelite from '../components/Satelite';
import Device from '../components/Device';

const Discover = ({ collection }) => {
    const sats = Object.values(collection?.sats ? collection.sats : {});

    const sats_devs = Object.values(collection?.sats ? collection.sats : {})
        .map((item) => Object.values(item.found_devices))
        .flat();
    const devs = Object.values(collection?.devs ? collection.devs : {});

    return (
        <div className="discover">
            <h1>Discover</h1>
            <p>
                Each found device from each satellite is displayed here, this
                means the same device could be multiple times in the list. This
                is because the same device was discovered by multiple
                satellites.
            </p>
            <hr />
            <h2>Connected Satellites</h2>
            <div className="satelite-container">
                {sats.length ? (
                    sats.map((sat, i) => {
                        return (
                            <Satelite
                                name={sat.name}
                                addr={sat.addr}
                                ip={sat.ip}
                                x={sat.x}
                                y={sat.y}
                                key={i}
                            />
                        );
                    })
                ) : (
                    <>No Connected Satellites</>
                )}
            </div>
            <hr />
            <h2>Located Devices</h2>
            <div className="device-container">
                {!(devs.length === 0 || devs[0].length === 0) ? (
                    devs.map((dev, i) => {
                        return (
                            <Device
                                name={dev.name}
                                addr={dev.addr}
                                clas={dev.clas}
                                rssi={dev.rssi}
                                key={i}
                            />
                        );
                    })
                ) : (
                    <>No Devices Located</>
                )}
            </div>
            <hr />
            <h2>Found Devices</h2>
            <div className="device-container">
                {!(sats_devs.length === 0 || sats_devs[0].length === 0) ? (
                    sats_devs.map((dev, i) => {
                        return (
                            <Device
                                name={dev.name}
                                addr={dev.addr}
                                clas={dev.clas}
                                rssi={dev.rssi}
                                key={i}
                            />
                        );
                    })
                ) : (
                    <>No Devices Found</>
                )}
            </div>
        </div>
    );
};

export default Discover;
