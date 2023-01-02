import React from 'react';
import { useState, useEffect, useMemo } from 'react';

import DotInfo from './DotInfo';

const padding = 30;
const scale = 0.5;

const ROOM_WALL_COLOR = 'var(--style-brown)';
const ROOM_WALL_WIDTH = '4px';
const ROOM_FILL = '#444';

const dot_radius = 8;

const Canvas = ({ collection, websocket, room }) => {
    const [showDotInfo, setShowDotInfo] = useState(false);
    const [dotInfoDot, setDotInfoDot] = useState(null);
    const [waitingForRoomClick, setWaitingForRoomClick] = useState(false);
    const [updatePosition, setUpdatePosition] = useState({
        dot: null,
        bool: false,
    });
    const [dots, setDots] = useState([]);

    const Dot = useMemo(() => {
        const handleDotClick = (dot, event) => {
            setShowDotInfo(true);
            setDotInfoDot(dot);
        };

        return class Dot {
            constructor(room, x, y) {
                this.room = room;
                this.x = x;
                this.y = y;
                this.moveble = false;
            }

            getDotSVG(i) {
                const x = this.x ? parseInt(this.x) + padding : 0 + padding;
                const y = this.y ? parseInt(this.y) + padding : 0 + padding;

                return (
                    <g
                        key={i}
                        onClick={(event) => {
                            handleDotClick(this, event);
                        }}
                        className={'dot'}
                    >
                        <circle
                            cx={x}
                            cy={y}
                            r={dot_radius}
                            stroke={'#000'}
                            strokeWidth={2}
                            fill={'#0000ff75'}
                        />
                        <circle cx={x} cy={y} r={dot_radius / 2} />
                    </g>
                );
            }
        };
    }, []);

    const Satelite = useMemo(() => {
        return class Satelite extends Dot {
            constructor(room, x, y, name, addr) {
                super(x, y, name, addr, room);
                this.room = room;
                this.x = x;
                this.y = y;
                this.name = name;
                this.addr = addr;
                this.type = 'Satelite';
                this.devices = [];
                this.moveble = true;
            }
            addDevice(dev) {
                this.devices.push(dev);
            }
            setPosition(room, x, y) {
                this.room = room;
                this.x = Math.floor(x);
                this.y = Math.floor(y);

                websocket.send(
                    `UPDATE_POS=${this.addr}&${this.room}&${this.x}&${this.y}`
                );
            }
        };
    }, [Dot, websocket]);

    const Device = useMemo(() => {
        return class Device extends Dot {
            constructor(name, addr, clas, rssi, room) {
                super(name, addr, rssi);
                this.x = null;
                this.y = null;
                this.name = name;
                this.addr = addr;
                this.clas = clas;
                this.rssi = rssi;
                this.room = room;
                this.moveble = false;
            }
        };
    }, [Dot]);

    useEffect(() => {
        setDots(() => {
            const sats = [];
            for (const col of Object.keys(collection)) {
                const s = new Satelite(
                    collection[col].sat?.room,
                    collection[col].sat?.x,
                    collection[col].sat?.y,
                    collection[col].sat.name,
                    collection[col].sat.addr
                );
                for (const dev of collection[col].devs) {
                    s.addDevice(
                        new Device(
                            dev.name,
                            dev.addr,
                            dev.clas,
                            dev.rssi,
                            collection[col].sat?.room
                        )
                    );
                }
                sats.push(s);
            }
            return [...sats];
        });
    }, [collection, Satelite, Device]);

    const drawRoom = (points) => {
        const handleRoomClick = (event) => {
            if (!waitingForRoomClick) return;
            setWaitingForRoomClick(false);

            const svgRect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - svgRect.left;
            const y = event.clientY - svgRect.top;
            console.log(
                `Clicked at position: (${Math.floor(x)}, ${Math.floor(y)})`
            );

            updatePosition.dot.setPosition(room.name, x, y);
        };
        return (
            <polygon
                points={points.map((point) => {
                    const x = point.x * scale + padding;
                    const y = point.y * scale + padding;
                    return x + ',' + y + ' ';
                })}
                stroke={ROOM_WALL_COLOR}
                strokeWidth={ROOM_WALL_WIDTH}
                fill={ROOM_FILL}
                onClick={handleRoomClick}
            />
        );
    };

    const maxX = room.corners.reduce((max, point) => Math.max(max, point.x), 0);
    const maxY = room.corners.reduce((max, point) => Math.max(max, point.y), 0);

    function isRoomAvailable(room) {
        return room.corners.length === 0;
    }

    return (
        <>
            <div className="canvas">
                {isRoomAvailable(room) ? (
                    <div className="no-room">This room is not available.</div>
                ) : (
                    <svg
                        height={(maxY + padding + padding) * scale + padding}
                        width={(maxX + padding + padding) * scale + padding}
                    >
                        {drawRoom(room.corners)}
                            {dots.map((dot, i) => {
                            if (dot.room !== room.name && dot.room !== undefined) return null;
                            return dot.getDotSVG(i);
                        })}
                    </svg>
                )}
                <DotInfo
                    websocket={websocket}
                    showDot={[showDotInfo, setShowDotInfo]}
                    waitRoomClick={[
                        waitingForRoomClick,
                        setWaitingForRoomClick,
                    ]}
                    updatePos={[updatePosition, setUpdatePosition]}
                    dot={dotInfoDot}
                />
            </div>
            <hr />
        </>
    );
};

export default Canvas;
