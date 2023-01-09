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

function decodeBluetoothClass(classValue) {
    const getServiceClasses = (classValue) => {
        const serviceClasses = [];
        // const getServiceClass = (value) => {
        //     const serviceClass = (value >> 13) & 0xff;
        //     switch (serviceClass) {
        //         case 0x00:
        //             return 'Limited Discoverable Mode';
        //         case 0x01:
        //             return 'Positioning'; // (Location identification)
        //         case 0x02:
        //             return 'Networking'; // (LAN, Ad hoc, ...)
        //         case 0x03:
        //             return 'Rendering'; // (Printing, Speakers, ...)
        //         case 0x04:
        //             return 'Capturing'; // (Scanner, Microphone, ...)
        //         case 0x05:
        //             return 'Object Transfer'; // (v­Inbox, v­Folder, ...)
        //         case 0x06:
        //             return 'Audio'; // (Speaker, Microphone, Headset service, ...)
        //         case 0x07:
        //             return 'Telephony'; // (Cordless telephony, Modem, Headset service, ...)
        //         case 0x08:
        //             return 'Information'; // (WEB­server, WAP­server, ...)
        //         default:
        //             return 'Unknown';
        //     }
        // };
        // for (let i = 0; i < 21; i++) {
        //     if (classValue & (1 << (i + 11))) {
        //         serviceClasses.push(getServiceClass(1 << (i + 11)));
        //     }
        // }

        const serviceClass = (classValue >> 13) & 0xff;

        // for (let i = 0; i <= 10; i++){
        //     if (serviceClass & )
        // }

        console.log(classValue.toString(2));
        console.log(serviceClass.toString(2), serviceClass.length);

        return serviceClasses;
    };

    const getMajorClass = (classValue) => {
        // Extract the major device class from the Bluetooth class value
        const majorClass = (classValue >> 8) & 0x1f;

        console.log(
            classValue.toString(2),
            majorClass,
            majorClass.toString(2),
            majorClass.toString(16)
        );

        switch (majorClass) {
            case 0x00:
                return 'Computer'; // (desktop, notebook, PDA, organizer, ...)
            case 0x01:
                return 'Phone'; // (cellular, cordless, pay phone, modem, ...)
            case 0x02:
                return 'LAN/Network Access Point';
            case 0x04:
                return 'Audio/Video'; // (headset, speaker, stereo, video display, VCR, ...)
            case 0x05:
                return 'Peripheral'; // (mouse, joystick, keyboard, ...)
            case 0x06:
                return 'Imaging'; // (printer, scanner, camera, display, ...)
            case 0x07:
                return 'Wearable';
            case 0x08:
                return 'Toy';
            case 0x09:
                return 'Health';
            case 0x1f:
                return 'Uncategorized'; // device code not specified
            default:
                return 'Unknown';
        }
    };

    // Return the decoded class values
    return {
        serviceClasses: getServiceClasses(classValue),
        // majorClass: getMajorClass(classValue),
    };
}

const Device = ({ name, addr, clas, rssi }) => {
    const { serviceClasses, majorClass } = decodeBluetoothClass(
        parseInt(clas, 10)
    );

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

    const Classes = ({ clas }) => {
        return clas ? (
            <div>
                <div>{clas}</div>
                {/* {decodeBluetoothClass(clas).map((cl, i) => {
                    return <div key={i}>{cl}</div>;
                })} */}
            </div>
        ) : (
            <div>No classes available</div>
        );
    };

    return (
        <div className="device">
            {/* Empty div for spacing in flexbox*/}
            <div></div>
            <div className="info">
                <div>
                    <img
                        src={img}
                        // alt={majorClass ? majorClass : 'Device Type'}
                        alt={'Device Type'}
                    />
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
                <Classes clas={clas} />
            </div>
        </div>
    );
};

export default Device;
