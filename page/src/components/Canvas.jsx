import React from 'react';
import { useRef, useEffect, useState } from 'react';
import config from '../config.json';

const svgHeight = 500;
const svgWidth = svgHeight;

const dot_radius = 6;

const Canvas = ({ height, width }) => {
    const svgRef = useRef(null);
    const canvasRef = useRef(null)
    const [dots, setDots] = useState([
        {
            x: 100,
            y: 100,
        },
    ]);
    const [dotInfo, setDotInfo] = useState({
        focusedDot: {
            x: 0,
            y: 0,
        },
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
                <div className="title">Satelite</div>
                <div>Position: {'{x, y}'}</div>
                <div>Found devices: {'{num}'}</div>
            </div>
        );
    };

    useEffect(() => {
        // canvasRef.current.style = {
        //     maxHeight: "1200px"
        // } 
        // console.log("Applied style");
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
                    stroke="black"
                    strokeWidth={5}
                    fill="lightgray"
                />
            </>
        );
    };

    const HandleClick = (event) => {
        const eve_clientX = event.clientX;
        const eve_clientY = event.clientY;
        const eve_offsetLeft = svgRef.current.parentElement.offsetLeft;
        const eve_offsetTop = svgRef.current.parentElement.offsetTop;
        const svg_width = svgRef.current.clientWidth;
        const svg_height = svgRef.current.clientHeight;
        const par_width = event.target.parentElement.clientWidth;
        const par_height = event.target.parentElement.clientHeight;
        if (
            !eve_clientX ||
            !eve_clientY ||
            !eve_offsetLeft ||
            !eve_offsetTop ||
            !svg_width ||
            !svg_height ||
            !par_width ||
            !par_height
        ) {
            return;
        }

        const container =
            event.target.parentElement.parentElement.parentElement
                .parentElement;
        const canvas = event.target.parentElement.parentElement;

        setDots(() => {
            return [
                ...dots,
                {
                    x:
                        ((eve_clientX - eve_offsetLeft) * svg_width) /
                            par_width -
                        dot_radius * 2.4 +
                        canvas.scrollLeft,
                    y:
                        ((eve_clientY - eve_offsetTop) * svg_height) /
                            par_height -
                        dot_radius * 2.4 +
                        canvas.scrollTop +
                        container.scrollTop,
                },
            ];
        });
        setDotInfo({
            focusedDot: {
                x: 0,
                y: 0,
            },
            visibible: false,
            x: 0,
            y: 0,
        });
    };
    const HandleDotClick = (event) => {
        const eve_clientX = event.clientX;
        const eve_clientY = event.clientY;
        const canvas = event.target.parentElement.parentElement.parentElement;
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
        });
    };

    const HandleScroll = (event) => {
        const scrollTop = event.currentTarget.scrollTop;
        const scrollLeft = event.currentTarget.scrollLeft;

        setDotInfo((prev) => {
            return {
                focusedDot: {
                    x:prev.focusedDot.x,
                    y: prev.focusedDot.y,
                },
                visibible: prev.visibible,
                x: prev.focusedDot.x - scrollLeft,
                y: prev.focusedDot.y - scrollTop, //+ svg_height //+ par_height,
            };
        });
    };

    return (
        <div ref={canvasRef} className="canvas" onScroll={HandleScroll}>
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
        </div>
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
