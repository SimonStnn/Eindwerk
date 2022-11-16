import React from 'react';
import { useRef, useState, useEffect, useMemo } from 'react';
import config from '../config.json';

const padding = 10;
const scale = 0.5;

const svgHeight = 400 + padding * 2;
const svgWidth = 800 + padding * 2;

const dot_radius = 6;

const sample_dots = [
    {
        name: 'Keuken1',
        addr: '03:21:32:0d',
        type: 'Sateliet',
        x: 100,
        y: 200,
    },
    {
        name: 'Keuken2',
        addr: '03:21:32:0d',
        type: 'Satelietje',
        x: 750,
        y: 50,
    },
    {
        name: 'Living',
        addr: '03:21:32:0d',
        type: 'uwu',
        x: 100,
        y: 100,
    },
    {
        name: 'TV',
        addr: '03:21:32:0d',
        type: 'Maxim',
        x: 550,
        y: 350,
    },
];

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
};

const Canvas = ({ height, width, satelites, devices }) => {
    const Dot = useMemo(() => {
        return class Dot {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }

            getDotSVG(i) {
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
                            });
                        }}
                    >
                        <circle
                            cx={parseInt(this.x) + padding}
                            cy={parseInt(this.y) + padding}
                            r={dot_radius}
                            stroke={'#000'}
                            strokeWidth={2}
                            fill={'#0000ff75'}
                        />
                        <circle
                            cx={parseInt(this.x) + padding}
                            cy={parseInt(this.y) + padding}
                            r={dot_radius / 2}
                        />
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
            }
        };
    }, [Dot]);

    const Device = useMemo(() => {
        return class Device extends Dot {
            constructor(x, y, name, mac, rssi) {
                super(x, y, name, mac, rssi);
                this.x = x;
                this.y = y;
                this.name = name;
                this.mac = mac;
                this.rssi = rssi;
            }
            
            radius(i, signal_strength) {
                return (
                    <g key={i}>
                        <circle
                            cx={parseInt(this.x) + padding}
                            cy={parseInt(this.y) + padding}
                            r={signal_strength * scale}
                            stroke={'#000'}
                            strokeWidth={2}
                        />
                    </g>
                );
            }
        };
    }, [Dot]);

    const svgRef = useRef(null);
    const canvasRef = useRef(null);
    const [dots, setDots] = useState([]);
    const [dotInfo, setDotInfo] = useState(emptyDotsInfo);

    useEffect(() => {
        setDots(() => {
            const sats = [];
            for (const sat of satelites) {
                sats.push(new Satelite(sat.x, sat.y, sat.name, sat.mac));
            }
            return [...sats];
        });
    }, [satelites, devices, Satelite, Device]);

    const DotInfo = ({ x, y, visibible, type, dot, focusedDot }) => {
        return (
            <div
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
                    Position: {dot.x ? dot.x : 0}, {dot.y ? dot.y : 0}
                </div>
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

        // const svg = svgRef.current;
        // const eve_clientX = event.clientX;
        // const eve_clientY = event.clientY;
        // const eve_offsetLeft = svg.parentElement.offsetLeft;
        // const eve_offsetTop = svg.parentElement.offsetTop;
        // const svg_width = svg.clientWidth;
        // const svg_height = svg.clientHeight;
        // const par_width = event.target.parentElement.clientWidth;
        // const par_height = event.target.parentElement.clientHeight;
        // if (
        //     !eve_clientX ||
        //     !eve_clientY ||
        //     !eve_offsetLeft ||
        //     !eve_offsetTop ||
        //     !svg_width ||
        //     !svg_height ||
        //     !par_width ||
        //     !par_height
        // ) {
        //     return;
        // }

        // const container =
        //     event.target.parentElement.parentElement.parentElement
        //         .parentElement;
        // const canvas = event.target.parentElement.parentElement;

        // setDots(() => {
        //     return [
        //         ...dots,
        //         {
        //             x:
        //                 ((eve_clientX - eve_offsetLeft) * svg_width) /
        //                     par_width -
        //                 dot_radius * 2.4 +
        //                 canvas.scrollLeft,
        //             y:
        //                 ((eve_clientY - eve_offsetTop) * svg_height) /
        //                     par_height -
        //                 dot_radius * 2.4 +
        //                 canvas.scrollTop +
        //                 container.scrollTop,
        //         },
        //     ];
        // });

        setDotInfo(emptyDotsInfo);
    };

    const HandleScroll = (event) => {
        const scrollTop = event.currentTarget.scrollTop;
        const scrollLeft = event.currentTarget.scrollLeft;

        setDotInfo((prev) => {
            return {
                focusedDot: {
                    x: prev.focusedDot.x,
                    y: prev.focusedDot.y,
                },
                visibible: prev.visibible,
                x: prev.focusedDot.x - scrollLeft,
                y: prev.focusedDot.y - scrollTop,
                dot: {
                    x: prev.dot.x,
                    y: prev.dot.y,
                    name: prev.dot.name,
                    addr: prev.dot.addr,
                },
                type: prev.type,
            };
        });
    };

    return (
        <div
            ref={canvasRef}
            className="canvas"
            onScroll={HandleScroll}
            onClick={HandleClick}
        >
            <svg ref={svgRef} height={svgHeight} width={svgWidth}>
                {drawRoom(config.rooms.Living.corners)}
                {dots.map((dot, i) => {
                    return dot.getDotSVG(i);
                })}
                {dots.map((dot, i) => {
                    console.log(dots);
                    if (dot.addr !== '00:04:4b:84:44:74') return <></>;
                    return dot.radius(i, 50);
                })}
                {sample_dots.map((dot, i) => {
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
                                        name: dot.name ? dot.name : 'name',
                                        addr: dot.addr ? dot.addr : 'addr',
                                        x: dot.x,
                                        y: dot.y,
                                    },
                                    type: dot.type ? dot.type : 'type',
                                });
                            }}
                        >
                            <circle
                                cx={parseInt(dot.x) + padding}
                                cy={parseInt(dot.y) + padding}
                                r={dot_radius}
                                stroke={'#000'}
                                strokeWidth={2}
                                fill={'#0000ff75'}
                            />
                            <circle
                                cx={parseInt(dot.x) + padding}
                                cy={parseInt(dot.y) + padding}
                                r={dot_radius / 2}
                            />
                        </g>
                    );
                })}
            </svg>
            <DotInfo {...dotInfo} />
        </div>
    );
};

export default Canvas;
