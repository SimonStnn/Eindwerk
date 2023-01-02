import React from 'react';
import { useEffect } from 'react';

// import icon_move from '../images/icons/canvas/move.svg';
// import icon_movetoRoom from '../images/icons/canvas/moveToRoom.svg';
import icon_cross from '../images/icons/canvas/cross.svg';
import Device from './Device';

const DotInfo = ({ websocket, showDot, waitRoomClick, updatePos, dot }) => {
    const [showDotInfo, setShowDotInfo] = showDot;
    const [, setWaitingForRoomClick] = waitRoomClick;
    const [, setUpdatePosition] = updatePos;

    if (dot === null)
        return (
            <div
                className={`dot-info-background ${
                    showDotInfo ? 'visible' : ''
                }`}
            >
                <div className="dot-info-container"></div>
            </div>
        );

    const handleUpdateDotPosition = (e) => {
        // Show a notification at the top of the screen to let users know they have to click on the position in the room where the dot is located.
        setWaitingForRoomClick(true);
        setUpdatePosition({
            dot,
            bool: true,
        });
        handleCloseDotInfo(e);
        console.log('Click on the position where the dot is located.');
    };

    const handleChangeDotRoom = (e) => {};

    const handleCloseDotInfo = (e) => {
        setShowDotInfo(false);
    };

    const Button = ({ icon, text, cb }) => {
        return (
            <div className="dot-info-btn btn" onClick={cb}>
                <img className="icon" src={icon} alt={`icon_${text}`} />
                <div>{text}</div>
            </div>
        );
    };

    const DropDown = ({ icon, text, cb }) => {
        return (
            <div className="dot-info-btn btn" onClick={cb}>
                <img className="icon" src={icon} alt={`icon_${text}`} />
                <div>{text}</div>
            </div>
        );
    };

    return (
        <div className={`dot-info-background ${showDotInfo ? 'visible' : ''}`}>
            <div className="dot-info-container">
                <div className="dot-info-content-wrapper">
                    <div className="content">
                        <div className="title">
                            <div>{dot.name}</div>
                            <div>{dot.addr}</div>
                        </div>
                        <div>Type: {dot.type}</div>
                        <div>X: {dot.x}</div>
                        <div>Y: {dot.y}</div>
                        <hr />
                        <div className="title">
                            <div>Actions</div>
                        </div>
                        <div className="action-btns box">
                            <Button
                                icon={icon_cross}
                                text={'Update Satellite Position'}
                                cb={handleUpdateDotPosition}
                            />
                            <DropDown
                                icon={icon_cross}
                                text={'Change room'}
                                cb={handleChangeDotRoom}
                            />
                        </div>
                        <hr />
                        <div className="found-devices">
                            <div className="title">
                                <div>Found Devices</div>
                            </div>
                            <div className="found-devices-wrapper box">
                                <div className="device-container found">
                                    {dot.devices.map((dev, i) => {
                                        return (
                                            <Device
                                                name={dev.name}
                                                addr={dev.addr}
                                                clas={dev.clas}
                                                rssi={dev.rssi}
                                                key={i}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="close-icon" onClick={handleCloseDotInfo}>
                        <img
                            className="icon"
                            src={icon_cross}
                            alt="Close-dotinfo"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DotInfo;
