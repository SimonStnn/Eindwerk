import React from 'react';
import { useState, useRef } from 'react';
import Callibrate from '../components/Callibrate';
import config from '../config.json';
import FormatConfig from '../components/FormatConfig';

const webserver_ip = 'http://10.250.3.99:7891/';

function capitalize(str) {
    return str.slice(0, 1).toUpperCase().concat(str.slice(1));
}

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
        default: true,
    });

    const toggleTheme = () => {
        switch (theme) {
            case config.themes.light:
                return setTheme(config.themes.dark);
            case config.themes.dark:
                return setTheme(config.themes.light);
            default:
                return setTheme(config.themes.dark);
        }
    };

    const showTestNotification = () => {
        addNotification({
            content: 'Test notification',
        });
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

    const LoggerModule = ({ name, state, websocket }) => {
        const [enabled, setEnabled] = useState(state);
        return (
            <div className="box logger">
                <h3>{capitalize(name)}</h3>
                <span>Enable debug logging: </span>
                <label className="switch">
                    <input
                        type={'checkbox'}
                        className="boolean"
                        defaultValue={enabled}
                        defaultChecked={enabled}
                        readOnly={true}
                        onClick={(e) => {
                            collection.loggers[name] = !enabled;
                            websocket.send(
                                `DEBUG=${name}&${!enabled ? '1' : '0'}`
                                );
                            setEnabled(!enabled);
                        }}
                    ></input>
                    <span className="slider round"></span>
                </label>{' '}
            </div>
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
                    src={`${webserver_ip}raw`}
                    ref={iframeRef}
                ></iframe>
            </div>
            <hr />
            <h2>Logging</h2>
            <div className="loggers">
                {collection.loggers ? (
                    Object.keys(collection.loggers).map((item, i) => {
                        return (
                            <LoggerModule
                                name={item}
                                state={collection.loggers[item]}
                                websocket={websocket}
                                key={i}
                            />
                        );
                    })
                ) : (
                    <>No loggers available</>
                )}
            </div>
            <hr />
            <p>Changes will not be applied.</p>
            <h2>Config file</h2>
            <FormatConfig config={config} />
        </div>
    );
};

export default Settings;
