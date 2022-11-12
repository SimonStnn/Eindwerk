import React from 'react';
import { useRef, useEffect, useState } from 'react';
import config from '../config.json';

const svgHeight = 600;
const svgWidth = svgHeight;

const dot_radius = 6;



const Canvas = ({ height, width }) => {
    const svgRef = useRef(null);
    let svg;
    const [dots, setDots] = useState([
        {
            x: 100,
            y: 100,
        },
    ]);
    const [dotInfo, setDotInfo] = useState({
        visibible: false,
        x: 0,
        y: 0,
    });

    const DotInfo = ({ x, y, visibible }) => {
        return (
            <div
                className="dotInfo"
                style={{
                    left: x,
                    top: y,
                    visibility: visibible ? 'visible' : 'hidden',
                }}
            >
                DotInfo
            </div>
        );
    };

    useEffect(() => {
        svg = svgRef.current;
        // const parent = svg.parentElement;
    });

    const drawRoom = (points) => {
        return (
            <>
                <polygon
                    points={points.map((point) => {
                        const x = (point.x / 10) * svgHeight;
                        const y = (point.y / 10) * svgWidth;
                        return x + ',' + y;
                    })}
                    stroke="purple"
                    fill="lightgray"
                />
            </>
        );
    };

    const HandleClick = (event) => {
        const eve_clientX = event.clientX;
        const eve_clientY = event.clientY;
        const eve_offsetLeft = svg.parentElement.offsetLeft;
        const eve_offsetTop = svg.parentElement.offsetTop;
        const svg_width = svg.clientWidth;
        const svg_height = svg.clientHeight;
        const par_width = event.target.parentElement.clientWidth;
        const par_height = event.target.parentElement.clientHeight;
        if (
            eve_clientX === 0 ||
            eve_clientY === 0 ||
            eve_offsetLeft === 0 ||
            eve_offsetTop === 0 ||
            svg_width === 0 ||
            svg_height === 0 ||
            par_width === 0 ||
            par_height === 0
        ) {
            return;
        }
        setDots(() => {
            return [
                ...dots,
                {
                    x:
                        ((eve_clientX - eve_offsetLeft) * svg_width) /
                            par_width -
                        dot_radius * 2.4,
                    y:
                        ((eve_clientY - eve_offsetTop) * svg_height) /
                            par_height -
                        dot_radius * 2.4,
                },
            ];
        });
        setDotInfo({
            visibible: false,
            x: 0,
            y: 0,
        });
    };
    const HandleDotClick = (event) => {
        // const g = event.target.parentElement
        const eve_clientX = event.clientX;
        const eve_clientY = event.clientY;
        setDotInfo({
            visibible: true,
            x: eve_clientX,
            y: eve_clientY,
        });
    };

    return (
        <>
            <svg
                ref={svgRef}
                height={svgHeight}
                width={svgWidth}
                onClick={HandleClick}
            >
                {/* <svg ref={svgRef} height={height} width={width}> */}
                {drawRoom(config.rooms.test_room.corners)}
                {dots.map((pos, i) => {
                    const x = pos.x ? pos.x : 0;
                    const y = pos.y ? pos.y : 0;
                    return (
                        <g key={i} onClick={HandleDotClick}>
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
                })}
            </svg>
            <DotInfo {...dotInfo} />
        </>
    );
};

// class Room {
//     constructor(cornerPoints) {
//         this.cornerPoints = cornerPoints;
//     }

//     drawRoom(ctx) {
//         ctx.fillStyle = '#eee';
//         ctx.strokeStyle = '#000';
//         ctx.lineWidth = 8;
//         ctx.beginPath();
//         for (let point of this.cornerPoints) {
//             ctx.lineTo(point.x, point.y);
//         }
//         ctx.closePath();
//         ctx.stroke();
//         ctx.fill();
//     }
//     drawDot(ctx, x, y, circle_radius, color_fill, color_stroke, stroke_width) {
//         ctx.fillStyle = color_fill;
//         ctx.strokeStyle = color_stroke;
//         ctx.lineWidth = stroke_width;
//         ctx.beginPath();
//         ctx.arc(x, y, circle_radius, 0, Math.PI * 2, false);
//         ctx.fill();
//         ctx.stroke();
//         ctx.beginPath();
//         ctx.fillStyle = color_stroke;
//         ctx.arc(x, y, circle_radius / 2.2, 0, Math.PI * 2, false);
//         ctx.fill();
//     }

//     drawSatelite(ctx, satelite) {
//         const color_fill = '#ff000075';
//         const color_stroke = '#ff0000';
//         const circle_radius = 10;
//         const stroke_width = 2;

//         this.drawDot(
//             ctx,
//             satelite.x,
//             satelite.y,
//             circle_radius,
//             color_fill,
//             color_stroke,
//             stroke_width
//         );
//     }
// }
// const room = new Room(config.rooms.test_room.corners);

// const Canvas = (props) => {
//     const canvasRef = useRef(null);
//     let ctx;
//     let canvas;
//     // const [coords, setCoords] = useState({ x: 0, y: 0 });
//     const draw = (ctx, frameCount) => {
//         ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//         room.drawRoom(ctx);
//         ctx.fillStyle = '#000000';
//         ctx.lineWidth = 5;

//         const sats = [
//             {
//                 x: 500,
//                 y: 500,
//             },
//             {
//                 x: 500,
//                 y: 400,
//             },
//         ];
//         for (let sat of sats) room.drawSatelite(ctx, sat);
//         for (let sat of room.cornerPoints.slice(1, 3))
//             room.drawSatelite(ctx, sat);
//     };

//     useEffect(() => {
//         canvas = canvasRef.current;
//         ctx = canvas.getContext('2d');
//         let frameCount = 0;
//         let animationFrameId;

//         // Our draw came here
//         const render = () => {
//             frameCount++;
//             draw(ctx, frameCount);
//             animationFrameId = window.requestAnimationFrame(render);
//         };
//         // render();

//         return () => {
//             window.cancelAnimationFrame(animationFrameId);
//         };
//     }, [draw]);

//     const handleClick = (event) => {
//         // 👇️ refers to the div element
//         console.log(event);
//         room.drawDot(
//             ctx,
//             ((event.clientX - canvas.offsetLeft) * canvas.width) /
//                 event.target.clientWidth,
//             ((event.clientY - canvas.offsetTop) * canvas.height) /
//                 event.target.clientHeight,
//             10,
//             'blue',
//             'green',
//             3
//         );
//         console.log('div clicked');
//     };

//     return (
//         <>
//             <canvas ref={canvasRef} {...props} onClick={handleClick} />
//         </>
//     );
// };

export default Canvas;
