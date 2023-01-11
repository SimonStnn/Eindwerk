import React from 'react';
import { useState, useEffect } from 'react';

const Notification = ({ notification }) => {
    return (
        <div className={`notification ${notification.visible ? '' : 'hidden'}`}>
            <div>{notification.content}</div>
        </div>
    );
};

export default Notification;
