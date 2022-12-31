import React from 'react';
import { useState, useEffect, useMemo } from 'react';

const padding = 30;
const scale = 0.5;

const ROOM_WALL_COLOR = 'var(--style-brown)';
const ROOM_WALL_WIDTH = '4px';
const ROOM_FILL = '#444';

const dot_radius = 8;

const Canvas = ({ collection, websocket, room }) => {
    const Dot = useMemo(() => {
        return class Dot {
            constructor(x, y) {
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
                            handleDotClick(this, event)
                            // const eve_clientX = event.clientX;
                            // const eve_clientY = event.clientY;
                            // const canvas =
                            //     event.target.parentElement.parentElement
                            //         .parentElement;
                            // const scrollTop = canvas.scrollTop;
                            // const scrollLeft = canvas.scrollLeft;
                        }}
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
            constructor(x, y, name, addr) {
                super(x, y, name, addr);
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
            setPosition(x, y) {
                this.x = x;
                this.y = y;
            }
        };
    }, [Dot]);

    const Device = useMemo(() => {
        return class Device extends Dot {
            constructor(name, mac, rssi) {
                super(name, mac, rssi);
                this.x = null;
                this.y = null;
                this.name = name;
                this.mac = mac;
                this.rssi = rssi;
                this.moveble = false;
            }
        };
    }, [Dot]);

    const handleDotClick = (dot, event) => {
        console.log('dot clicked', dot);
    }

    // const updatePosition = (addr, x, y) => {
    //     websocket.send(`UPDATE_POSITION=${addr}&${x}&${y}`);
    // };

    const [dots, setDots] = useState([]);

    useEffect(() => {
        setDots(() => {
            const sats = [];
            for (const col of Object.keys(collection)) {
                const s = new Satelite(
                    collection[col].sat?.x,
                    collection[col].sat?.y,
                    collection[col].sat.name,
                    collection[col].sat.mac
                );
                for (const dev of collection[col].devs) {
                    s.addDevice(new Device(dev.name, dev.addr, dev.rssi));
                }
                sats.push(s);
            }
            return [...sats];
        });
    }, [collection, Satelite, Device]);

    const drawRoom = (points) => {
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
            <div
                className="canvas"
                // onScroll={HandleScroll}
                // onClick={HandleClick}
            >
                {isRoomAvailable(room) ? (
                    <div className="no-room">This room is not available.</div>
                ) : (
                    <svg
                        height={(maxY + padding + padding) * scale + padding}
                        width={(maxX + padding + padding) * scale + padding}
                    >
                        {drawRoom(room.corners)}
                        {dots.map((dot, i) => {
                            return dot.getDotSVG(i);
                        })}
                    </svg>
                )}
            </div>
            <hr />
        </>
    );
};

export default Canvas;
