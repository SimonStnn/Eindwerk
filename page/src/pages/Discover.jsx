import React from 'react';
import Satelite from '../components/Satelite';
import Device from '../components/Device';

// const satelite_samples = [
//     {
//         name: 'Test Sateliet',
//         mac: '3c:49:b5:10:8b:ea',
//         ip: '165.136.126.11',
//         posx: 54651,
//         posy: 0,
//     },
// ];

// const device_samples = [
//     {
//         name: 'Hallo dmlqf',
//         addr: 'address',
//         majorClass: 'Computer',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'H',
//         addr: 'address',
//         majorClass: 'Computer',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Halmqskdjfmlqskjdfmlqksdjfmlqskdjfqmsdlkfjqmslkdjfmqlksjdflmkqjd sqdlkmfj mqlsdjk flmksjdllo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Miscellaneous',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Audio/Video',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Audio/Video',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Audio/Video',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Imaging',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'LAN/Network Access point',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Imaging',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Imaging',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'LAN/Network Access point',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Audio/Video',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
//     {
//         name: 'Hallo',
//         addr: 'address2',
//         majorClass: 'Phone',
//         classes: [],
//         rssi: -58,
//     },
// ];

const Discover = ({ collection }) => {
    const sats = Object.values(collection).map((item) => item.sat);
    const devs = Object.values(collection).map((item) => item.devs);

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
                {/* {satelite_samples.map((data, i) => {
                    return <Satelite data={data} key={i} />;
                })} */}
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
            <h2>Found devices</h2>
            <div className="device-container">
                {/* {device_samples.map((data, i) => {
                    return <Device data={data} key={i} />;
                })} */}
                {devs.length === 1 && devs[0].length ? (
                    devs.map((d) =>
                        d.map((dev, i) => {
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
                    )
                ) : (
                    <>No Devices Found</>
                )}
            </div>
        </div>
    );
};

export default Discover;
