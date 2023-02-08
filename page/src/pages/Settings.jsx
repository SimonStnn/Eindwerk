import React from 'react';
import { useState, useRef } from 'react';
import Callibrate from '../components/Callibrate';
import config from '../config.json';

import icon_arrow_down from '../images/icons/other/arrow_down.svg';

// import icon_plus from '../images/icons/other/plus.svg';

const webserver_ip = 'http://10.250.3.99:7891/';
// const ignored_settings = ['showNames'];
const ignored_settings = [];

const Settings = ({
    collection,
    theme,
    setTheme,
    addNotification,
    websocket,
}) => {
    const iframeRef = useRef(null);
    const [callibrating, setCallibrating] = useState(false);
    const [callibrate, setCallibrate] = useState({
        dev: 'dmlfsqkjm',
        default: true,
    });

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

    const showTestNotification = () => {
        addNotification({
            content: 'Test notification',
        });
    };

    function capitalize(str) {
        return str.slice(0, 1).toUpperCase().concat(str.slice(1));
    }

    function formatKey(keyObj, depth) {
        switch (typeof keyObj) {
            case 'object':
                return FormatObject(keyObj, depth);
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
    const FormatObject = (obj, depth) => {
        const Format = ({ obj, obj_key }) => {
            const [collapse, setCollapse] = useState(true);

            const isObj = typeof obj[obj_key] === 'object';
            return (
                <div className={isObj ? 'object-section' : 'section'}>
                    <div className={isObj ? 'object-title' : 'title'}>
                        {isObj ? (
                            <button
                                className={`toggle-button ${
                                    !collapse ? 'flipped' : ''
                                }`}
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

    const handleStartCallibration = (e) => {
        console.log(callibrate);
        if (!callibrate.sat || !callibrate.dev) return;
        setCallibrating(true);
        addNotification({
            content: (
                <>
                    Callibration started. <u>Do not close</u> this page.
                </>
            ),
        });
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
            <div>
                <button className="btn" onClick={showTestNotification}>
                    show test Notification
                </button>
            </div>
            <hr />
            <h2>Callibrate</h2>
            {!callibrating ? (
                <>
                    <select
                        onChange={(e) => {
                            setCallibrate({
                                ...callibrate,
                                sat: e.target.value,
                            });
                            console.log(callibrate, e.target.value);
                        }}
                    >
                        {collection.sats ? (
                            <>
                                <option value={null}>
                                    Select a satellite to callibrate
                                </option>
                                {Object.values(collection.sats)?.map(
                                    (val, i) => {
                                        const sat = val.sat;
                                        if (
                                            i === 0 &&
                                            (callibrate.sat !== sat.addr ||
                                                callibrate.sat === null)
                                        ) {
                                            // setCallibrate({
                                            //     ...callibrate,
                                            //     sat: sat.addr,
                                            // });
                                        }
                                        return (
                                            <option key={i} value={sat.addr}>
                                                {sat.name}
                                            </option>
                                        );
                                    }
                                )}
                            </>
                        ) : (
                            <></>
                        )}
                    </select>
                    <select
                        onChange={(e) => {
                            setCallibrate({
                                ...callibrate,
                                // dev_name:
                                dev: e.target.value,
                            });
                            console.log(callibrate);
                        }}
                    >
                        {
                            // list the found devices by the satellite
                            collection?.sats &&
                            collection?.sats[callibrate.sat] &&
                            callibrate.sat ? (
                                <>
                                    <option value={null}>
                                        Select a device to use as callibrator
                                    </option>

                                    {collection?.sats[callibrate.sat].devs.map(
                                        (dev, i) => {
                                            if (
                                                i === 0 &&
                                                (callibrate.dev !== dev.addr ||
                                                    callibrate.dev === null)
                                            ) {
                                                // setCallibrate({
                                                //     ...callibrate,
                                                //     dev: dev.addr,
                                                // });
                                            }
                                            return (
                                                <option
                                                    key={i}
                                                    value={dev.addr}
                                                >
                                                    {dev.name
                                                        ? dev.name
                                                        : dev.addr}
                                                </option>
                                            );
                                        }
                                    )}
                                </>
                            ) : (
                                <></>
                            )
                        }
                    </select>
                    <button className="btn" onClick={handleStartCallibration}>
                        Start callibration
                    </button>
                </>
            ) : (
                <Callibrate
                    collection={collection}
                    addNotification={addNotification}
                    callib={[
                        [callibrate, setCallibrate],
                        [callibrating, setCallibrating],
                    ]}
                    websocket={websocket}
                />
            )}
            <hr />
            <h2>Raw data</h2>
            <div>
                <div>
                    <button
                        className="btn"
                        onClick={() => {
                            // iframeRef.current.contentWindow.location.reload();
                            iframeRef.current.src += '';
                        }}
                    >
                        Refresh
                    </button>
                    <a href={webserver_ip} target={'_blank'} rel="noreferrer">
                        <button className="btn">Open in new page</button>
                    </a>
                </div>
                <iframe
                    title="webserver_collection"
                    id="server_iframe"
                    src={webserver_ip}
                    ref={iframeRef}
                ></iframe>
            </div>
            <hr />

            <p>Changes will not be applied.</p>
            <h2>Config file</h2>
            <div className="config">{FormatObject(config, 0)}</div>
        </div>
    );
};

export default Settings;
