import React from 'react';
import { useRef, useState, useEffect, useMemo } from 'react';
import config from '../config.json';

import icon_move from '../images/icons/canvas/move.svg';

const padding = 10;
const scale = 0.5;

const svgHeight = 400 + padding * 2;
const svgWidth = 880 + padding * 2;

const dot_radius = 6;

const moveDotDefault = [null, null];
let moveDot = moveDotDefault;

// const sample_dots = [
//     {
//         name: 'Keuken1',
//         addr: '03:21:32:0d',
//         type: 'Sateliet',
//         x: 780,
//         y: 20,
//     },
//     {
//         name: 'Keuken2',
//         addr: '03:21:32:0d',
//         type: 'Satelietje',
//         x: 780,
//         y: 370,
//     },
// ];

const emptyDotsInfo = {
    focusedDot: {
        x: 0,
        y: 0,
    },
    visibible: false,
    x: 0,
    y: 0,
    dot: {
        x: 0,
        y: 0,
        name: '',
        addr: '',
    },
    type: 'None',
    selectedDot: null,
};

const Canvas = ({ collection, websocket }) => {
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
                            const eve_clientX = event.clientX;
                            const eve_clientY = event.clientY;
                            const canvas =
                                event.target.parentElement.parentElement
                                    .parentElement;
                            const scrollTop = canvas.scrollTop;
                            const scrollLeft = canvas.scrollLeft;

                            setDotInfo({
                                focusedDot: {
                                    x: eve_clientX + scrollLeft,
                                    y: eve_clientY + scrollTop,
                                },
                                visibible: true,
                                x: eve_clientX,
                                y: eve_clientY,
                                dot: {
                                    name: this.name,
                                    addr: this.addr,
                                    x: this.x,
                                    y: this.y,
                                },
                                type: this.type,
                                selectedDot: this,
                            });
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

    const updatePosition = (mac, x, y) => {
        websocket.send(`UPDATE_POSITION=${mac}&${x}&${y}`);
    };

    const svgRef = useRef(null);
    const canvasRef = useRef(null);
    const dotInfoRef = useRef(null);
    const [dots, setDots] = useState([]);
    // const [sateliteDots, setSateliteDots] = useState([]);
    const [dotInfo, setDotInfo] = useState(emptyDotsInfo);

    useEffect(() => {
        setDots(() => {
            const sats = [];
            for (const col of collection) {
                const s = new Satelite(
                    col.satelite.x,
                    col.satelite.y,
                    col.satelite.name,
                    col.satelite.mac
                );
                for (const dev of col.devices) {
                    s.addDevice(new Device(dev.name, dev.addr, dev.rssi));
                }
                sats.push(s);
            }
            return [...sats];
        });
    }, [collection, Satelite, Device]);

    const DotInfo = ({ x, y, visibible, type, dot, selectedDot }) => {
        const Button = ({ img, text, onClick }) => {
            return (
                <>
                    <div className="dotInfo-button" onClick={onClick}>
                        <img src={img} alt={`${text} Icon`} />
                        <div>{text}</div>
                    </div>
                </>
            );
        };

        return (
            <div
                ref={dotInfoRef}
                className="dotInfo"
                style={{
                    left: x,
                    top: y,
                    visibility: visibible ? 'visible' : 'hidden',
                }}
            >
                <div className="title">{type}</div>
                <div className="info">
                    <div>{dot.name}</div>
                    <div>{dot.addr}</div>
                </div>
                <div>
                    Position: {dot.x ? Math.floor(dot.x) : '?'},{' '}
                    {dot.y ? Math.floor(dot.y) : '?'}
                </div>
                {selectedDot?.moveble ? (
                    <Button
                        img={icon_move}
                        text={'Move'}
                        onClick={(event) => MoveDot(event, selectedDot)}
                    />
                ) : (
                    <></>
                )}
            </div>
        );
    };

    const drawRoom = (points) => {
        return (
            <>
                <polygon
                    points={points.map((point) => {
                        const x = point.x * scale + padding;
                        const y = point.y * scale + padding;
                        return x + ',' + y + ' ';
                    })}
                    stroke="black"
                    strokeWidth={5}
                    fill="lightgray"
                />
            </>
        );
    };

    const HandleClick = (event) => {
        if (event.target.parentElement.localName === 'g') return;
        const canvas = event.target.parentElement.parentElement;
        const container =
            event.target.parentElement.parentElement.parentElement
                .parentElement;
        const svg = svgRef.current;
        const eve_clientX = event.clientX;
        const eve_clientY = event.clientY;
        const eve_offsetLeft = svg.parentElement.offsetLeft;
        const eve_offsetTop = svg.parentElement.offsetTop;
        const svg_width = svg.clientWidth;
        const svg_height = svg.clientHeight;
        const par_width = event.target.parentElement.clientWidth;
        const par_height = event.target.parentElement.clientHeight;

        if (moveDot[0] !== null) {
            const [, dot] = moveDot;

            dot.setPosition(
                Math.floor(((eve_clientX - eve_offsetLeft) * svg_width) / par_width +
                    canvas.scrollLeft +
                    container.scrollLeft -
                    dot_radius * 1.6),
                Math.floor(((eve_clientY - eve_offsetTop) * svg_height) / par_height +
                    canvas.scrollTop +
                    container.scrollTop -
                    dot_radius * 1.6)
            );
            updatePosition(dot.addr, dot.x, dot.y);
            moveDot = moveDotDefault;
        }

        setDotInfo(emptyDotsInfo);
    };

    const HandleScroll = (event) => {
        const scrollTop = event.currentTarget.scrollTop;
        const scrollLeft = event.currentTarget.scrollLeft;

        setDotInfo((prev) => {
            prev.x = prev.focusedDot.x - scrollLeft;
            prev.y = prev.focusedDot.y - scrollTop;
            return prev;
        });
    };

    const MoveDot = (event, dot) => {
        console.log('Select where the satelite is located.');
        // setDotInfo((prev) => {
        //     return emptyDotsInfo;
        // });

        moveDot = [event, dot];
        // Rest gets handled in HandleClick
    };

    return (
        <>
            <div
                ref={canvasRef}
                className="canvas"
                onScroll={HandleScroll}
                onClick={HandleClick}
            >
                <svg ref={svgRef} height={svgHeight} width={svgWidth}>
                    {drawRoom(config.rooms.Living.corners)}
                    {/* {dots.map((dot, i) => {
                        for (const dev of dot.devices) {
                            if (dev.mac !== '00:04:4b:84:44:74') break;

                            return (
                                <>
                                    <g key={i + 0.1}>
                                        <circle
                                            cx={parseInt(dot.x) + padding}
                                            cy={parseInt(dot.y) + padding}
                                            r={Math.abs(dev.rssi)}
                                            stroke={'#000'}
                                            strokeWidth={2}
                                            fill={'transparent'}
                                        />
                                    </g>
                                </>
                            );
                        }
                        return <></>;
                    })} */}
                    {dots.map((dot, i) => {
                        return dot.getDotSVG(i);
                    })}
                </svg>
            </div>
            <DotInfo {...dotInfo} />
        </>
    );
};

export default Canvas;
