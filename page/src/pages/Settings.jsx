import config from '../config.json';

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
                return formatObject(keyObj);
            case 'string':
                return formatString(keyObj);
            case 'number':
                return formatNumber(keyObj);
            case 'boolean':
                return formatBoolean(keyObj);
            default:
                return <>{keyObj.toString()}</>;
        }
    }

    function formatObject(obj) {
        return Object.keys(obj).map((obj_key, i) => {
            if (ignored_settings.includes(obj_key)) return null;
            const isObj = typeof obj[obj_key] === 'object';
            return (
                <div key={i} className={isObj ? 'object-section' : 'section'}>
                    <div className={isObj ? 'object-title' : 'title'}>
                        {capitalize(obj_key)}:
                    </div>
                    <div className={isObj ? 'object-value' : ''}>
                        {formatKey(obj[obj_key])}
                    </div>
                </div>
            );
        });
    }

    function formatString(str) {
        return (
            <input
                type={'text'}
                className="string"
                defaultValue={str}
                readOnly
            ></input>
        );
    }
    function formatNumber(num) {
        return (
            <input
                type={'text'}
                className="number"
                defaultValue={num.toString()}
                readOnly
            ></input>
        );
    }
    function formatBoolean(bool) {
        return (
            <label className='switch'>
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
    }

    return (
        <div className="settings">
            <h1>Settings</h1>
            Toggle Theme: <button onClick={toggleTheme}>{theme}</button>
            <hr />
            <p>Changes will not be aplied</p>
            <h2>Config file</h2>
            {formatObject(config)}
        </div>
    );
};

export default Settings;
