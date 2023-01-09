import React from 'react';

import icon_move from '../images/icons/canvas/move.svg';
import icon_movetoRoom from '../images/icons/canvas/moveToRoom.svg';
import icon_cross from '../images/icons/canvas/cross.svg';
import Device from './Device';

const DotInfo = ({ websocket, showDot, waitRoomClick, updatePos, dotInfo }) => {
    const [dot, setDotInfoDot] = dotInfo
    const [showDotInfo, setShowDotInfo] = showDot;
    const [, setWaitingForRoomClick] = waitRoomClick;
    const [, setUpdatePosition] = updatePos;

    const dot_type = dot?.constructor.name;

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

    const handleCloseDotInfo = (e) => {
        setShowDotInfo(false);
        setDotInfoDot(null)
    };

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

    const Button = ({ icon, text, cb }) => {
        return (
            <button className="dot-info-btn btn" onClick={cb}>
                <img className="icon" src={icon} alt={`icon_${text}`} />
                <div>{text}</div>
            </button>
        );
    };
    
    const DropDown = ({ icon, text, id, name, options, cb }) => {
        return (
            <select className="dot-info-btn btn" onClick={cb}>
                <option value={text}>{text}</option>
                {options.map((opt, i) => {
                    return (
                        <option value={opt} key={i}>
                            {opt}
                        </option>
                    );
                })}
            </select>
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
                        <div>Type: {dot_type}</div>
                        <div>X: {dot.x}</div>
                        <div>Y: {dot.y}</div>
                        <div>Radius: {dot.radius}</div>
                        <hr />
                        <div className="title">
                            <div>Actions</div>
                        </div>
                        <div className="action-btns box">
                            {dot.moveble ? (
                                <>
                                    <Button
                                        icon={icon_move}
                                        text={'Update Satellite Position'}
                                        cb={handleUpdateDotPosition}
                                    />
                                    <DropDown
                                        icon={icon_movetoRoom}
                                        text={'Change room'}
                                        id={'change-room'}
                                        name={'change_room'}
                                        options={['hey', 'hoi', 'hallo']}
                                        cb={handleChangeDotRoom}
                                    />
                                </>
                            ) : null}
                        </div>
                        {dot_type === 'Satellite' ? (
                            <>
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
                            </>
                        ) : (
                            <></>
                        )}
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
