import React from 'react';
import Canvas from '../components/Canvas';

const Contact = ({ collection, websocket }) => {
    return (
        <>
            <h1>Canvas</h1>
            <Canvas collection={collection} websocket={websocket} />
        </>
    );
};

export default Contact;
