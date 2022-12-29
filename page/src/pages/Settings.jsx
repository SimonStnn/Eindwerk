import { useState } from 'react';
import config from '../config.json';

import icon_arrow_down from '../images/icons/other/arrow_down.svg';

// import icon_plus from '../images/icons/other/plus.svg';

// const ignored_settings = ['showNames'];
const ignored_settings = [];

const Settings = ({ theme, setTheme }) => {
    const toggleTheme = () => {
        switch (theme) {
            case config.themes.light:
                return setTheme(config.themes.dark);
            case config.themes.dark:
                return setTheme(config.themes.light);
            default:
                return setTheme(config.themes.light);
        }
    };

    function capitalize(str) {
        return str.slice(0, 1).toUpperCase().concat(str.slice(1));
    }

    function formatKey(keyObj) {
        switch (typeof keyObj) {
            case 'object':
                return FormatObject(keyObj);
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

    const FormatObject = (obj) => {
        const [collapse, setCollapse] = useState(true);

        return Object.keys(obj).map((obj_key, i) => {
            if (ignored_settings.includes(obj_key)) return null;
            const isObj = typeof obj[obj_key] === 'object';
            return (
                <div key={i} className={isObj ? 'object-section' : 'section'}>
                    <div className={isObj ? 'object-title' : 'title'}>
                        {capitalize(obj_key)}:{' '}
                        {isObj ? (
                            <button
                                className={`toggle-button ${
                                    collapse ? 'flipped' : ''
                                    }`}
                                value={true}
                                onClick={(e) => setCollapse(!collapse)}
                            >
                                <img src={icon_arrow_down} alt="arrow_down" />
                            </button>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className={isObj ? 'object-value' : ''}>
                        {formatKey(obj[obj_key])}
                        {/* <button className="config-button" n>
                            <img src={icon_plus} alt="icon_plus" />
                            Add to Object
                        </button> */}
                    </div>
                </div>
            );
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
        <div className="settings">
            <h1>Settings</h1>
            <div className="inline">
                Toggle Theme:{' '}
                <button className="toggle-theme btn" onClick={toggleTheme}>
                    {theme}
                </button>
            </div>
            <hr />
            <p>Changes will not be applied.</p>
            <h2>Config file</h2>
            <div className="config">{FormatObject(config)}</div>
        </div>
    );
};

export default Settings;
