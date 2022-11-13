import React from 'react';
import { useRef, useState, useEffect, useMemo } from 'react';
import config from '../config.json';

const svgHeight = 500;
const svgWidth = svgHeight;

const dot_radius = 6;

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
                                    // x: this.x + scrollLeft,
                                    // y: this.y + scrollTop,
                                },
                                visibible: true,
                                x: eve_clientX,
                                y: eve_clientY,
                                // x: this.x,
                                // y: this.y,
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
                            cx={this.x}
                            cy={this.y}
                            r={dot_radius}
                            stroke={'#000'}
                            strokeWidth={2}
                            fill={'#0000ff75'}
                        />
                        <circle cx={this.x} cy={this.y} r={dot_radius / 2} />
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
            for (let sat of satelites) {
                sats.push(new Satelite(sat.x, sat.y, sat.name, sat.addr));
            }
            return [...sats];
        });
    }, [satelites, Satelite]);

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
                <div>{dot.name}</div>
                <div>{dot.addr}</div>
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
                        const x = (point.x / 10) * svgHeight;
                        const y = (point.y / 10) * svgWidth;
                        return x + ',' + y;
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
                {/* <svg ref={svgRef} height={height} width={width}> */}
                {drawRoom(config.rooms.test_room.corners)}
                {dots.map((dot, i) => {
                    return dot.getDotSVG(i);
                })}
            </svg>
            <DotInfo {...dotInfo} />
        </div>
    );
};

export default Canvas;
