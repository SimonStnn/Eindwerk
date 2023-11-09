import React from 'react';
import { useEffect, useState, useCallback } from 'react';

const emptyDistance = {
    distance: null,
    values: [],
    active: true,
    index: -1,
};

const Callibrate = React.memo(
    ({ collection, addNotification, callib, websocket }) => {
        const [[callibrate, setCallibrate], [, setCallibrating]] = callib;
        const [distances, setDistances] = useState([emptyDistance]);
        const [autoCollect, setAutoCollect] = useState(false);

        const handleSaveCallibration = (e) => {
            console.log(distances);
            for (const dist of distances) {
                if (!dist.distance) {
                    return addNotification({
                        content: <>Make sure each text field has a value.</>,
                    });
                }
                if (isNaN(dist.distance)) {
                    return addNotification({
                        content: <>{dist.distance} is not a valid distance.</>,
                    });
                }
                if (dist.values.length === 0) {
                    return addNotification({
                        content: (
                            <>
                                Make sure distance {dist.distance} has rssi
                                values.
                                <br /> To do this set distance {
                                    dist.distance
                                }{' '}
                                as active and start collecting.
                            </>
                        ),
                    });
                }
            }

            setCallibrating(false);
            addNotification({
                content: <>Callibration saved.</>,
            });

            const distancesSerialized = distances.map((dist) => {
                function getMedian(numbers) {
                    numbers.sort((a, b) => a - b);
                    const middleIndex = Math.floor(numbers.length / 2);
                    if (numbers.length % 2 !== 0) {
                        return numbers[middleIndex];
                    }
                    return (
                        (numbers[middleIndex - 1] + numbers[middleIndex]) / 2
                    );
                }
                return `|${dist.distance}&${getMedian(dist.values)}`;
            });
            const data = `${callibrate.sat}&${callibrate.dev}&${
                callibrate.default ? 'Y' : 'N'
            }${distancesSerialized.join('')}`;
            websocket.send(`CALLIBRATE=${data}`);
            console.log('Send callibrate command');
        };
        const handleCancelCallibration = (e) => {
            setCallibrating(false);
            setDistances([]);
            addNotification({
                content: <>Callibration cancelled.</>,
            });
        };

        const handleNewDistanceClick = (e) => {
            if (distances.find((dist) => dist.active).distance === null) {
                return addNotification({
                    content: 'You need to add a distance first.',
                });
            }
            distances.map((d) => {
                d.active = false;
                return d;
            });
            setDistances([...distances, emptyDistance]);
            setAutoCollect(false);
        };

        const toggleDefaultPle = (e) => {
            setCallibrate((prev) => {
                return {
                    ...prev,
                    default: !prev.default,
                };
            });
        };

        const getDeviceRssi = useCallback(
            (addr) => {
                const dev = Object.values(
                    collection.sats[callibrate.sat].found_devices
                ).find((dev) => dev.addr === addr);
                return dev.rssi;
            },
            [collection.sats, callibrate.sat]
        );

        const CallibrationValue = ({ distance, values, active, index }) => {
            // const val = distances.reduce((prev, cur) => cur.active).distance;
            const RssiValue = ({ value }) => {
                return <div className="box">{value}</div>;
            };
            const RssiValues = () => {
                return values.map((value, i) => {
                    return <RssiValue value={value} key={i} />;
                });
            };
            const handleDistanceInputChange = (e) => {
                setDistances(
                    distances.map((d, i) =>
                        i === index ? { ...d, distance: e.target.value } : d
                    )
                );
            };
            const toggleAutoCollect = () => {
                setAutoCollect(!autoCollect);
            };
            const handleSetActive = () => {
                setDistances(
                    distances.map((dist, i) => {
                        if (dist.active) {
                            dist.active = false;
                        }
                        if (index === i) {
                            dist.active = true;
                        }
                        return dist;
                    })
                );
            };

            return (
                <div className="callibration-value">
                    <input
                        className="distance-field"
                        type="text"
                        placeholder="Distance from ESP"
                        defaultValue={distance ? distance : ''}
                        onChange={handleDistanceInputChange}
                        onClick={handleSetActive}
                        autoFocus={active}
                    />
                    <div className={'rssi-values'}>
                        <RssiValues />
                    </div>
                    {active ? (
                        <button className="btn" onClick={toggleAutoCollect}>
                            {autoCollect ? 'Stop' : 'Start'} auto collecting
                        </button>
                    ) : (
                        <button
                            className="btn"
                            onClick={(e) => {
                                handleSetActive();
                                setAutoCollect(false);
                            }}
                        >
                            Set active
                        </button>
                    )}
                </div>
            );
        };

        useEffect(() => {
            if (
                autoCollect &&
                Object.values(
                    collection.sats[callibrate.sat].found_devices
                ).find((dev) => dev.addr === callibrate.dev)
            ) {
                setDistances((prevDistances) =>
                    prevDistances.map((dist) =>
                        dist.active
                            ? {
                                  ...dist,
                                  values: [
                                      ...dist.values,
                                      getDeviceRssi(callibrate.dev),
                                  ],
                              }
                            : dist
                    )
                );
            }
        }, [
            collection,
            autoCollect,
            callibrate.sat,
            callibrate.dev,
            getDeviceRssi,
        ]);

        return (
            <>
                <div>
                    <h3>Started Callibration</h3>
                    <div>Satellite: {callibrate.sat}</div>
                    <div>Device: {callibrate.dev}</div>
                    <h5>-</h5>
                </div>

                <div className="callibration">
                    <div className="callibration-values">
                        {distances.map((cal, i) => {
                            cal.index = i;
                            return <CallibrationValue key={i} {...cal} />;
                        })}
                    </div>
                    <div className="callibration-buttons">
                        <div>
                            <button
                                className="btn"
                                onClick={handleNewDistanceClick}
                            >
                                New
                            </button>
                        </div>
                        <div>
                            Set as default Path loss exponent:{' '}
                            <label className="switch">
                                <input
                                    type={'checkbox'}
                                    className="boolean"
                                    defaultValue={callibrate.default}
                                    defaultChecked={callibrate.default}
                                    readOnly={true}
                                    onClick={toggleDefaultPle}
                                ></input>
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div>
                            <button
                                className="btn"
                                onClick={handleCancelCallibration}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn"
                                onClick={handleSaveCallibration}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    },
    (prevProps, nextProps) => {
        const prevCallibrate = prevProps.callib[0][0];
        const nextCallibrate = nextProps.callib[0][0];
        const prevSat = prevProps.collection.sats[prevCallibrate.sat].timestamp;
        const nextSat = nextProps.collection.sats[prevCallibrate.sat].timestamp;

        return prevSat === nextSat && prevCallibrate === nextCallibrate;
    }
);

export default Callibrate;
