import React from 'react';
import { useState } from 'react';

import icon_arrow_down from '../images/icons/other/arrow_down.svg';

const ignored_settings = [];

const FormatConfig = React.memo(({ config }) => {
    function capitalize(str) {
        return str.slice(0, 1).toUpperCase().concat(str.slice(1));
    }
    function formatKey(keyObj, depth) {
        switch (typeof keyObj) {
            case 'object':
                return <FormatObject obj={keyObj} depth={depth} />;
            // return FormatObject(keyObj, depth);
            case 'string':
                return FormatString(keyObj);
            case 'number':
                return FormatNumber(keyObj);
            case 'boolean':
                return FormatBoolean(keyObj);
            default:
                return <>{keyObj.toString()}</>;
        }
    }
    const FormatObject = ({ obj, depth }) => {
        const Format = ({ obj, obj_key }) => {
            const [collapse, setCollapse] = useState(true);

            const isObj = typeof obj[obj_key] === 'object';
            return (
                <div className={isObj ? 'object-section' : 'section'}>
                    <div
                        className={
                            isObj
                                ? `object-title ${!collapse ? 'btn-flipped' : ''}`
                                : 'title'
                        }
                    >
                        {isObj ? (
                            <button
                                className={`toggle-btn`}
                                value={true}
                                onClick={(e) => setCollapse(!collapse)}
                            >
                                <img src={icon_arrow_down} alt="arrow_down" />
                            </button>
                        ) : (
                            <></>
                        )}
                        {capitalize(obj_key)}:{' '}
                    </div>
                    <div className={isObj ? 'object-value' : ''}>
                        {collapse ? formatKey(obj[obj_key], depth + 1) : <></>}
                    </div>
                </div>
            );
        };

        return Object.keys(obj).map((obj_key, i) => {
            if (ignored_settings.includes(obj_key)) return null;

            return <Format obj={obj} obj_key={obj_key} key={i} />;
        });
    };
    const FormatString = (str) => {
        return (
            <input
                type={'text'}
                className="string"
                defaultValue={str}
                readOnly
            ></input>
        );
    };
    const FormatNumber = (num) => {
        return (
            <input
                type={'text'}
                className="number"
                defaultValue={num.toString()}
                readOnly
            ></input>
        );
    };
    const FormatBoolean = (bool) => {
        return (
            <label className="switch">
                <input
                    type={'checkbox'}
                    className="boolean"
                    defaultValue={bool}
                    defaultChecked={bool}
                    readOnly={true}
                ></input>
                <span className="slider round"></span>
            </label>
        );
    };

    return (
        <div className="config">
            <FormatObject obj={config} depth={0} />
        </div>
    );
}, (prevProps, nextProps) => prevProps.config === nextProps.config);

export default FormatConfig