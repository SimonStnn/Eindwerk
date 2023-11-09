import React from 'react';

import icon_satelite from '../images/icons/satelite.svg';

const Satelite = ({ name, addr, ip, x, y }) => {
    return (
        <div className="satelite">
            <div className="info">
                <div className="section left">
                    <img src={icon_satelite} alt="Satelite Icon" />
                    <div className="coords">X: {x}</div>
                    <div className="coords">Y: {y}</div>
                </div>
                <div className="section right">
                    <div><b>{name}</b></div>
                    <div>{addr}</div>
                    {ip ? <div>{ip}</div> : null}
                </div>
            </div>
        </div>
    );
};
export default Satelite;
