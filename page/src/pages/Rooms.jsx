import React from 'react';
import { useState } from 'react';
import Canvas from '../components/Canvas';
import config from '../config.json';

const default_room = config.rooms['Living'];
const default_room_key = Object.keys(config.rooms).find(
    (room) => config.rooms[room] === default_room
);

const Rooms = ({ collection, websocket }) => {
    const [selectedRoom, setSelectedRoom] = useState(default_room);
    const [roomKey, setRoomKey] = useState(default_room_key);

    const handleRoomChange = (event) => {
        const selectedOption = event.target.value;
        setSelectedRoom(config.rooms[selectedOption]);
        setRoomKey(selectedOption);
    };

    return (
        <div className="rooms">
            <h1>Rooms</h1>
            <p>
                <label htmlFor="rooms">Select a room: </label>
                <select
                    name="Rooms"
                    id="rooms"
                    className="room-selector"
                    value={roomKey}
                    onChange={handleRoomChange}
                >
                    {Object.keys(config.rooms)
                        .sort()
                        .map((obj_key, i) => {
                            if (!config.rooms[obj_key]?.corners) return null;
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
        </div>
    );
};

export default Rooms;
