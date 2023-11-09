import React, { useRef } from 'react';

import icon_move from '../images/icons/canvas/move.svg';
import icon_cross from '../images/icons/canvas/cross.svg';
import icon_movetoRoom from '../images/icons/other/login.svg';
import icon_rename from '../images/icons/other/info.svg';
import Device from './Device';

import config from '../config.json';

const DotInfo = React.memo(
    ({
        websocket,
        showDot,
        dotInfo,
        waitRoomClick,
        updatePos,
        addNotification,
    }) => {
        const [dot, setDotInfoDot] = dotInfo;
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
            setDotInfoDot(null);
        };

        const handleUpdateDotPosition = (event) => {
            // Show a notification at the top of the screen to let users know they have to click on the position in the room where the dot is located.
            setWaitingForRoomClick(true);
            setUpdatePosition({
                dot,
                bool: true,
            });
            handleCloseDotInfo(event);
            addNotification({
                content:
                    'Click on the position in the room where the dot is located.',
            });
        };

        const handleChangeDotRoom = (event) => {
            const selectedOption = event.target.value;
            dot.changeRoom(selectedOption);
            addNotification({
                content: `Moved ${
                    dot.name ? dot.name : dot.addr
                } to ${selectedOption}`,
            });
            handleCloseDotInfo(event);
        };

        const handleRename = (event, newName) => {
            if (!newName) return;

            dot.rename(newName)
            handleCloseDotInfo(event);
        };

        const Button = ({ icon, text, cb }) => {
            return (
                <button className="dot-info-btn btn" onClick={cb}>
                    <img className="icon" src={icon} alt={`icon_${text}`} />
                    <div>{text}</div>
                </button>
            );
        };

        const TextBox = ({ icon, text, cb }) => {
            const nameRef = useRef();
            return (
                <div className="dot-info-btn btn">
                    <img className="icon" src={icon} alt={`icon_${text}`} />{' '}
                    {text}
                    <input
                        type="text"
                        name="rename-input"
                        id="rename-input"
                        ref={nameRef}
                    />
                    <button
                        className="btn"
                        onClick={(e) => cb(e, nameRef.current.value)}
                    >
                        {'submit'}
                    </button>
                </div>
            );
        };

        const DropDown = ({ icon, text, id, name, options, cb }) => {
            return (
                <div className="dot-info-btn btn">
                    <img className="icon" src={icon} alt={`icon_${text}`} />{' '}
                    <select className="btn" onChange={cb}>
                        {options
                            .filter((val) => val !== undefined)
                            .map((val, i) => (
                                <option key={i} value={val}>
                                    Change room: {val}
                                </option>
                            ))}
                    </select>
                </div>
            );
        };

        return (
            <div
                className={`dot-info-background ${
                    showDotInfo ? 'visible' : ''
                    }`}
            >
                <div className="dot-info-container">
                    <div className="dot-info-content-wrapper">
                        <div className="content">
                            <div className="title">
                                <div>{dot.name}</div>
                                <div>{dot.addr}</div>
                            </div>
                            <div>Type: {dot_type}</div>
                            <div>Room: {dot.room}</div>
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
                                        <TextBox
                                            icon={icon_rename}
                                            text={'Rename Satellite'}
                                            cb={handleRename}
                                        />
                                        <DropDown
                                            icon={icon_movetoRoom}
                                            text={'Change room'}
                                            id={'change-room'}
                                            name={'change_room'}
                                            options={[
                                                dot.room,
                                                ...Object.keys(config.rooms)
                                                    .sort()
                                                    .filter(
                                                        (room) =>
                                                            dot.room !== room &&
                                                            config.rooms[room]
                                                                ?.corners
                                                                ?.length
                                                    ),
                                            ]}
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
                        <div
                            className="close-icon"
                            onClick={handleCloseDotInfo}
                        >
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
    },
    // Check if the component has to re-render
    (prevProps, nextProps) => {
        // Compare the props here and return true or false
        return (
            prevProps.dotInfo[0]?.addr === nextProps.dotInfo[0]?.addr &&
            prevProps.dotInfo[0]?.x === nextProps.dotInfo[0]?.x &&
            prevProps.dotInfo[0]?.y === nextProps.dotInfo[0]?.y
        );
    }
);

export default DotInfo;
