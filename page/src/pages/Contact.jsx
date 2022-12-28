import React from 'react';
import { useState } from 'react';
import Canvas from '../components/Canvas';
import config from '../config.json';

const default_room = config.rooms.Living;
const default_room_key = Object.keys(config.rooms).find(
    (room) => config.rooms[room] === default_room
);

const Contact = ({ collection, websocket }) => {
    const [selectedRoom, setSelectedRoom] = useState(default_room);
    const [roomKey, setRoomKey] = useState(default_room_key);

    const handleRoomChange = (event) => {
        const selectedOption = event.target.value;
        setSelectedRoom(config.rooms[selectedOption]);
        setRoomKey(selectedOption);
    };


    return (
        <>
            <h1>Canvas</h1>
            <p>
                <label htmlFor="rooms">Select a room: </label>
                <select
                    name="Rooms"
                    id="rooms"
                    className="room-selector"
                    value={roomKey}
                    onChange={handleRoomChange}
                >
                    {Object.keys(config.rooms).map((obj_key, i) => {
                        return (
                            <option key={i} value={obj_key}>
                                {obj_key}
                            </option>
                        );
                    })}
                </select>
            </p>
            <Canvas
                collection={collection}
                websocket={websocket}
                room={selectedRoom}
            />
        </>
    );
};

export default Contact;
