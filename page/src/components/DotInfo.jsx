import React from 'react';

// import icon_move from '../images/icons/canvas/move.svg';
// import icon_movetoRoom from '../images/icons/canvas/moveToRoom.svg';

const DotInfo = ({ x, y, visibible, type, dot, selectedDot }) => {
    // const emptyDotsInfo = {
    //     focusedDot: {
    //         x: 0,
    //         y: 0,
    //     },
    //     visibible: false,
    //     x: 0,
    //     y: 0,
    //     dot: {
    //         x: 0,
    //         y: 0,
    //         name: '',
    //         addr: '',
    //     },
    //     type: 'None',
    //     selectedDot: null,
    // };
    // const HandleClick = (event) => {
    //     if (event.target.parentElement.localName === 'g') return;
    //     const canvas = event.target.parentElement.parentElement;
    //     const container =
    //         event.target.parentElement.parentElement.parentElement
    //             .parentElement;
    //     const svg = svgRef.current;
    //     const eve_clientX = event.clientX;
    //     const eve_clientY = event.clientY;
    //     const eve_offsetLeft = svg.parentElement.offsetLeft;
    //     const eve_offsetTop = svg.parentElement.offsetTop;
    //     const svg_width = svg.clientWidth;
    //     const svg_height = svg.clientHeight;
    //     const par_width = event.target.parentElement.clientWidth;
    //     const par_height = event.target.parentElement.clientHeight;

    //     if (moveDot[0] !== null) {
    //         const [, dot] = moveDot;

    //         dot.setPosition(
    //             Math.floor(
    //                 ((eve_clientX - eve_offsetLeft) * svg_width) / par_width +
    //                     canvas.scrollLeft +
    //                     container.scrollLeft -
    //                     dot_radius * 1.6
    //             ),
    //             Math.floor(
    //                 ((eve_clientY - eve_offsetTop) * svg_height) / par_height +
    //                     canvas.scrollTop +
    //                     container.scrollTop -
    //                     dot_radius * 1.6
    //             )
    //         );
    //         updatePosition(dot.addr, dot.x, dot.y);
    //         moveDot = moveDotDefault;
    //     }

    //     // setDotInfo(emptyDotsInfo);
    // };

    // const HandleScroll = (event) => {
    //     const scrollTop = event.currentTarget.scrollTop;
    //     const scrollLeft = event.currentTarget.scrollLeft;

    //     // setDotInfo((prev) => {
    //     //     prev.x = prev.focusedDot.x - scrollLeft;
    //     //     prev.y = prev.focusedDot.y - scrollTop;
    //     //     return prev;
    //     // });
    // };

    // const Button = ({ img, text, onClick }) => {
    //     return (
    //         <>
    //             <div className="dotInfo-button" onClick={onClick}>
    //                 <img src={img} alt={`${text} Icon`} />
    //                 <div>{text}</div>
    //             </div>
    //         </>
    //     );
    // };

    // return (
    //     <div
    //         // ref={dotInfoRef}
    //         className="dotInfo"
    //         style={{
    //             left: x,
    //             top: y,
    //             visibility: visibible ? 'visible' : 'hidden',
    //         }}
    //     >
    //         <div className="title">{type}</div>
    //         <div className="info">
    //             <div>{dot.name}</div>
    //             <div>{dot.addr}</div>
    //         </div>
    //         <div>
    //             Position: {dot.x ? Math.floor(dot.x) : '?'},{' '}
    //             {dot.y ? Math.floor(dot.y) : '?'}
    //         </div>
    //         {selectedDot?.moveble ? (
    //             <>
    //                 <Button
    //                     img={icon_move}
    //                     text={'Move'}
    //                     onClick={(event) => MoveDot(event, selectedDot)}
    //                 />
    //                 <Button
    //                     img={icon_movetoRoom}
    //                     text={'To new room'}
    //                     onClick={() => {}}
    //                 />
    //             </>
    //         ) : (
    //             <></>
    //         )}
    //     </div>
    //);


    return <div>
        Hello world
    </div>
};

export default DotInfo;  
