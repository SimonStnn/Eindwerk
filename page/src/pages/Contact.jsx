import React from 'react';
import Canvas from '../components/Canvas';

const Contact = ({ satelites, devices }) => {
    return (
        <>
            <h1>Canvas</h1>
            <Canvas satelites={satelites} devices={devices} />
        </>
    );
};

export default Contact;
