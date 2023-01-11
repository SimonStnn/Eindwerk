import React from 'react';
import { useState, useEffect, useMemo } from 'react';

import DotInfo from './DotInfo';

const padding = 30;
const scale = 0.5;

const ROOM_WALL_COLOR = 'var(--style-brown)';
const ROOM_WALL_WIDTH = '4px';
const ROOM_FILL = '#444';

const dot_radius = 8;

const Canvas = ({ collection, websocket, room, addNotification }) => {
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
                this.name = '';
                this.addr = '';
                this.moveble = false;
                this.radius = dot_radius;

                // Color of the dot when displayed
                this.stroke = '#000';
                this.strokeWidth = 2;
                this.fill = '#0000ff60';
                this.centerFill = 'black';
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
                        <title>{this.name}</title>
                        <circle
                            cx={x}
                            cy={y}
                            r={this.radius}
                            stroke={this.stroke}
                            strokeWidth={this.strokeWidth}
                            fill={this.fill}
                        />
                        <circle
                            cx={x}
                            cy={y}
                            r={dot_radius / 2.2}
                            stroke={this.stroke}
                            fill={this.centerFill}
                        />
                    </g>
                );
            }
        };
    }, []);

    const Satellite = useMemo(() => {
        return class Satellite extends Dot {
            constructor(room, x, y, name, addr) {
                super(x, y, name, addr, room);
                this.room = room;
                this.x = x;
                this.y = y;
                this.name = name;
                this.addr = addr;
                this.devices = [];
                this.moveble = true;
                this.radius = dot_radius;
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
            changeRoom(room) {
                this.room = room;
                this.x = null;
                this.y = null;

                websocket.send(`CHANGE_ROOM=${this.addr}&${this.room}`);
            }
        };
    }, [Dot, websocket]);

    const Found_Device = useMemo(() => {
        return class Found_Device extends Dot {
            constructor(room, name, addr, clas, rssi) {
                super(name, addr, rssi);
                this.name = name;
                this.addr = addr;
                this.clas = clas;
                this.rssi = rssi;
                this.room = room;
            }
        };
    }, [Dot]);

    const Device = useMemo(() => {
        return class Device extends Dot {
            constructor(room, x, y, name, addr, clas, radius) {
                super(room, x, y, name, addr, clas, radius);
                this.room = room;
                this.x = x;
                this.y = y;
                this.name = name;
                this.addr = addr;
                this.clas = clas;
                this.radius = radius;
                this.found_by = [];

                // Color of the dot when displayed
                this.stroke = '#000';
                this.strokeWidth = 2;
                this.fill = '#ffff0050';
                this.centerFill = 'black';
            }
            addParent(parent) {
                this.found_by.push(parent);
            }
        };
    }, [Dot]);

    useEffect(() => {
        setDots(() => {
            const sats = [];
            for (const addr of Object.keys(
                collection?.sats ? collection.sats : {}
            )) {
                const s = new Satellite(
                    collection.sats[addr].sat?.room,
                    collection.sats[addr].sat?.x,
                    collection.sats[addr].sat?.y,
                    collection.sats[addr].sat.name,
                    collection.sats[addr].sat.addr
                );
                for (const dev of collection.sats[addr].devs) {
                    s.addDevice(
                        new Found_Device(
                            collection.sats[addr].sat?.room,
                            dev.name,
                            dev.addr,
                            dev.clas,
                            dev.rssi
                        )
                    );
                }
                sats.push(s);
            }

            const devs = [];
            for (const addr of Object.keys(
                collection?.devs ? collection.devs : {}
            )) {
                const d = new Device(
                    collection.devs[addr].room,
                    collection.devs[addr].x,
                    collection.devs[addr].y,
                    collection.devs[addr].name,
                    collection.devs[addr].addr,
                    collection.devs[addr].clas,
                    collection.devs[addr].radius
                );
                devs.push(d);
            }
            return [...sats, ...devs];
        });
    }, [collection, Satellite, Found_Device, Device]);

    const drawRoom = (points) => {
        const handleRoomClick = (event) => {
            if (!waitingForRoomClick) return;
            setWaitingForRoomClick(false);

            const svgRect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - svgRect.left;
            const y = event.clientY - svgRect.top;
            addNotification({
                content: `Changed from ${
                    updatePosition.dot.name
                        ? updatePosition.dot.name
                        : updatePosition.dot.addr
                } to: X: ${Math.floor(x)}, Y: ${Math.floor(y)}`,
            });

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
                            {dots
                                // sort from biggest to smallest
                                // this way the biggest are below the smaller dots
                            .sort((a, b) => b.radius - a.radius)
                            .map((dot, i) => {
                                if (
                                    dot.room !== room.name &&
                                    dot.room !== undefined
                                )
                                    return null;
                                return dot.getDotSVG(i);
                            })}
                    </svg>
                )}
                <DotInfo
                    websocket={websocket}
                    showDot={[showDotInfo, setShowDotInfo]}
                    dotInfo={[dotInfoDot, setDotInfoDot]}
                    waitRoomClick={[
                        waitingForRoomClick,
                        setWaitingForRoomClick,
                    ]}
                    updatePos={[updatePosition, setUpdatePosition]}
                    addNotification={addNotification}
                />
            </div>
            <hr />
        </>
    );
};

export default Canvas;
