import React from 'react';

import icon_satelite from '../images/icons/satelite.svg'

const Satelite = ({ data }) => {
    const { name, mac, ip, posx, posy } = data;
    return (
        <>
            <div className="satelite">
                <div className="info">
                    <div className='section left'>
                        <img src={icon_satelite} alt="Satelite Icon" />
                        <div className='coords'>X: {posx}</div>
                        <div className='coords'>Y: {posy}</div>
                    </div>
                    <div className='section right'>
                        <div>{name}</div>
                        <div>{mac}</div>
                        <div>{ip}</div>
                    </div>
                    
                </div>
            </div>
        </>
    );
};
export default Satelite;
