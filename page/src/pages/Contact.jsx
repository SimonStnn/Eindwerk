import React from 'react';
import Canvas from '../components/Canvas';

const Contact = () => {
    return (
        <>
            <h1>Contact me</h1>
            <div>No, look at this canvas instead.</div>
            <div className="canvas">
                {/* <Canvas width={canvasDiv.offsetWidth} height={canvasDiv.offsetHeight} /> */}
                <Canvas />
            </div>
        </>
    );
};

export default Contact;
