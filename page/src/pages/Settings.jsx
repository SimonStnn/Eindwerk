import config from '../config.json'

const Settings = ({ theme , setTheme}) => {
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

    return (
        <>
            <h1>Settings</h1>
            <button onClick={toggleTheme}>Toggle Theme: {theme}</button>
        </>
    );
};

export default Settings;
